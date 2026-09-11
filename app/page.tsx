"use client";

import { useState, useEffect } from "react";

interface DeviceNode {
  device_id: string;
  is_online: boolean;
  gas_raw: number;
  threshold: number;
  updated_at: string;
}

interface ApiResponse {
  total_nodes: number;
  devices: DeviceNode[];
}

export default function Dashboard() {
  const [nodes, setNodes] = useState<DeviceNode[]>([]);
  const [totalNodes, setTotalNodes] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("https://project.lungmenhkm.xyz/roboci/api/gas-sensor");
        const json: ApiResponse = await res.json();
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-neutral-800 selection:text-neutral-200">
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header Section */}
        <header className="mb-12 border-b border-neutral-800 pb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              ESP32-C3 Real-Time Telemetry
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                Gas Monitoring
              </h1>
              <p className="text-neutral-400 mt-2 text-sm sm:text-base">
                Dashboard pemantauan sensor gas terhubung secara real-time.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-center sm:self-auto bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl text-xs font-mono text-neutral-300">
              <span>Active Nodes:</span>
              <span className="text-emerald-400 font-bold text-sm">
                {totalNodes}
              </span>
            </div>
          </div>
        </header>

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20">
            <p className="text-neutral-500 font-mono text-sm">
              Belum ada data sensor terdeteksi...
            </p>
          </div>
        )}

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {nodes.map((node) => {
            const isDanger =
              node.is_online && node.gas_raw > node.threshold;

            return (
              <div
                key={node.device_id}
                className={`relative flex flex-col justify-between rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 ${
                  !node.is_online
                    ? "border-neutral-800 bg-neutral-900/20 opacity-40"
                    : isDanger
                    ? "border-rose-500/60 bg-rose-950/20 shadow-2xl shadow-rose-500/10"
                    : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                }`}
              >
                <div>
                  {/* Status & ID Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-neutral-300 tracking-wider">
                      {node.device_id}
                    </span>

                    <span
                      className={`text-[10px] font-mono font-medium px-2.5 py-1 rounded-full border ${
                        node.is_online
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-neutral-800 text-neutral-500 border-neutral-700/50"
                      }`}
                    >
                      {node.is_online ? "● ONLINE" : "○ OFFLINE"}
                    </span>
                  </div>

                  {/* Sensor Raw Value */}
                  <div className="text-center my-6">
                    <h2
                      className={`text-5xl font-extrabold tracking-tight font-mono ${
                        !node.is_online
                          ? "text-neutral-600"
                          : isDanger
                          ? "text-rose-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {node.gas_raw}
                    </h2>
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 block mt-2 uppercase">
                      Analog Raw Value
                    </span>
                  </div>

                  {/* Status Indicator Bar */}
                  <div className="mt-4">
                    <div
                      className={`w-full py-2 px-3 rounded-lg text-center text-xs font-semibold transition-colors ${
                        !node.is_online
                          ? "bg-neutral-800 text-neutral-500"
                          : isDanger
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                          : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      }`}
                    >
                      {!node.is_online
                        ? "NO SIGNAL"
                        : isDanger
                        ? "Diatas Batas Aman"
                        : "Dibawah Batas Aman"}
                    </div>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-4 mt-6 border-t border-neutral-800/80">
                  <span>Limit: {node.threshold}</span>
                  <span>{node.updated_at}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}