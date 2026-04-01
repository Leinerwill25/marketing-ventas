import './globals.css';

export const metadata = {
  title: 'ASHIRA Sales Intelligence',
  description: 'Playbook de ventas + IA para ASHIRA — la plataforma de gestión médica venezolana',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="noise">
        {children}
      </body>
    </html>
  );
}
