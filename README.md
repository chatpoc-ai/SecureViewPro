# SecureView Pro 🛡️

A professional-grade security camera application POC (Proof of Concept) designed to demonstrate a high-fidelity mobile experience on the web. This application simulates a full-featured smart home security interface with dual-platform aesthetics (iOS & Android), real-time monitoring features, and AI-powered analysis.

## ✨ Key Features

### 📱 Dual-Platform UX Engine
- **Instant OS Switching**: Toggle between **iOS** (Cupertino) and **Android** (Material) design systems instantly in Settings.
- **Native Feel**: Implements platform-specific headers, navigation bars, typography, and micro-interactions.
- **Touch Optimization**: Disabled text selection and callouts to mimic a native app feel.

### 🎥 Live Monitoring Center
- **Real-time Stream Simulation**: High-quality video loop simulating a live feed.
- **Interactive Tools**: Snapshot capture with flash effect, manual recording with timer, and emergency siren alarm activation.
- **Digital Zoom**: Smooth 4-step digital zoom (up to 4x) with visual scaling.
- **Camera Settings Overlay**: Instant access to hardware controls like Night Vision, WDR (Wide Dynamic Range), and Status LEDs via a modal sheet.
- **Heads-Up Display (HUD)**: Live bitrate monitoring (KB/s), date/time overlays, and connection status.
- **2-Way Audio**: "Hold to Talk" interface with real-time audio visualization effects and ripple animations.

### 🔔 Event Activity Hub
- **Centralized Feed**: Dedicated tab for all security events (Motion, Person, Sound, Pet).
- **Smart Filtering**: Filter events by category to quickly find specific incidents.
- **Visual Logs**: Rich event cards with thumbnails, timestamps, and device attribution.
- **One-Tap Replay**: Jump directly from an event log to the specific timestamp in playback history.

### 🧠 AI Smart Vision (Powered by Gemini)
- **Instant Scene Analysis**: Integrated with Google Gemini API to analyze the current video frame.
- **Threat Detection**: Identifies objects, people, and potential security concerns in natural language.
- **Visual Feedback**: Dedicated AI analysis overlay on top of the video feed.

### ⏪ Intelligent Playback & History
- **Timeline Interface**: Drag-able timeline ruler for precise video seeking.
- **Calendar Navigation**: Quick-access date strip to jump between recording days.
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
3. **Live Controls**: In Live View, try the "Snap" button for a screenshot, "Record" to capture a clip, or "Alarm" to trigger the siren demo. Use the Zoom button on the video feed to magnify details.
4. **Camera Settings**: Tap the Gear icon in Live View to toggle Night Vision or Status Lights.
5. **Viewing History**: Click the "Events" tab in the bottom bar to see a filtered list of activities, or access the full timeline via the "History" button in Live View.
6. **Using AI**: In Live View, tap the "AI Detect" (Lightning bolt) icon to analyze the scene.