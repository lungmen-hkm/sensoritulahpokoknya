export const metadata = {
  title: 'Gas Monitoring System',
  description: 'ESP32-C3 Real-time Gas Sensor Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}