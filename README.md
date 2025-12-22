# 🧾 CV Builder – Step-by-Step Resume Creator

## 📖 Project Overview
**CV Builder** is a web application that allows users to **create, customize, and download their resumes (CVs)** through an intuitive **multi-step form (Stepper Form)**.  
Users can fill out their personal and professional details step by step, preview their CV in real-time, choose between two different templates, and download it as a PDF.

---

## 🚀 Features

### 🧍 1. Stepper Form with Validation
- Multi-step form guiding the user through:
  - Personal Information (name, photo, email, phone, LinkedIn, GitHub, portfolio, etc.)
  - Professional Summary (job title, short bio)
  - Technical and Soft Skills (dynamic fields)
  - Languages (with proficiency levels)
  - Hobbies and Interests
  - Education History (multiple entries)
  - Work Experience (multiple entries)
  - Certifications (multiple entries)
- Built-in validation for required fields (email, phone, URLs, etc.)

---

### 📊 2. Progress Tracking
- Dynamic **progress bar** updates with each completed step.
- User can go forward or backward without losing entered data.

---

### 🧠 3. Dynamic Forms
- Add or remove multiple:
  - Skills  
  - Languages  
  - Education entries  
  - Experiences  
  - Certifications  

No page reload required — everything updates dynamically with JavaScript.

---

### 🧩 4. Customizable CV Templates
- Two professional CV designs available.  
- Real-time **live preview** of the entered data.  
- Users can switch templates anytime before download.

---

### 💾 5. Save and Reuse
- Optional feature to **save CV data** in the browser using `localStorage` for later use or editing.

---

### ✅ 6. Field Validation
- Each field is validated according to its type:
  - Email → valid format check  
  - Phone → numeric and length check  
  - URLs → must start with `https://`  
- Error messages displayed under invalid fields.  
- User cannot proceed to next step until all required fields are valid.

---

### 🧾 7. Export and Print
- Download your CV as a **PDF file** or print it directly.  
- Layout and design are preserved during PDF export.  
- (Bonus) JSON data export option.

---

## 🛠️ Technologies Used
| Technology | Purpose |
|-------------|----------|
| **HTML5** | Structure and form creation |
| **TailwindCSS** | Styling and responsive layout |
| **JavaScript (Vanilla DOM)** | Dynamic form logic, validation, data handling |

---

## 👤 User Stories

| # | As a User... | I want to... | So that... |
|---|---------------|---------------|-------------|
| 1 | Create my CV | Fill a guided step-by-step form | My data is organized clearly |
| 2 | Navigate easily | Move between steps without losing data | I can correct or add info |
| 3 | Add multiple entries | Dynamically add skills, experiences, etc. | My CV reflects all my achievements |
| 4 | Validate my input | Get feedback on invalid fields | I ensure my data is accurate |
| 5 | Track my progress | See how much is completed | I know how many steps remain |
| 6 | Choose a template | Select between two CV designs | I can personalize my resume |
| 7 | Export my CV | Download or print the final CV | I can use it for job applications |

---

## 🧩 Project Structure
📁 cv-builder/
├── 📄 index.html
│
├── ⚙️ script.js
├── 📁 assets/
│ ├── profile-placeholder.png
│ └── icons/
└── README.md

---

## 📅 Timeline

| Day | Task |
|-----|------|
| **Day 1** | Project setup, HTML structure |
| **Day 2** | Step navigation (Next / Previous buttons) |
| **Day 3** | Complete form sections with Tailwind |
| **Day 4** | Dynamic fields (Add / Remove) |
| **Day 5** | Validation for all fields |
| **Day 6** | CV preview and templates |
| **Day 7** | PDF download and print |
| **Day 8** | Code cleanup and presentation |

---

## 🎯 Learning Objectives
- Master DOM manipulation in JavaScript.  
- Learn to handle dynamic form inputs and validation.  
- Understand data persistence using `localStorage`.  
- Create responsive UIs using TailwindCSS.  
- Present a complete, functional project from concept to delivery.

---

## 🧑‍🏫 Assessment Details
- **Duration:** 8 days  
- **Presentation:** 20 minutes  
  - 5 min → Live demo  
  - 15 min → Code explanation  
- **Class Challenge:** 1-hour coding + 15-min QCM

---

## 🏆 Bonus Ideas
- Export all CV data to a JSON file.  
- Add dark/light mode toggle.  
- Add progress saving indicator.  
- Integrate drag-and-drop photo upload.

---

## 👨‍💻 Author
**El habib Ridouane**  
📧 alhabibridouane@gmail.com
🌐 [LinkedIn](https://linkedin.com/in/RED EL) • [GitHub](https://github.com/redel-byte)

---

## 🪪 License
This project is open-source and available under the [Da7med License].
