import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System | Estetia CRM",
  description:
    "Explore o design system do Estetia CRM com componentes, tokens de design, padrões e melhores práticas para construir interfaces consistentes.",
  openGraph: {
    title: "Estetia Design System",
    description:
      "Componentes, padrões e tokens para construir interfaces consistentes no Estetia CRM",
    type: "website",
  },
};

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
