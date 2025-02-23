# 🚗 AI-Driven Self-Driving Car Simulation

## 📌 Overview
This project simulates an AI-controlled self-driving car using **JavaScript (TypeScript), Canvas API, and Web Workers**. The simulation includes **real-time sensors, AI decision-making, obstacle detection, and collision handling**.

## 🎯 Features
- **🚦 AI-controlled car** that navigates the road using sensor data.
- **📡 Sensor-based collision detection** for dynamic and static objects.
- **🛑 Intelligent evasive maneuvers** to avoid obstacles.
- **⚠️ Visualized collisions** with flashing effects and markers.
- **🔍 Debug panel** for real-time status monitoring.
- **🌍 Infinite road scrolling** for continuous simulation.
- **🎮 Manual mode** to control the car using keyboard inputs.
- **⚡ Optimized performance** using spatial partitioning and Web Workers.

---

## 🏗️ Installation & Setup

### 📥 Clone the Repository
```bash
git clone https://github.com/thapelomagqazana/self-driving-car-simulation.git
cd self-driving-car-simulation
```

### 📦 Install Dependencies
```bash
npm install
```

### ▶️ Run the Simulation
```bash
npm start
```

- The simulation runs in your browser at `http://localhost:3000`.
- Use **Arrow Keys (⬆️⬇️⬅️➡️) or W/A/S/D** for manual control.
- Click **"Switch to AI Mode"** to activate AI navigation.

---

## 🎮 How It Works

### 1️⃣ **AI Decision Making**
- The car uses **7-ray sensors** to detect nearby objects.
- AI applies **steering logic** to avoid obstacles.
- AI adjusts **speed dynamically** based on sensor input.

### 2️⃣ **Collision Detection System**
- The car detects **road boundaries, static obstacles, and traffic cars**.
- Uses **bounding box calculations** for optimized performance.
- Collision **stops the car** and **logs data** for debugging.

### 3️⃣ **Visualizing Collisions**
- Highlights **collision points** on the canvas.
- Flashes **red outline** on impact.
- Displays **collision warnings** in the UI.

### 4️⃣ **Performance Optimization**
- Uses **Web Workers** to handle collision checks asynchronously.
- Implements **spatial partitioning** to reduce redundant calculations.
- Efficient **road segment recycling** for infinite scrolling.

---

## 🚀 Project Structure
```
self-driving-car-simulation/
│── src/
│   ├── models/
│   │   ├── Car.ts          # Car class with AI logic
│   │   ├── Road.ts         # Road & lane structure
│   │   ├── Sensor.ts       # Sensor logic for detecting objects
│   ├── workers/
│   │   ├── collisionWorker.ts  # Web Worker for collision detection
│   ├── components/
│   │   ├── DebugInfo.tsx   # UI for real-time debugging
│   │   ├── SimulationCanvas.tsx  # Main canvas for rendering
│   ├── App.tsx            # Root component
│── public/
│── package.json
│── tsconfig.json
│── README.md
```

---

## 🛠️ Technologies Used
- **🖥️ Frontend:** React (TypeScript)
- **🖌️ Rendering:** Canvas API
- **🧠 AI Logic:** Custom Neural Decision System
- **🕵️‍♂️ Collision Handling:** Web Workers & Bounding Box Detection
- **⚡ Performance Optimization:** Spatial Partitioning & Event Throttling

---

## 🐛 Debugging & Testing
### ✅ Real-time Debugging
- Debug panel displays **car position, speed, angle, and sensor values**.
- Logs collision data for AI model training.

### ✅ Collision Accuracy Tests
- Ensures **road boundaries prevent out-of-bounds movement**.
- Validates **collision consistency with static and moving objects**.

### ✅ Performance Testing
- Ensures **smooth simulation without lag**.
- Optimizes **collision checks using Web Workers**.

---

## 🤝 Contributing
1. **Fork** the repository.
2. **Create** a new branch: `git checkout -b feature-name`
3. **Commit** your changes: `git commit -m 'Add new feature'`
4. **Push** the branch: `git push origin feature-name`
5. **Open a Pull Request** 🚀

---

## 📜 License
This project is **open-source** and available under the **MIT License**.

---

## 📬 Contact
For questions, suggestions, or issues, reach out via **GitHub Issues** or **email@example.com**.

Happy Coding! 🚀

