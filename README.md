# ESP32 Portable Gas Monitoring System

A real-time, high-visibility IoT gas detection ecosystem built with ESP32-C3 nodes and a Next.js web dashboard hosted on Vercel. Features dynamic multi-node tracking, automatic offline node detection, and active alarm triggers.

---

## System Architecture


```

```
                              +-------------------+
                              |   Web Dashboard   |
                              | (Next.js / Vercel) |
                              +---------+---------+
                                        ^
                                        |  HTTP GET (1s Polling)
                                        v

```

+-------------------+             +-------------------+             +--------------------+
|   ESP32-C3 Node   |  HTTP POST  |  API Endpoint     |  HTTP POST  |  Mock Simulator    |
|   (MQ-2 Sensor)   +------------>+  (/api/gas-sensor) +<------------+  (Python Script)   |
+-------------------+             +-------------------+             +--------------------+

```

- **Firmware Level:** Non-blocking analog reading using `millis()` with local actuator triggers (Buzzer & LED).
- **Backend API:** Dynamic Node Map handling multi-device telemetry with auto-timeout (10s threshold for offline state).
- **Frontend UI:** Auto-responsive CSS Grid displaying raw analog telemetry, live state indicators, and alert statuses.

---

## Hardware Requirements

| Component | Pin / Specification | Description |
| :--- | :--- | :--- |
| **Microcontroller** | ESP32-C3 | Core processing & Wi-Fi bridge |
| **Gas Sensor** | MQ-2 (Analog `A0` -> GPIO 0) | Detects LPG, Smoke, CO |
| **Buzzer** | GPIO 3 | Local Audio Alarm |
| **LED** | GPIO 4 | Visual Alarm Indicator |

---

## License

Distributed under the GPL-v3.0 License. Feel free to modify and use for your own projects.