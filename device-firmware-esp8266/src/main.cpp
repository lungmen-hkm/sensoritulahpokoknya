#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include "credential.h"

// --- Konfigurasi Wi-Fi ---
const char* ssid = MySSID;
const char* pswd = MyPSWD;

// --- Endpoint Domain ---
const char* url = MyURL;
const char* id  = "ESP8266-NodeMCU-V3";

// --- Pin Assignment NodeMCU V3 ---
#define mq2 A0
#define buzzer D1
#define led D2

// --- Threshold ---
const int batas = 250;

// --- Timers (Non-Blocking) ---
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 100; // Kirim HTTP tiap 3 detik

unsigned long lastBlinkTime = 0;
const unsigned long BLINK_INTERVAL = 500; // LED kedip tiap 500ms pas bahaya
bool ledState = LOW;

void kirimdata(int gas) {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  WiFiClientSecure client;
  client.setInsecure(); // Bypass SSL Cert verification

  HTTPClient http;
  if (http.begin(client, url)) {
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["device_id"]    = id;
    doc["gas_raw"]      = gas;
    doc["gas_detected"] = (gas > batas);

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpCode = http.POST(jsonPayload);

    if (httpCode > 0) {
      Serial.printf("[HTTP] %d\n", httpCode);
    } else {
      Serial.printf("[HTTP] %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("[HTTP] Unable to connect to server endpoint");
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(mq2, INPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(led, OUTPUT);

  // Pastikan output mati di awal
  digitalWrite(buzzer, LOW);
  digitalWrite(led, LOW);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pswd);

  Serial.print("Connecting to WiFi");
  int timeout = 0;
  while (WiFi.status() != WL_CONNECTED && timeout < 20) {
    delay(500);
    Serial.print(".");
    timeout++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[Wi-Fi] w IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n[Wi-Fi] Connection Timeout. Will retry in loop.");
  }
}

void loop() {
  unsigned long currentMillis = millis();

  // --- 1. Baca Sensor Instan ---
  int gas = analogRead(mq2);

  // --- 2. Logika Alarm Non-Blocking ---
  if (gas > batas) {
    digitalWrite(buzzer, HIGH);

    // Kedipkan LED tiap 100ms tanpa delay()
    if (currentMillis - lastBlinkTime >= BLINK_INTERVAL) {
      lastBlinkTime = currentMillis;
      ledState = !ledState;
      digitalWrite(led, ledState);
    }
    
  } else {
    digitalWrite(buzzer, LOW);
    digitalWrite(led, LOW);
    ledState = LOW;
  }

  // --- 3. Auto Reconnect Wi-Fi (Jika Putus) ---
  if (WiFi.status() != WL_CONNECTED && (currentMillis % 10000 == 0)) {
    WiFi.reconnect();
  }

  // --- 4. Trigger HTTP POST Tiap 3 Detik ---
  if (currentMillis - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentMillis;
    kirimdata(gas);
  }
}