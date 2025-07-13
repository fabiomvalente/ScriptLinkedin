
# Microsoft Edge Extension Installation

## 📋 Prerequisites
- Microsoft Edge (Chromium-based version)
- `config.js` file configured with your personal information

## 🛠️ Preparation

### 1. Configure your personal information
```bash
# In the linkedin-addon/ folder
copy config.template.js config.js
```

Edit the `config.js` file and fill in:
- `MY_NAME`: Your full name
- `MY_POSITION`: Your current position
- `POS_SEARCH`: Your area of expertise

## 🚀 Installation

1. Open the browser and access: `edge://extensions`
2. Enable **Developer mode** (bottom left corner)
3. Click **"Load unpacked"**
4. Select the `linkedin-addon/` folder
5. The extension will be loaded and appear in the list

## 📱 How to Use

1. Access LinkedIn
2. Go to the people search page
3. Click the extension icon in the toolbar
4. Configure options in the panel that appears
5. Click "Start" to begin automation

## 🔧 Troubleshooting

**Error: "Configurations not found"**
- Check if you copied `config.template.js` to `config.js`
- Make sure you filled in your personal information

**Extension doesn't load**
- Check if all files are in the folder
- Reload the extension by clicking the refresh icon

**Script doesn't execute**
- Check if you're on a LinkedIn page
- Open developer console (F12) to see errors
