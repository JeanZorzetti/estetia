export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");

    // LGPD retention cleanup (audit 06/2026): monthly, in-process — replaces
    // the never-scheduled cron-job.org job. Calls the existing authenticated
    // route so the logic lives in one place.
    // ponytail: single-container deploy; route is idempotent if ever duplicated
    if (process.env.NODE_ENV === "production" && process.env.CRON_SECRET) {
      const { schedule } = await import("node-cron");
      schedule("0 4 1 * *", async () => {
        try {
          const res = await fetch(
            `http://127.0.0.1:${process.env.PORT || 3000}/api/cron/lgpd-retention-cleanup`,
            { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } }
          );
          console.log(`[CRON:LGPD-RETENTION] scheduled run → HTTP ${res.status}`);
        } catch (err) {
          console.error("[CRON:LGPD-RETENTION] scheduled run failed", err);
        }
      });
    }
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = async (
  error: Error & { digest?: string },
  request: {
    path: string;
    method: string;
    headers: { [key: string]: string };
  },
  context: {
    routerKind: "Pages Router" | "App Router";
    routePath: string;
    routeType: "render" | "route" | "action" | "middleware";
    renderSource?: "react-server-components" | "react-server-components-payload" | "server-rendering";
    revalidateReason?: "on-demand" | "stale" | undefined;
    renderType?: "dynamic" | "dynamic-resume";
  }
) => {
  const Sentry = await import("@sentry/nextjs");

  Sentry.captureException(error, {
    extra: {
      request,
      context,
    },
  });
};
