import type { ReactNode } from 'react';

/**
 * Layout racine "minimal".
 * Les balises <html> et <body> sont définies dans [locale]/layout.tsx
 * pour pouvoir y mettre le bon attribut "lang".
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
