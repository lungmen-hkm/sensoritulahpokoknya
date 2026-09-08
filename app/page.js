'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState({
    device_id: 'LOADING...',
    gas_raw: 0,
    gas_detected: false,
    threshold: 250,
    updated_at: '-'
  });

  // Fetch data dari API tiap 1 detik
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/gas-sensor');
        const json = await res.json();
        if (json.gas_raw !== undefined) setData(json);
      } catch (err) {
        console.error("Failed to fetch:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isDanger = data.gas_raw > data.threshold;

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: isDanger ? '#7f1d1d' : '#0f172a',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        padding: '30px',
        borderRadius: '16px',
        border: `2px solid ${isDanger ? '#ef4444' : '#334155'}`,
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        boxShadow: isDanger ? '0 0 30px rgba(239, 68, 68, 0.5)' : 'none'
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '14px', letterSpacing: '1px' }}>
          NODE ID: {data.device_id}
        </h2>
        
        <h1 style={{ fontSize: '72px', margin: '20px 0', color: isDanger ? '#fca5a5' : '#38bdf8' }}>
          {data.gas_raw}
        </h1>

        <div style={{
          display: 'inline-block',
          padding: '8px 16px',
          borderRadius: '20px',
          fontWeight: 'bold',
          backgroundColor: isDanger ? '#ef4444' : '#22c55e',
          color: '#fff',
          marginBottom: '20px'
        }}>
          {isDanger ? 'Diatas Batas Aman' : 'Dibawah Batas Aman'}
        </div>

        <hr style={{ borderColor: '#334155', margin: '15px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px' }}>
          <span>Threshold: {data.threshold}</span>
          <span>Last Update: {data.updated_at}</span>
        </div>
      </div>
    </main>
  );
}