import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['pt-BR'],
  defaultLocale: 'pt-BR',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export type Routing = typeof routing;

import { createNavigation } from 'next-intl/navigation';
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
