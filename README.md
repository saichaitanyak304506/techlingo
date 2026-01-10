<<<<<<< HEAD
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
=======
# 🚀 Code Vocabulary Builder (Tech Duolingo)

<p align="center">
  <strong>👥 Team 4</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20RadixUI-blue" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-green" />
  <img src="https://img.shields.io/badge/Language-TypeScript%20%7C%20Python-yellow" />
  <img src="https://img.shields.io/badge/Status-Active-success" />
</p>

<p align="center">
  <b>A Duolingo-inspired platform to master technical vocabulary through interactive learning and gameplay.</b>
</p>

---

## ✨ About the Project

**Code Vocabulary Builder** is a full-stack web application designed for **freshers and early-career developers** to learn, practice, and master commonly used technical terms such as **API**, **JWT**, **Docker**, and more.

The platform blends:

* 📘 Conceptual learning
* 🎮 Interactive guessing games
* 📊 Progress tracking

into one engaging experience inspired by **Duolingo-style learning**.

---

## 🎯 Objectives

* Simplify complex technical terms using real-world explanations
* Reinforce learning through repetition and gameplay
* Provide hands-on exposure to full-stack development concepts
* Encourage peer learning via leaderboards and progress tracking

---

## 🧠 Core Features

### 🧩 Learn Tech Terms

* Clear definitions
* Code snippets
* Real-world usage examples
* Categorized by **difficulty** and **domain**

### 🎮 Guess the Term Game

* Multiple-choice questions
* Questions generated dynamically
* XP-based scoring system
* Accuracy-based bonus XP

### 📈 Progress Tracking

* XP & streak tracking
* Term mastery detection
* Accuracy rate calculation
* Global leaderboard

---

## 🛠️ Tech Stack

### 🌐 Frontend

* ⚛️ **React (Vite + TypeScript)**
* 🎨 **Radix UI + shadcn/ui**
* 💨 **Tailwind CSS**
* 🔁 **TanStack React Query**
* 🧭 **React Router DOM**
* 📝 **React Hook Form + Zod**

### ⚙️ Backend

* 🚀 **FastAPI**
* 🔐 **JWT Authentication (OAuth2)**
* 🗄️ **SQLAlchemy ORM**
* 🧪 **OpenAPI / Swagger Docs**

### 🧠 Database

* SQLite (default)
* PostgreSQL (production-ready)

---

## 🏗️ System Architecture

```text
Frontend (React + Radix UI)
        │
        │ REST API (Axios)
        ▼
Backend (FastAPI)
        │
        │ SQLAlchemy ORM
        ▼
     Database
```

---

## 🔐 Authentication Flow

* User registers or logs in
* Backend generates a JWT token
* Token is used to access protected APIs
* User progress and scores are stored securely

---

## 🔌 API Overview

### 🔑 Auth

* `POST /auth/register` – Register a new user
* `POST /auth/login` – Login & receive token
* `GET /auth/me` – Get current user

### 📚 Terms

* `GET /terms` – Fetch technical terms

### 🎮 Game

* `POST /game/start` – Start game session
* `GET /game/{id}/question` – Get a question
* `POST /game/{id}/answer` – Submit answer
* `POST /game/{id}/end` – End game

### 📊 Progress

* `GET /progress` – User stats
* `GET /progress/leaderboard` – Global leaderboard

---

## 🚀 Getting Started

### 🔧 Backend Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

📍 Backend URL: `http://localhost:8000`
📘 Swagger Docs: `http://localhost:8000/docs`

---

### 🎨 Frontend Setup

```bash
npm install
npm run dev
```

📍 Frontend URL: `http://localhost:8080`

---

## 🧪 Testing & Demo

* API testing via Swagger UI
* End-to-end gameplay testing via UI
* Demo includes:

  * User authentication
  * Playing the guessing game
  * Viewing progress & leaderboard

---

## 📸 Screenshots & Recording

📌 Screenshots and screen recordings showcasing:

* UI flow
* Gameplay
* API responses

(Attached separately as per submission guidelines)

---

## 🏆 Expected Outcome

* A complete full-stack learning platform
* Improved understanding of tech vocabulary
* Real-world exposure to modern web development

---

## 🔮 Future Enhancements

* Daily challenges & reminders
* Adaptive difficulty
* Admin dashboard for term management
* Multiplayer/team mode
* Progressive Web App (PWA)

---

## 🤝 Team Collaboration

### 🚀 Code Vocabulary Builder – **Team 4**

This project was developed by **Team 4**, focusing on **simple collaboration and peer learning**. The team worked together to build a useful full-stack application that helps colleagues learn technical vocabulary while strengthening full-stack skills.

---

## 📌 Submission Details

* **Submission Platform:** Trumio Portal
* **Includes:** Source code, API samples, instructions, screenshots
* **Demo:** Monday Scrum

---

<p align="center">
  <b>✨ Learn. Play. Master Tech Vocabulary ✨</b>
</p>
>>>>>>> a0f65485e1a62083082a6cb31828e0273de495d1
