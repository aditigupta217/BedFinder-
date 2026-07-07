# 🏥 BedFinder India

> **Real-time ICU, general, and emergency bed availability tracker across government hospitals in India.**

BedFinder is a modern, high-performance web application designed to bridge the gap between citizens in critical need and available hospital resources. By providing a clean, accessible interface with multi-lingual support and an AI-powered triage helper, BedFinder simplifies decision-making during medical emergencies.

---

## 🌟 Key Features

### 1. 🔍 Citizen Search & Filtering
* **Live Search:** Look up hospital beds by City or Pincode in real-time.
* **Smart Filtering:** Filter results by All Beds, ICU only, Emergency only, or sort by distance (Nearest First).
* **Sparklines:** Interactive micro-charts showing the ICU bed availability trends over the last 6 hours.
* **Instant Share:** Share hospital availability details, contact numbers, and address formats directly to WhatsApp or clipboard in one click.

### 2. 🚨 Emergency Mode
* **Free Ambulance Hotline:** A prominent, single-tap button to call `108` (National Ambulance Service) immediately.
* **Smart Best Recommendation:** Recommends the single closest hospital with the most ICU beds available instantly.

### 3. 📊 City Health Dashboard
* **Aggregation stats:** Total tracked hospitals, free ICU beds, and free general beds.
* **Interactive Charting:** Recharts-powered visualization of citywide ICU bed occupancy.
* **Availability Heatmap:** A visual grid representation of each hospital’s live status (Available, Limited, Full).

### 4. 🔑 Hospital Staff Portal
* **Secure login:** Hospital admins can sign in via a simple Select-Hospital + PIN code screen.
* **Simple Counter Inventory:** Add or remove available beds (ICU, General, Emergency) dynamically with simple `+` and `-` controls.
* **Auto-Notifications:** Integrated with **EmailJS** to notify users who registered on the waiting list once beds become available in their city.

### 5. 🌐 Multi-language Support
* Fully translated in **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)** to maximize accessibility.

### 6. 🤖 AI Triage Assistant
* Integrated with **Google Gemini 2.5 Flash** to provide conversational guidance.
* Citizens can describe their medical emergency, and the bot will analyze local hospital data to recommend the best fit instantly.

---

## 🛠️ Technology Stack

* **Core:** React 19, TypeScript
* **Routing & Meta-framework:** [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (Server-side rendering, powered by [Nitro](https://nitro.unjs.io/) and Vite)
* **Styling:** Tailwind CSS v4, Lucide React (Icons)
* **UI Components:** Shadcn/UI primitives built on top of Radix UI
* **Charts:** Recharts
* **State Management:** Custom external store (synchronized with React via `useSyncExternalStore` and persisted in `localStorage`)
* **Integrations:**
  * **Google Gemini API** (via AI Triage Assistant)
  * **EmailJS** (for waiting list notification alerts)

---

## 🚀 Getting Started

### 📋 Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* `npm` or `bun` package manager

### 🔧 Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd BedFinder-
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### ⚙️ Environment Configuration
1. Duplicate the template environment file:
   ```bash
   cp .env.example .env
   ```
2. Open the new `.env` file and set your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

### 💻 Running Locally
To launch the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### 🏗️ Building for Production
To compile and optimize the app for production:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🔑 Demo Staff Login PINs

To test the **Hospital Staff Portal** (`/hospital`), use the following demo credentials configured in the seed database:

| Hospital Name | City | Login ID / ID | Demo PIN |
| :--- | :--- | :--- | :--- |
| **Govt. Medical College & Hospital** | Nagpur | `ngp-gmc` | **`1234`** |
| **Indira Gandhi Govt. Hospital** | Nagpur | `ngp-igh` | **`5678`** |
| **Mayo Hospital** | Nagpur | `ngp-mayo` | **`9012`** |
| **Sassoon General Hospital** | Pune | `pn-sassoon` | **`3456`** |
| **Naidu Hospital** | Pune | `pn-naidu` | **`7890`** |
| **KEM Hospital** | Pune | `pn-kem` | **`2345`** |
| **KEM Hospital Mumbai** | Mumbai | `bom-kem` | **`4321`** |
| **Sion Hospital** | Mumbai | `bom-sion` | **`8765`** |
| **Sir J. J. Group of Hospitals** | Mumbai | `bom-jj` | **`2109`** |
| **GMC & Hospital Aurangabad** | Aurangabad | `ixu-gmc` | **`6543`** |
| **District Civil Hospital Aurangabad** | Aurangabad | `ixu-dch` | **`9876`** |
| **AIIMS** | Delhi | `del-aiims` | **`1010`** |
| **Safdarjung Hospital** | Delhi | `del-safd` | **`2020`** |
| **LNJP Hospital** | Delhi | `del-lnjp` | **`3030`** |
| **Victoria Hospital Bangalore** | Bangalore | `blr-vic` | **`4040`** |
| **Bowring and Lady Curzon Hospital** | Bangalore | `blr-bow` | **`5050`** |

---

## 🚀 Recommended Additions (Future Roadmap)

1. **🔌 Real Database Integration:** Migrate the static local storage database to a cloud database (e.g., Supabase or PostgreSQL) for real-time synchronization between separate devices.
2. **🗺️ Interactive Map:** Replace the static Map View toast with an interactive map component using [Leaflet / OpenStreetMap] or [Google Maps API] to show geographic positions and routes to hospitals.
3. **💬 Real-Time WebSockets:** Implement WebSockets (e.g. Socket.io) to push bed count updates to active citizen browsers instantly without refreshing or pulling state again.
4. **📞 OTP Verification:** Add real phone number authentication (via Twilio or Firebase Auth) for hospital staff logins rather than simple static 4-digit PINs.
