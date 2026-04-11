import './globals.css';

export const metadata = {
  title: 'ASHIRA Sales Intelligence',
  description: 'Playbook de ventas + IA para ASHIRA — la plataforma de gestión médica venezolana',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
