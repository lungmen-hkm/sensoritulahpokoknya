'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [nodes, setNodes] = useState([]);
  const [totalNodes, setTotalNodes] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/gas-sensor');
        const json = await res.json();
        if (json.devices) {
          setNodes(json.devices);
          setTotalNodes(json.total_nodes);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#fff',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header Info */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', letterSpacing: '1px' }}>
          🌐 DYNAMIC MULTI-NODE GAS MONITORING
        </h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>
          Active Registered Nodes: <strong style={{ color: '#38bdf8' }}>{totalNodes}</strong>
        </p>
      </header>

      {/* Empty State */}
      {nodes.length === 0 && (
        <div style={{ textAlign: 'center', color: '#64748b', marginTop: '60px' }}>
          <p>Belum ada data masuk dari ESP32-C3...</p>
        </div>
      )}

      {/* Dynamic Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {nodes.map((node) => {
          const isDanger = node.is_online && (node.gas_raw > node.threshold);

          return (
            <div key={node.device_id} style={{
              backgroundColor: '#1e293b',
              borderRadius: '16px',
              padding: '24px',
              border: `2px solid ${isDanger ? '#ef4444' : node.is_online ? '#334155' : '#1e293b'}`,
              opacity: node.is_online ? 1 : 0.4,
              boxShadow: isDanger ? '0 0 25px rgba(239, 68, 68, 0.4)' : 'none',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Online / Offline Status Badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>
                  {node.device_id}
                </span>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: node.is_online ? '#065f46' : '#334155',
                  color: node.is_online ? '#34d399' : '#94a3b8'
                }}>
                  {node.is_online ? '● ONLINE' : '○ OFFLINE'}
                </span>
              </div>

              {/* Sensor Raw Value */}
              <div style={{ textAlign: 'center', margin: '15px 0' }}>
                <h2 style={{
                  fontSize: '56px',
                  margin: 0,
                  color: !node.is_online ? '#64748b' : isDanger ? '#fca5a5' : '#38bdf8'
                }}>
                  {node.gas_raw}
                </h2>
                <span style={{ fontSize: '11px', color: '#64748b' }}>ANALOG VALUE</span>
              </div>

              {/* Status Indicator */}
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '100%',
                  padding: '8px 0',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: !node.is_online ? '#334155' : isDanger ? '#ef4444' : '#22c55e',
                  color: '#fff'
                }}>
                  {!node.is_online ? 'NO SIGNAL' : isDanger ? '⚠️ GAS TERDETEKSI' : '✅ AMAN'}
                </span>
              </div>

              {/* Footer Metadata */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: '#64748b',
                marginTop: '20px',
                borderTop: '1px solid #334155',
                paddingTop: '10px'
              }}>
                <span>Limit: {node.threshold}</span>
                <span>Last Seen: {node.updated_at}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}