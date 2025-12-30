# FractionX 💎

**Democratizing High-Value Asset Investment via Fractionalization.**

> **HackXios 2025 Submission** | **Track:** Best Innovation

![FractionX Banner](https://via.placeholder.com/1200x400?text=FractionX+Banner)

## 🚀 Overview
**FractionX** is a revolutionary platform that breaks down the barriers to wealth creation. We allow everyday users to invest in high-value assets—like luxury cars, commercial real estate, and fine art—by purchasing fractionalized tokens for as little as **₹500**.

Our goal is to make the "elite" asset class accessible to students and first-time investors through a seamless, secure, and transparent web interface.

## 🌟 Key Features

* **🛒 Fractional Marketplace:** Browse and invest in real-world assets like a *Ferrari SF90* or *Cyber City Real Estate* with real-time valuation updates.
* **🪙 Asset Tokenization:** Users can tokenize their own high-value assets, instantly creating a digital liquid market for them.
* **📊 Dynamic Dashboard:** Tracks portfolio growth, net worth, and profit margins with interactive charts (powered by Chart.js).
* **⚡ Hybrid Data Sync:** A fault-tolerant architecture that merges local storage with live backend streams, ensuring the app works even during server cold starts or network drops.
* **🔒 Secure Auth & Wallet:** Full user authentication with a persistent virtual wallet system for managing deposits and investments.

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud NoSQL) |
| **Deployment** | Render (Backend) |
| **Tools** | Git, VS Code, Local Storage API |

## 📸 Screenshots

| **Marketplace** | **Dashboard** |
| :---: | :---: |
| ![Marketplace](https://via.placeholder.com/400x200?text=Marketplace+View) | ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard+View) |

| **Tokenize Asset** | **Mobile Responsive** |
| :---: | :---: |
| ![Tokenize](https://via.placeholder.com/400x200?text=Tokenization+Form) | ![Mobile](https://via.placeholder.com/400x200?text=Mobile+View) |

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/Himanshu-dtech/FractionX-HackXios.git](https://github.com/Himanshu-dtech/FractionX-HackXios.git)
cd FractionX-HackXios

🧠 Challenges & Solutions
Deployment Pathing: Faced "Module Not Found" errors on Render due to nested folder structures. Solution: Configured the root directory and start commands explicitly to point to Backend/server.js.

Data Latency: The free-tier backend sleeps after inactivity. Solution: Implemented a "Hybrid Sync" system that loads cached Local Storage data first, ensuring instant UI load times while the backend wakes up.

👥 Team
Himanshu - Full Stack Developer

Built with ❤️ for HackXios 2025
