// --- Definisi Template Blynk (Wajib di Paling Atas!) ---
#define BLYNK_TEMPLATE_ID   "TMPLxxxxxx"       // Ganti pake Template ID dari Blynk Console
#define BLYNK_TEMPLATE_NAME "Gas Detection C3" // Ganti pake Template Name
#define BLYNK_AUTH_TOKEN    "YourAuthTokenHere" // Ganti pake Auth Token device kamu

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>

// --- Konfigurasi Wi-Fi ---
const char* ssid = "YourSSID";
const char* pswd = "YourPSWD";

// --- Pin Assignment ESP32-C3 ---
const int mq2    = 0; // Pin Analog A0 (GPIO 0)
const int buzzer = 3; 
const int led    = 4; 

// --- Threshold nilai analog ---
const int batas  = 250;

// Timer Blynk buat gantiin delay()
BlynkTimer timer;

// Function buat ngirim data ke Blynk tiap 1 detik
void sendSensorToBlynk() {
  int gas = analogRead(mq2);

  // Kirim nilai raw analog ke Virtual Pin V0
  Blynk.virtualWrite(V0, gas);

  // Kirim status bahaya/aman ke Virtual Pin V1
  if (gas > batas) {
    Blynk.virtualWrite(V1, "Diatas Batas Aman");
  } else {
    Blynk.virtualWrite(V1, "Dibawah Batas Aman");
  }
}

void setup() {
  Serial.begin(115200);

  // --- Pin Mode ---
  pinMode(mq2, INPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(led, OUTPUT);

  // --- Inisialisasi Koneksi Blynk & Wi-Fi ---
  Serial.println("[Blynk] Connecting...");
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pswd);

  // Set interval pengiriman data ke Blynk cloud (tiap 1000ms / 1 detik)
  timer.setInterval(1000L, sendSensorToBlynk);
}

void loop() {
  // Biarkan Blynk nge-handle koneksi & timer
  Blynk.run();
  timer.run();

  // --- Sensor Read & Logika Lokal ---
  int gas = analogRead(mq2);

  if (gas > batas) {
    digitalWrite(buzzer, HIGH);
    digitalWrite(led, HIGH);
    delay(200);
    digitalWrite(led, LOW);
    delay(200);
  } else {
    digitalWrite(buzzer, LOW);
    digitalWrite(led, LOW);
    delay(1);
  }
}