import {
  LayoutDashboard, ClipboardList, Syringe, Camera, Package, Repeat2,
  MessageCircle, BadgeCheck, Megaphone, Instagram,
  Wallet, FileCheck2, RefreshCw, BarChart3,
  Sparkles, Brain, Rocket, Workflow,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, ClipboardList, Syringe, Camera, Package, Repeat2,
  MessageCircle, BadgeCheck, Megaphone, Instagram,
  Wallet, FileCheck2, RefreshCw, BarChart3,
  Sparkles, Brain, Rocket, Workflow,
  Stethoscope,
}

export function resolveIcon(name: string): LucideIcon {
  return ICONS[name] ?? Stethoscope
}
