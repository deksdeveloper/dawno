import type { Metadata } from 'next';
import { EditorProvider } from '../context/EditorContext';
import { LanguageProvider } from '../i18n/LanguageContext';

export const metadata: Metadata = {
  title: 'DAWNO',
  description: 'SA-MP PAWN Editor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="./assets/style.css" />
      </head>
      <body>
        <EditorProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </EditorProvider>
      </body>
    </html>
  );
}
