# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. 📁 Copy Configuration File

**Windows (Command Prompt):**
```cmd
copy config.template.js config.js
```

**Windows (PowerShell):**
```powershell
Copy-Item config.template.js config.js
```

**Mac/Linux:**
```bash
cp config.template.js config.js
```

### 2. ✏️ Edit Your Personal Information

Open `config.js` in any text editor and replace:

```javascript
// BEFORE (template values)
MY_NAME: "Your Full Name Here",
MY_POSITION: "Your Current Position or Job Title",
POS_SEARCH: "Your Area of Expertise or Specialization",

// AFTER (your actual information)
MY_NAME: "John Smith",
MY_POSITION: "Software Engineer",
POS_SEARCH: "Full-Stack Development",
```

### 3. 🔒 Verify Security

Check that `config.js` is listed in `.gitignore`:
```
# Personal Configuration Files - DO NOT COMMIT
config.js
```

### 4. 🚀 Test the Script

1. Open LinkedIn and go to a recruiter search page
2. Open Developer Tools (F12) → Console
3. Copy and paste the content of `config.js` first
4. Copy and paste the content of `Adiciona Recrutadores Avançado.js`
5. You should see the control panel appear

### 5. ✅ Ready to Use!

The script is now configured with your personal information and ready to use safely.

## 🆘 Troubleshooting

**Error: "Configurations not found"**
- Make sure you copied `config.template.js` to `config.js`
- Load `config.js` in the browser console before the main script

**Error: "Configurations not filled"**
- Edit `config.js` and replace all template values with your actual information

**Personal data in Git:**
- Follow the repository reset instructions in README.md
- The `.gitignore` file will prevent future accidents
