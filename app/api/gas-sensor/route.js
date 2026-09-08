import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Storage dinamis in-memory (Key: device_id)
const devicesMap = new Map();

// Filter & hapus device pasif / offline timeout (10 detik)
const OFFLINE_TIMEOUT_MS = 10000;

export async function POST(request) {
  try {
    const body = await request.json();
    const deviceId = body.device_id || `ESP32C3_UNKNOWN_${Math.floor(Math.random() * 1000)}`;

    const now = Date.now();
    const gasRaw = Number(body.gas_raw) || 0;
    const threshold = Number(body.threshold) || 250;

    devicesMap.set(deviceId, {
      device_id: deviceId,
      gas_raw: gasRaw,
      gas_detected: gasRaw > threshold,
      threshold: threshold,
      last_seen: now,
      updated_at: new Date(now).toLocaleTimeString('id-ID')
    });

    return NextResponse.json({ 
      success: true, 
      total_active_nodes: devicesMap.size,
      updated_device: deviceId 
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function GET() {
  const now = Date.now();
  const devicesList = [];

  // Loop semua device yang pernah terdaftar
  devicesMap.forEach((data, id) => {
    const isOnline = (now - data.last_seen) < OFFLINE_TIMEOUT_MS;
    devicesList.push({
      ...data,
      is_online: isOnline
    });
  });

  // Urutkan berdasarkan nama device
  devicesList.sort((a, b) => a.device_id.localeCompare(b.device_id));

  return NextResponse.json({
    total_nodes: devicesList.length,
    devices: devicesList
  }, { status: 200 });
}