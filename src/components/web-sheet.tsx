import type { ReactNode } from 'react';

// On iOS and Android the route is presented as a native modal sheet, so this passes the content through.
// The web version (web-sheet.web.tsx) draws the sheet itself.
export function WebSheet({ children }: { title: string; onClose: () => void; children: ReactNode }) {
  return children;
}
