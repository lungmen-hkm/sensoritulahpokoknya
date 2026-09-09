#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

// --- Konfigurasi Wi-Fi ---
const char* ssid = "YourSSID";
const char* pswd = "YourPSWD";

// --- Endpoint Domain ---
const char* url = "https://example.com/api/gas-sensor";
const char* id = "DeviceID";

// --- Pin Assignment ESP32-C3 ---
const int mq2 = 0; 
const int buzzer = 3; 
const int led = 4; 

// --- Threshold nilai analog ---
const int batas = 250;

// --- HTTP POST ---
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 3000; 

void kirimdata(int gas) {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  WiFiClientSecure client;

// --- Bypass SSL Cert verification ---
//  client.setInsecure(); 

  HTTPClient http;
  if (http.begin(client, url)) {
    http.addHeader("Content-Type", "application/json");

    // --- JSON Payload ---
    StaticJsonDocument<200> doc;
    doc["device_id"] = id;
    doc["gas_raw"] = gas;
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
  
  // --- Serial Debug Connection ---
  Serial.begin(115200);

  // --- Pin Mode ---
  pinMode(mq2, INPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(led, OUTPUT);

  // --- Wi-Fi ---
  WiFi.begin(ssid, pswd);

  int timeout = 0;
  while (WiFi.status() != WL_CONNECTED && timeout < 20) {
    delay(500);
    Serial.print("\nConnection Timeout. Retrying...");
    timeout++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[Wi-Fi] Connection Timeout.");
  }
}

void loop() {

  // --- Sensor Read ---
  int gas = analogRead(mq2);

  // --- Sensor Logic ---
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

  // --- Trigger ---
  unsigned long currentMillis = millis();
  if (currentMillis - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentMillis;
    kirimdata(gas);
  }
}