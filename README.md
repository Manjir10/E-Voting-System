# 🗳️ E-Voting System

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Tech](https://img.shields.io/badge/built%20with-React%20%7C%20Spring%20Boot%20%7C%20Flask-blue)

An advanced and secure digital voting system built using **React.js**, **Spring Boot**, and **MySQL** with **Face Recognition & OCR verification**.

---

## 📸 Features

- ✅ Voter registration with face match and OCR-based Voter ID verification
- 🔐 Admin dashboard to manage voters, candidates, and elections
- 🗳️ Secure vote casting (one person, one vote)
- 🕒 Time-based election control (start/end)
- 👨‍💻 Real-time result updates
- 📷 Live camera preview and upload support
- 🧠 Flask microservice with DeepFace + EasyOCR

---

## 🧰 Tech Stack

| Frontend | Backend | Database | AI Service | Face/OCR |
|----------|---------|----------|------------|----------|
| React.js | Spring Boot | MySQL | Flask (Python) | DeepFace, EasyOCR |

---

## ⚠️ Important Note

🔁 **Only the `e-voting-frontend` files were uploaded individually** after file recovery.  
Other directories (like `evoting-backend` and `evoting-face-auth`) were retained as-is.

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v18+)
- Java 17+
- MySQL Server
- Python 3.9+
- Flask + dependencies

Install Python packages:

```bash
pip install flask deepface easyocr pillow
📂 Project Structure
perl
Copy
Edit
evoting-system/
├── evoting-backend/           # Java Spring Boot backend
├── e-voting-frontend/         # React frontend UI (uploaded individually)
├── evoting-face-auth/         # Flask face authentication + OCR service
🧪 Admin Login (Sample)
Username	Password
admin	admin123

(Replace in production)

⚠️ License / Usage
This project is not currently licensed for open-source distribution. All code is written for educational and demonstration purposes only.

If you want to use or distribute this project, please contact the author.

🙋‍♂️ Developer
Manjir Dasgupta
📧 manjirdasgupta@gmail.com
💻 LinkedIn: www.linkedin.com/in/manjir-dasgupta-019879175

This system is a proof-of-concept for secure online voting with facial verification. Not intended for use in official elections.
