export function Logos() {
    const stats = [
        { value: '120+', label: 'Clínicas ativas' },
        { value: '40%', label: 'Mais retorno de pacientes' },
        { value: '3h/sem', label: 'Economizadas por profissional' },
        { value: '5 min', label: 'Para configurar' },
    ]

    return (
        <section className="py-12 border-y border-[#0A1F3D]/8 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#0A1F3D]/8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center px-4">
                            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F3D]">{stat.value}</div>
                            <div className="text-sm text-[#64748B] mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
