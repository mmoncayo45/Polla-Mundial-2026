import './globals.css'

export const metadata = {
  title: 'Polla Mundial 2026',
  description: 'Pronósticos FIFA World Cup 2026',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
