
# FractionX 💎  
### Democratizing High-Value Asset Investment via Fractionalization

🔗 **Live Website:** https://fractionx-hackxios.onrender.com  
🏆 **HackXios 2025 Submission**  
🎯 **Track:** Best Innovation  

---

## 🚀 Overview

**FractionX** is a next-generation fintech platform that democratizes access to high-value assets such as **luxury cars, commercial real estate, and fine art**.

Traditionally, these asset classes are limited to investors with ₹50,00,000+ capital. FractionX disrupts this model by **fractionalizing illiquid assets into micro-ownership units**, enabling investments starting from just **₹500**.

Our mission is to empower **students and first-time investors** with access to wealth creation opportunities previously reserved for the elite.

---

## 🌟 Key Features

- **🛒 Fractional Marketplace**  
  Invest in premium assets (e.g., Ferrari, commercial real estate) with transparent pricing and ownership breakdown.

- **🪙 Asset Tokenization**  
  Users can tokenize their own high-value assets and instantly create a liquid digital market.

- **📊 Smart Dashboard**  
  Track portfolio value, profits, net worth, and investment history using interactive charts.

- **📈 Market Analytics**  
  Real-time insights into market trends, asset categories, and total market capitalization.

- **⚡ Hybrid Data Sync (Offline-First)**  
  A fault-tolerant architecture combining **Local Storage + Live Backend APIs** to:
  - Handle server cold starts
  - Avoid infinite loading screens
  - Deliver a perceived zero-latency UI

- **🔒 Secure Authentication & Wallet**  
  Persistent user accounts with a virtual wallet for managing deposits and investments.

---

## 📸 Screenshots

> ⚠️ Images use **GitHub RAW URLs** to avoid broken previews.

### 🏠 Landing Page
<img src="https://raw.githubusercontent.com/Himanshu-dtech/FractionX-HackXios/main/assets/screenshots/landing.png" width="800"/>

---

### 🛒 Marketplace
<img src="https://raw.githubusercontent.com/Himanshu-dtech/FractionX-HackXios/main/assets/screenshots/marketplace.png" width="800"/>

---

### 📊 User Dashboard
<img src="https://raw.githubusercontent.com/Himanshu-dtech/FractionX-HackXios/main/assets/screenshots/dashboard.png" width="800"/>


---




## 🛠️ Technology Stack

| Layer | Technology |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript (ES6+), Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Deployment | Render (Backend), GitHub Pages / Vercel (Frontend) |
| Tools | Git, VS Code, Local Storage API |

---

## 🧠 Challenges & Learnings

### 🚧 Challenges We Faced
* **Deployment "Path Hell":** Our biggest hurdle was moving from Localhost to Production. Render kept crashing with `Cannot find module server.js` because of our nested folder structure (`Backend/Backend/...`).
    * **Fix:** We learned to configure the **Root Directory** and **Start Command** explicitly in the cloud dashboard, decoupling the build process from the folder structure.

* **The "Cold Start" Latency:** Since we are using free-tier hosting, the backend "sleeps" after inactivity. This caused the Frontend to hang on "Loading..." indefinitely for new users.
    * **Fix:** We implemented a **Hybrid Data Strategy**. We now fetch data from `localStorage` first (for instant rendering) and sync with the Backend in the background.

* **CORS & Security Policies:** Connecting a standalone Frontend to a separate Backend server triggered multiple CORS (Cross-Origin Resource Sharing) errors.
    * **Fix:** We configured the Express middleware to whitelist specific origins, ensuring secure but functional communication between client and server.

### 💡 Key Learnings
1.  **Production vs. Development:** "It works on my machine" is not enough. We learned how to debug remote server logs and handle environment variables securely.
2.  **Fail-Safe UI Design:** Always assume the API might fail. We built robust error handling and "Mock Data" fallbacks so the user never sees a broken screen.
3.  **State Management:** We learned the importance of a "Single Source of Truth" for global variables (like API URLs) to prevent script conflicts across different HTML pages.

⚙️ Installation & Setup
1️⃣ Clone the Repository

git clone https://github.com/Himanshu-dtech/FractionX-HackXios.git
cd FractionX-HackXios

2️⃣ Frontend Setup

Open index.html or login.html
Recommended: Live Server extension in VS Code

3️⃣ Backend Setup (Optional for Local Development)
cd Backend
npm install
# create a .env file and add MONGO_URI
npm start
Backend runs at:
http://localhost:10000
💡 Key Takeaway

FractionX proves that:
1.Wealth creation can be inclusive
2.Illiquid assets can be made liquid
3.Great UX requires resilient architecture, not just good UI

❤️ Built With Passion

Built with ❤️ for HackXios 2025



