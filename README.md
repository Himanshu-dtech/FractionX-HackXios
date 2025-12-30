# FractionX 💎

# LIVE WEBSITE LINK: (https://fractionx-hackxios.onrender.com)

**Democratizing High-Value Asset Investment via Fractionalization.**

> **HackXios 2025 Submission** | **Track:** Best Innovation

![FractionX Banner](https://via.placeholder.com/1200x400?text=FractionX+Banner)
## 🚀 Overview
**FractionX** is a revolutionary platform that breaks down the barriers to wealth creation. We allow everyday users to invest in high-value assets—like luxury cars, commercial real estate, and fine art—by purchasing fractionalized tokens for as little as **₹500**.

Our goal is to make the "elite" asset class accessible to students and first-time investors through a seamless, secure, and transparent web interface.

<p align="center">
  <img src="path/to/your/logo.png" alt="FractionX Logo" width="200">
  </p>


## 🌟 Key Features

* **🛒 Fractional Marketplace:** Browse and invest in real-world assets like a *Ferrari SF90* or *Cyber City Real Estate* with real-time valuation updates.
* **🪙 Asset Tokenization:** Users can tokenize their own high-value assets, instantly creating a digital liquid market for them with a live preview.
* **📊 Dynamic Dashboard:** Tracks portfolio growth, net worth, and profit margins with interactive charts (powered by Chart.js).
* **📈 Market Analytics:** Get real-time insights into market trends, total market cap, and asset category distribution.
* **⚡ Hybrid Data Sync:** A fault-tolerant architecture that merges local storage with live backend streams, ensuring the app works even during server cold starts or network drops.
* **🔒 Secure Auth & Wallet:** Full user authentication with a persistent virtual wallet system for managing deposits and investments.

## 📸 Screenshots

Here's a glimpse of the FractionX platform in action.

### **User Dashboard & Analytics**
Track your net worth, recent activity, and market trends.
https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
| **User Dashboard** | **Market Analytics** |
| :---: | :---: |
| <img src="path/to/image_22.png" alt="Dashboard" width="400"> | <img src="path/to/image_24.png" alt="Analytics" width="400"> |
### **Marketplace & Asset Discovery**
Browse curated high-value assets and view detailed highlights.

| **Marketplace Assets** | **Marketplace Highlights** |
| :---: | :---: |
| <img src="path/to/image_21.png" alt="Marketplace" width="400"> | <img src="path/to/image_23.png" alt="Highlights" width="400"> |

### **Asset Tokenization**
Easily list your own assets for fractional investment with a live preview.

| **Tokenize Asset Form** |
| :---: |
| <img src="path/to/image_14.png" alt="Tokenize Asset" width="600"> |

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud NoSQL) |
| **Deployment** | Render (Backend), GitHub Pages/Vercel (Frontend) |
| **Tools** | Git, VS Code, Local Storage API |

## ⚙️ Installation & Setup

Follow these steps to run the project locally:


## 🧠 Challenges & Solutions
During the hackathon, we encountered several technical hurdles:

Deployment Pathing: * Issue: Faced "Module Not Found" errors on Render due to nested folder structures (Backend/Backend/server.js).

Solution: Configured the root directory to be empty and set start commands explicitly to node Backend/server.js.

Data Latency & Cold Starts: * Issue: The free-tier backend sleeps after inactivity, causing long initial load times.

Solution: Implemented a "Hybrid Sync" system that loads cached Local Storage data first, ensuring instant UI load times while the backend wakes up in the background.

CORS & API Conflicts: * Issue: Encountered CORS issues blocking the frontend and duplicate variable declarations crashing the scripts.

Solution: Configured CORS properly on the backend and established a single source of truth (global.js) for variables like API_URL.

### 1. Clone the Repository
```bash
git clone [https://github.com/Himanshu-dtech/FractionX-HackXios.git](https://github.com/Himanshu-dtech/FractionX-HackXios.git)
cd FractionX-HackXios


2. Frontend Setup
Simply open index.html or login.html in your browser.

Recommended: Use the "Live Server" extension in VS Code for the best experience.

3. Backend Setup (Optional for Local Dev)
If you want to run the server locally instead of using the live Render link:

Bash

cd Backend
npm install
# Create a .env file with your MONGO_URI
npm start
The server will start at http://localhost:10000.




Built with ❤️ for HackXios 2025
