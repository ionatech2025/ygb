README.md
Markdown
# 🍊 Network for Active Citizens (NAC) — YGB Survey Tool

> **Phase 1 MVP Platform**  
> A clean, local-first field-survey collection system designed to empower regional coordinators and field collectors to securely capture community insights even when completely offline.

---

## 📋 Overview

The **YGB Survey Tool** is custom-built for the **Network for Active Citizens (NAC)** to streamline data collection at the grassroots level. By dividing the workspace into an intuitive desktop **Admin Panel** and a mobile-first **Data Collector Portal**, the platform ensures clean data management while making field data entry as simple as possible for novice collectors.

### Key Benefits:
* **Novice-Friendly:** Styled and worded in plain language so that community members with basic smartphone skills can navigate it seamlessly.
* **Offline-Resilient:** Caches collected surveys locally on the device to prevent data loss in areas with poor internet connectivity.
* **Role-Isolated Views:** Automatically routes users to their specific workspace (Admin dashboard vs. Mobile survey) immediately upon logging in.

---

## 🎨 Brand Colors & Styling

This system is built using the official NAC visual identity:
* **NAC Orange (`#FF7300`):** Action, energy, and grassroots drive.
* **NAC Blue (`#0074D9`):** Trust, clarity, and security.

---

## ✨ Features

### 1. Unified Landing & Portal Gate
* A side-by-side landing page that explains the system's benefits while hosting a secure, high-contrast login form.
* Displays dynamic helper badges to guide reviewers and coordinators.

### 2. Desktop Admin Panel
* **Register Collectors:** Register new field collectors with names, phone numbers, and initial passwords.
* **Active Directory:** View registered team members, their system roles, and creation timestamps in a real-time list.

### 3. Mobile-First Collector Survey (`PDMSurveyView`)
* Designed explicitly for mobile browsers to simulate natural smartphone application usage.
* Streamlined inputs for **Household Reference IDs** (e.g., `HHD-KLA-001`) and PDM (Parish Development Model) indicators.

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 18 + TypeScript (Vite)
* **Styling & Layout:** Tailwind CSS (fully responsive, mobile-first design)
* **State Management:** Zustand (for lightweight, reactive, and type-safe session storage)

---

## 🚀 Getting Started

Follow these steps to set up and run the application locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ionatech2025/ygb.git](https://github.com/ionatech2025/ygb.git)
   cd ygb
2.	Install dependency packages:
Bash
npm install
3.	Launch the development server:
Bash
npm run dev
4.	Open your browser and navigate to the local link shown in your terminal (usually http://localhost:5173).
🔑 Testing Credentials
For demonstration and testing purposes, you can log in immediately using the following pre-configured credentials:
Role	Phone Number	Password	Target Dashboard
System Administrator	0000	admin	Desktop Admin Panel
Field Collector (Jane Nakato)	0772123456	(Any password)	Mobile Survey View
Note: Any newly registered collector accounts you create through the Admin Panel can be logged into immediately using the phone number and password you assigned them.
👥 Contributors & Development Team
This system is proudly developed and maintained by iONA Tech:
•	Allan Baliddawa — Director & Co-Founder 
•	Samuel Katongole — Director & Co-Founder
•	Nyombi Elijah — Director & Co-Founder
•	Nakunda Lillian — Software Engineer
•	Mulungi Abigail — Software Engineer
•	Mpairwe Lauben — Software Engineer
Helping citizens take charge of their own development.

---

### What to do next:
1. Create a new file in your project root called `README.md`.
2. Paste the markdown block above into it.
3. Push the changes to your branch using:
   ```bash
   git add README.md
   git commit -m "docs: add comprehensive README with NAC styling, project overview, and testing credentials"
   git push origin feature/epic1-authentication
This gives your colleagues everything they need to run, understand, and test your login system!

