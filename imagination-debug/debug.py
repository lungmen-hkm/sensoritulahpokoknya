import time
import random
import threading
import requests

NUM_DEVICES = int(input("Masukkan Jumlah Node : "))
URL = "https://example.com/api/gas-sensor"

def simulate_device(device_num):
    device_id = f"DEBUG_{device_num:02d}"

    while True:
        # Generate nilai analog acak
        is_leak = random.random() < 0.15 # 15% peluang kebocoran
        gas_raw = random.randint(300, 700) if is_leak else random.randint(30, 150)

        payload = {
            "device_id": device_id,
            "gas_raw": gas_raw,
            "threshold": 250
        }

        try:
            res = requests.post(URL, json=payload, timeout=5)
            status = "DANGER ⚠️" if gas_raw > 250 else "OK ✅"
            print(f"[{device_id}] POST {gas_raw:>3} -> {status} (HTTP {res.status_code})")
        except Exception as e:
            print(f"[{device_id}] Error: {e}")

        # Delay acak tiap node antara 2 - 4 detik
        time.sleep(0)

print(f"=== SIMULATING {NUM_DEVICES} DYNAMIC NODES ===")
print(f"Target: {URL}\n")

# Jalankan tiap node di thread terpisah
for i in range(1, NUM_DEVICES + 1):
    t = threading.Thread(target=simulate_device, args=(i,), daemon=True)
    t.start()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nSimulasi dihentikan.")