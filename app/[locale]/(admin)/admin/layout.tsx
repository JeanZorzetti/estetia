import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ShieldAlert,
    ArrowLeft,
    Activity,
    LifeBuoy,
    LayoutDashboard,
    Users,
    Building2,
    BarChart3,
    Smartphone,
    Search,
    TrendingUp,
    Network,
    Scale,
    DollarSign,
    Stethoscope,
    ClipboardList,
    Heart,
    Server,
    ChevronDown,
} from "lucide-react"
import { AdminNav } from "./admin-nav"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()
    if (!session || !session.user?.email) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true, isRoiLabsStaff: true },
    })

    if (!user || user.role !== "ADMIN" || !user.isRoiLabsStaff) {
        redirect("/dashboard")
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-950">
            {/* Admin Header */}
            <header className="sticky top-0 z-50 flex h-16 items-center border-b border-slate-800 bg-slate-950 px-6 shadow-lg">
                <div className="flex items-center gap-2 font-bold">
                    <ShieldAlert className="h-5 w-5 text-amber-400" />
                    <span className="text-sm font-semibold tracking-widest uppercase text-amber-400">
                        ESTETIA
                    </span>
                    <span className="text-xs font-medium tracking-widest uppercase text-slate-500">
                        ADMIN
                    </span>
                </div>

                <AdminNav />

                <div className="ml-auto">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar ao App
                    </Link>
                </div>
            </header>

            {/* Admin Content */}
            <main className="flex-1 p-6">
                <div className="mx-auto w-full" style={{ maxWidth: "1600px" }}>
                    {children}
                </div>
            </main>
        </div>
    )
}
