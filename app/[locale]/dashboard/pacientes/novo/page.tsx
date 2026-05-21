import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { NovoPacienteForm } from '@/components/pacientes/novo-paciente-form'
import { UserPlus, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NovoPacientePage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Premium Micro-Grain background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[radial-gradient(#0A1F3D_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Decorative ambient lighting halos */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 rounded-full bg-[#489FB5]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 rounded-full bg-[#C5A059]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back navigation */}
        <Link
          href="/dashboard/pacientes"
          className="group inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 hover:text-[#0A1F3D] transition-colors uppercase mb-5"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Voltar para Pacientes</span>
        </Link>

        {/* Elegant VIP Reception Clipboard Plate */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/70 backdrop-blur-xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.05)] transition-all duration-500">
          {/* Subtle inside double-border */}
          <div className="absolute inset-0.5 rounded-[22px] border border-white/50 pointer-events-none" />

          {/* Header section with classic Serif typography */}
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-8 mb-8">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 text-[9px] font-bold text-[#8E6D31] tracking-widest uppercase mb-3">
                Cadastrar Ficha Clínica
              </span>
              <h1 className="font-serif font-bold text-3xl text-slate-800 tracking-wide">
                Novo Paciente
              </h1>
              <p className="text-xs font-medium text-slate-400 mt-1.5 max-w-md leading-relaxed">
                Insira as credenciais e dados de saúde para integrá-lo à cabine de inteligência clínica do Estetia CRM.
              </p>
            </div>

            {/* Icon Container resembling a premium jewel box */}
            <div className="self-start sm:self-center flex items-center justify-center p-3 rounded-2xl bg-white shadow-md shadow-slate-100/50 border border-slate-100 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <UserPlus className="w-6 h-6 text-[#489FB5]" />
            </div>
          </div>

          {/* Form component */}
          <NovoPacienteForm />
        </div>
      </div>
    </div>
  )
}

