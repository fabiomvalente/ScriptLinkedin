# Mozilla Firefox Extension Installation

## 📋 Prerequisites
- Firefox 57 or higher
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

### 2. Prepare files for Firefox
```bash
# Copy Firefox-specific files
copy firefox\manifest.json manifest.json
copy firefox\background.js background.js
```

## 🚀 Installation

### Method 1: Temporary Installation (Development)

1. Open Firefox and type in the address bar: `about:debugging`
2. Click **"This Firefox"**
3. Click **"Load Temporary Add-on..."**
4. Navigate to the `linkedin-addon/` folder and select the `manifest.json` file
5. The extension will be loaded temporarily

⚠️ **Note**: Temporary extensions are removed when Firefox is closed.

### Method 2: Permanent Installation (Signed)

For permanent installation, the extension needs to be signed by Mozilla:

1. Create an account at [addons.mozilla.org](https://addons.mozilla.org/developers/)
2. Upload the extension for review
3. After approval, install normally

### Method 3: Firefox Developer Edition (No signature)

1. Download [Firefox Developer Edition](https://www.mozilla.org/firefox/developer/)
2. Type `about:config` in the address bar
3. Search for `xpinstall.signatures.required`
4. Change the value to `false`
5. Now you can install unsigned extensions permanently

## 📱 How to Use

1. Access LinkedIn
2. Go to the people search page
3. Click the extension icon in the toolbar
4. Configure options in the panel that appears
5. Click "Start" to begin automation

## 🔧 Troubleshooting

**Error: "config.js not found"**
- Check if you copied `config.template.js` to `config.js`
- Make sure the file is in the `linkedin-addon/` folder

**Extension doesn't appear**
- Check if you copied files from the `firefox/` folder
- Make sure `manifest.json` is the Firefox one (Manifest V2)
- Reload the extension in `about:debugging`

**Script doesn't execute**
- Check if you're on a LinkedIn page
- Open developer console (F12) to see errors

## 📁 File Structure for Firefox

```
linkedin-addon/
├── manifest.json (copied from firefox/manifest.json)
├── background.js (copied from firefox/background.js)
├── script.js
├── config.js (your personal information)
├── config.template.js
├── icon.png
└── firefox/
    ├── manifest.json (Firefox specific)
    └── background.js (Firefox specific)
```

## 🔄 Updates

To update the extension:
1. Replace files in the folder
2. In `about:debugging`, click "Reload" on the extension
3. Or remove and reinstall the extension

## ⚠️ Firefox Limitations

- Temporary extensions are removed when closing the browser
- For permanent installation, Mozilla signature is required
- Use Firefox Developer Edition for development without signature
