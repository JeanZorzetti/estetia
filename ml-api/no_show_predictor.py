"""
No-show prediction model for Estética & Dermatologia CRM.

Simple rule-based + statistical model that scores appointment no-show risk (0-100).
Falls back to heuristics when insufficient historical data (<30 sessions).

API: POST /predict  { session_id, organization_id, db_url }
     GET  /health
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import psycopg2
import psycopg2.extras
import os
import math
from datetime import datetime, timezone

app = FastAPI(title="No-show Predictor", version="1.0.0")

DATABASE_URL = os.getenv("DATABASE_URL", "")


# ─── Models ────────────────────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    session_id: str
    organization_id: str
    db_url: Optional[str] = None  # override DATABASE_URL for testing


class PredictResponse(BaseModel):
    session_id: str
    score: int          # 0-100
    risk_level: str     # "LOW" | "MEDIUM" | "HIGH"
    factors: list[str]  # human-readable risk factors


class BulkPredictRequest(BaseModel):
    organization_id: str
    days_ahead: int = 7
    db_url: Optional[str] = None


# ─── DB ────────────────────────────────────────────────────────────────────────

def get_conn(db_url: Optional[str] = None):
    url = db_url or DATABASE_URL
    if not url:
        raise RuntimeError("DATABASE_URL not set")
    return psycopg2.connect(url, cursor_factory=psycopg2.extras.RealDictCursor)


def fetch_session_context(conn, session_id: str, organization_id: str) -> Optional[dict]:
    with conn.cursor() as cur:
        cur.execute("""
            SELECT
                ts.id,
                ts."dataAgendada",
                ts."duracaoMinutos",
                ts.status,
                p.id AS paciente_id,
                p."dataNascimento",
                p.origem,
                (
                    SELECT COUNT(*) FROM "TreatmentSession" ts2
                    JOIN "Treatment" t2 ON t2.id = ts2."treatmentId"
                    WHERE t2."pacienteId" = p.id
                    AND ts2.status = 'NO_SHOW'
                ) AS no_show_count,
                (
                    SELECT COUNT(*) FROM "TreatmentSession" ts3
                    JOIN "Treatment" t3 ON t3.id = ts3."treatmentId"
                    WHERE t3."pacienteId" = p.id
                    AND ts3.status IN ('REALIZADA', 'NO_SHOW', 'CANCELADA', 'REMARCADA')
                ) AS total_sessions
            FROM "TreatmentSession" ts
            JOIN "Treatment" t ON t.id = ts."treatmentId"
            JOIN "Patient" p ON p.id = t."pacienteId"
            WHERE ts.id = %s AND ts."organizationId" = %s
        """, (session_id, organization_id))
        return cur.fetchone()


def fetch_org_no_show_rate(conn, organization_id: str) -> float:
    with conn.cursor() as cur:
        cur.execute("""
            SELECT
                COUNT(*) FILTER (WHERE ts.status = 'NO_SHOW') AS no_shows,
                COUNT(*) FILTER (WHERE ts.status IN ('REALIZADA','NO_SHOW','CANCELADA')) AS total
            FROM "TreatmentSession" ts
            WHERE ts."organizationId" = %s
        """, (organization_id,))
        row = cur.fetchone()
        if not row or not row["total"] or row["total"] < 10:
            return 0.15  # default 15% base rate
        return row["no_shows"] / row["total"]


# ─── Scoring ───────────────────────────────────────────────────────────────────

def compute_score(ctx: dict, org_no_show_rate: float) -> tuple[int, list[str]]:
    score = 0
    factors = []

    now = datetime.now(timezone.utc)
    data_agendada = ctx["dataAgendada"]
    if data_agendada.tzinfo is None:
        data_agendada = data_agendada.replace(tzinfo=timezone.utc)

    hours_until = (data_agendada - now).total_seconds() / 3600

    # ── Base rate from org history ──
    base = int(org_no_show_rate * 40)  # 0-40 pts
    score += base

    # ── Lead time risk ──
    if hours_until < 12:
        score += 20
        factors.append("Agendamento em menos de 12h")
    elif hours_until < 24:
        score += 12
        factors.append("Agendamento em menos de 24h")
    elif hours_until < 48:
        score += 6
        factors.append("Agendamento em menos de 48h")

    # ── Day of week ──
    dow = data_agendada.weekday()  # 0=Mon, 6=Sun
    if dow == 4:  # Friday
        score += 8
        factors.append("Sexta-feira (maior taxa histórica)")
    elif dow == 0:  # Monday
        score += 5
        factors.append("Segunda-feira")
    elif dow in (5, 6):  # Weekend
        score += 10
        factors.append("Fim de semana")

    # ── Hour of day ──
    hour = data_agendada.hour
    if hour < 8 or hour > 18:
        score += 10
        factors.append("Horário fora do pico (antes das 8h ou após 18h)")
    elif hour < 9:
        score += 5
        factors.append("Horário cedo (antes das 9h)")

    # ── Patient historical no-show rate ──
    total_hist = ctx.get("total_sessions", 0) or 0
    no_show_hist = ctx.get("no_show_count", 0) or 0

    if total_hist >= 3:
        patient_rate = no_show_hist / total_hist
        patient_score = int(patient_rate * 50)
        score += patient_score
        if patient_rate > 0.5:
            factors.append(f"Paciente com alto histórico de no-show ({int(patient_rate*100)}%)")
        elif patient_rate > 0.25:
            factors.append(f"Paciente com histórico moderado de no-show ({int(patient_rate*100)}%)")
    elif total_hist == 0:
        score += 8
        factors.append("Paciente novo (sem histórico)")

    # ── Origin channel ──
    origem = (ctx.get("origem") or "").lower()
    if origem in ("instagram", ""):
        score += 5
        factors.append("Origem: Instagram (maior taxa de no-show vs. indicação)")
    elif origem == "indicacao":
        score -= 5  # referrals are more committed

    # Clamp to [0, 100]
    score = max(0, min(100, score))

    if not factors:
        factors.append("Risco base normal")

    return score, factors


# ─── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "model": "rule-based-v1"}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        conn = get_conn(req.db_url)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"DB connection failed: {e}")

    try:
        ctx = fetch_session_context(conn, req.session_id, req.organization_id)
        if not ctx:
            raise HTTPException(status_code=404, detail="Session not found")

        org_rate = fetch_org_no_show_rate(conn, req.organization_id)
        score, factors = compute_score(dict(ctx), org_rate)

        risk_level = "LOW" if score < 35 else ("MEDIUM" if score < 65 else "HIGH")

        # Persist score
        with conn.cursor() as cur:
            cur.execute(
                'UPDATE "TreatmentSession" SET "noShowScore" = %s WHERE id = %s',
                (score, req.session_id)
            )
        conn.commit()

        return PredictResponse(
            session_id=req.session_id,
            score=score,
            risk_level=risk_level,
            factors=factors,
        )
    finally:
        conn.close()


@app.post("/predict/bulk")
def predict_bulk(req: BulkPredictRequest):
    """Score all upcoming sessions in the next N days for an org."""
    try:
        conn = get_conn(req.db_url)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"DB connection failed: {e}")

    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id FROM "TreatmentSession"
                WHERE "organizationId" = %s
                  AND status IN ('AGENDADA', 'CONFIRMADA')
                  AND "dataAgendada" >= NOW()
                  AND "dataAgendada" <= NOW() + INTERVAL '%s days'
                  AND "noShowScore" IS NULL
            """, (req.organization_id, req.days_ahead))
            session_ids = [row["id"] for row in cur.fetchall()]

        org_rate = fetch_org_no_show_rate(conn, req.organization_id)
        results = []

        for sid in session_ids:
            ctx = fetch_session_context(conn, sid, req.organization_id)
            if not ctx:
                continue
            score, factors = compute_score(dict(ctx), org_rate)
            with conn.cursor() as cur:
                cur.execute(
                    'UPDATE "TreatmentSession" SET "noShowScore" = %s WHERE id = %s',
                    (score, sid)
                )
            results.append({"session_id": sid, "score": score})

        conn.commit()
        return {"updated": len(results), "results": results}
    finally:
        conn.close()
