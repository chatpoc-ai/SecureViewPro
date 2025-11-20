# SecureView Pro 🛡️

A professional-grade security camera application POC (Proof of Concept) designed to demonstrate a high-fidelity mobile experience on the web. This application simulates a full-featured smart home security interface with dual-platform aesthetics (iOS & Android), real-time monitoring features, and AI-powered analysis.

## 📸 App Gallery

| **Dashboard** | **Live Monitoring** | **Smart Playback** |
|:---:|:---:|:---:|
| <img src="https://placehold.co/375x812/111111/3DDC84?text=Dashboard%0AHome+Screen&font=roboto" alt="Dashboard" width="200"/> | <img src="https://placehold.co/375x812/111111/007AFF?text=Live+View%0AAI+Analysis&font=roboto" alt="Live View" width="200"/> | <img src="https://placehold.co/375x812/111111/FFA500?text=History%0ATimeline&font=roboto" alt="Playback" width="200"/> |

| **Events Feed** | **Setup Wizard** | **Settings** |
|:---:|:---:|:---:|
| <img src="https://placehold.co/375x812/111111/FFFFFF?text=Activity+Log%0AAlerts&font=roboto" alt="Events" width="200"/> | <img src="https://placehold.co/375x812/111111/3DDC84?text=Pairing%0AQR+Code&font=roboto" alt="Setup" width="200"/> | <img src="https://placehold.co/375x812/111111/808080?text=Settings%0APlatform+Toggle&font=roboto" alt="Settings" width="200"/> |

## ✨ Key Features

### 📱 Dual-Platform UX Engine
- **Instant OS Switching**: Toggle between **iOS** (Cupertino) and **Android** (Material) design systems instantly in Settings.
- **Native Feel**: Implements platform-specific headers, navigation bars, typography, and micro-interactions.
- **Touch Optimization**: Disabled text selection and callouts to mimic a native app feel.

### 🎥 Live Monitoring Center
- **Real-time Stream Simulation**: High-quality video loop simulating a live feed.
- **Heads-Up Display (HUD)**: Live bitrate monitoring (KB/s), date/time overlays, and connection status.
- **PTZ Controls**: Visual overlay for Pan-Tilt-Zoom camera manipulation.
- **2-Way Audio**: "Hold to Talk" interface with real-time audio visualization effects and ripple animations.
- **Quality Controls**: Toggle between SD and HD stream quality.

### 🧠 AI Smart Vision (Powered by Gemini)
- **Instant Scene Analysis**: Integrated with Google Gemini API to analyze the current video frame.
- **Threat Detection**: Identifies objects, people, and potential security concerns in natural language.
- **Visual Feedback**: Dedicated AI analysis overlay on top of the video feed.

### ⏪ Intelligent Playback & History
- **Timeline Interface**: Drag-able timeline ruler for precise video seeking.
- **Calendar Navigation**: Quick-access date strip to jump between recording days.
- **Event Log**: List of detected events (Motion, Person, Pet, Sound) with thumbnails.
- **Smart Seeking**: Clicking an event automatically aligns the timeline.

### 🔌 Device Pairing Wizard
- **Interactive Setup Flow**: A complete 5-step simulation of adding a new IoT device.
- **WiFi Configuration**: Realistic SSID and Password entry simulation.
- **QR Code Pairing**: Generates a QR code for the camera to scan (simulated workflow).
- **Connection Feedback**: Visual loading states and success confirmation.

## 🛠️ Technical Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google GenAI SDK (@google/genai)

## 🎮 Usage Guide

1. **Switching Platforms**: Go to Settings (Gear icon) -> Platform Style -> Toggle between iOS and Android.
2. **Adding a Device**: Click the "+" icon on the Dashboard to start the QR pairing wizard.
3. **Viewing History**: Inside Live View, click the "History" icon to access the timeline and event logs.
4. **Using AI**: In Live View, tap the "AI Detect" (Lightning bolt) icon to analyze the scene.
