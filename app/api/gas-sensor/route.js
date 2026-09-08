import { NextResponse } from 'next/server';

// Variable in-memory (disimpan sementara di RAM Vercel instance)
let latestData = {
  device_id: "WAITING...",
  gas_raw: 0,
  gas_detected: false,
  threshold: 250,
  updated_at: null
};

// Handle POST dari ESP32-C3
export async function POST(request) {
  try {
    const body = await request.json();
    
    latestData = {
      device_id: body.device_id || "ESP32C3_GAS_01",
      gas_raw: body.gas_raw || 0,
      gas_detected: body.gas_raw > 250,
      threshold: body.threshold || 250,
      updated_at: new Date().toLocaleTimeString('id-ID')
    };

    return NextResponse.json({ success: true, data: latestData }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// Handle GET dari Dashboard UI
export async function GET() {
  return NextResponse.json(latestData, { status: 200 });
}