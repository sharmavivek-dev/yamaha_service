# Yamaha Service Portal — React Website

Full website version of the Yamaha Bike Service Management Android App.
Built with React 18. Dark theme. Exact color palette from the Android app.

---

## Screens Included

| Screen | Description |
|---|---|
| Login | Username: Kashyadeepsinh / Password: 1234 |
| Dashboard | 7 colored module tiles |
| Service Booking | Full form with date, time, service type |
| Service Tracking | Live checklist with progress bar |
| Service History | 1st and 2nd service records |
| Servicing Problems | 3-section complaint form |
| Service Feedback | Form + Gold Points reward popup |
| Account Details | Owner profile and membership info |
| Helpline | Phone number and website |

---

## Setup — Step by Step

### Step 1 — Install Node.js

Go to https://nodejs.org and download the LTS version (v18 or v20).

After install, verify in terminal:
```
node -v
npm -v
```
Both should print a version number.

---

### Step 2 — Create the project folder

Open terminal (Mac: Terminal app / Windows: Command Prompt or PowerShell).

```
mkdir yamaha-service
cd yamaha-service
```

---

### Step 3 — Create the React app structure

Run this to set up React:
```
npx create-react-app .
```

Wait for it to finish (2–3 minutes).

---

### Step 4 — Delete the default files you don't need

```
rm src/App.css src/App.test.js src/logo.svg src/reportWebVitals.js src/setupTests.js
```

On Windows (Command Prompt):
```
del src\App.css src\App.test.js src\logo.svg src\reportWebVitals.js src\setupTests.js
```

---

### Step 5 — Replace src/index.js

Open src/index.js and replace ALL content with:

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
```

---

### Step 6 — Replace public/index.html

Open public/index.html and replace ALL content with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#1A1A1A" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
    <title>Yamaha Service Portal</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #1A1A1A; color: #fff; font-family: 'Barlow', sans-serif; -webkit-font-smoothing: antialiased; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #111; }
      ::-webkit-scrollbar-thumb { background: #E53935; border-radius: 3px; }
      input, textarea, select { font-family: 'Barlow', sans-serif; }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

---

### Step 7 — Add App.jsx

Copy the full App.jsx code into src/App.jsx
(this file is the complete website — all screens in one file)

---

### Step 8 — Run the website

```
npm start
```

Browser will automatically open at:
```
http://localhost:3000
```

Login with:
- Username: Kashyadeepsinh
- Password: 1234

---

## Color Palette

| Color | Hex | Used For |
|---|---|---|
| Deep Black | #1A1A1A | Page background |
| Dark Surface | #2C2C2C | Cards, Navbar |
| Yamaha Red | #E53935 | Accent, buttons, borders |
| Pure White | #FFFFFF | Text, headings |
| Muted Grey | #888888 | Subtitles, hints |
| Purple | #6A1B9A | Service Tracking tile |
| Dark Blue | #1565C0 | Links |
| Forest Green | #2E7D32 | Helpline tile, success |
| Amber Yellow | #F9A825 | Account tile, Gold Points |
| Slate | #37474F | Feedback tile |

---

## Build for Production

```
npm run build
```

This creates a build/ folder you can deploy to any web host.

---

## Project Structure

```
yamaha-service/
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── App.jsx        ← entire website is here
└── package.json
```
