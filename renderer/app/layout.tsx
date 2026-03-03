import type { Metadata } from 'next';
import { EditorProvider } from '../context/EditorContext';
import { LanguageProvider } from '../i18n/LanguageContext';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'DAWNO',
  description: 'SA-MP PAWN Editor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/style.css" />
        {/*
          Suppress Monaco's internal CancellationToken rejections BEFORE Next.js
          dev tools can intercept them. Must run as an inline script (parsed before
          any JS modules) using capture phase + stopImmediatePropagation so our
          handler wins over Next.js's onUnhandledRejection listener.
        */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            window.addEventListener('unhandledrejection', function(e) {
              var r = e.reason;
              if (!r) return;
              if (r instanceof Error && (r.name === 'Canceled' || r.message === 'Canceled')) {
                e.preventDefault(); e.stopImmediatePropagation(); return;
              }
              if (typeof r === 'object' && !(r instanceof Error) && !r.stack) {
                e.preventDefault(); e.stopImmediatePropagation();
              }
            }, true);
          })();
        ` }} />
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
