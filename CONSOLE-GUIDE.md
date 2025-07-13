# 🖥️ How to Use in Browser Console

## 📋 **Detailed Step by Step**

### 1. **Prepare the Configuration File**
```bash
# Copy the template
copy linkedin-addon\config.template.js config.js

# Edit config.js with your information:
```

**Example of edited config.js:**
```javascript
const MY_NAME = "John Silva";
const MY_POSITION = "Full-Stack Developer";
const POS_SEARCH = "React, Node.js and Cloud";

const MESSAGE_TEMPLATE_TEXT = `Hi {firstName}, I hope you're doing well!

I'm a {MY_POSITION} from Brazil with experience in {POS_SEARCH}, seeking international opportunities.
I'd love to connect and expand my network.

Best regards,
    {MY_NAME}`;

const LINKEDIN_CONFIG = {
    MY_NAME: MY_NAME,
    MY_POSITION: MY_POSITION,
    POS_SEARCH: POS_SEARCH,
    MESSAGE_TEMPLATE: {
        TEXT: MESSAGE_TEMPLATE_TEXT,
        INCLUDE_NOTE: true
    },
    DEFAULT_LIMIT: 100,
    PREMIUM_LIMIT: 200,
    MIN_DELAY: 1000,
    MAX_DELAY: 3000
};

if (typeof window !== 'undefined') {
    window.LINKEDIN_CONFIG = LINKEDIN_CONFIG;
    window.MY_NAME = MY_NAME;
    window.MY_POSITION = MY_POSITION;
    window.POS_SEARCH = POS_SEARCH;
}
```

### 2. **Open LinkedIn and Console**
1. Go to LinkedIn.com
2. Navigate to a people/recruiters search page
3. Press **F12** to open Developer Tools
4. Click on the **Console** tab

### 3. **Load Configuration**
1. **Open the `config.js` file** in your text editor
2. **Select all content** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Paste in console** and press **Enter**

✅ **Expected result**: You will see something like:
```
> const MY_NAME = "John Silva";
undefined
```

### 4. **Load Main Script**
1. **Open the `Adiciona Recrutadores Avançado.js` file**
2. **Select all content** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Paste in console** and press **Enter**

✅ **Expected result**: The control panel appears in the corner of the screen!

### 5. **Use the Script**
1. Configure options in the panel:
   - ✅ Check "Test Mode" to validate messages
   - ✅ Set connection limit
   - ✅ Check "Premium User" if applicable

2. Click **"Start"** to begin

## 🧪 **Testing the System**

### **Test Mode with Limit = 1**
- Script stops after each attempt
- Shows message preview in console
- You manually confirm each send
- Perfect for validating the template

### **Test Mode with Limit > 1**
- Script shows preview in console
- Automatically cancels the invite
- Continues to next profile
- Perfect for seeing multiple examples without sending

## 🔧 **Troubleshooting**

### **Error: "Configurations not found"**
- Make sure to execute config.js BEFORE the main script
- Check if there are no syntax errors in config.js

### **Error: "MY_NAME is not defined"**
- The config.js was not loaded correctly
- Reload the page and try again

### **Panel doesn't appear**
- Check if you're on a LinkedIn page
- Reload the page and execute the scripts again

### **Script doesn't find buttons**
- Make sure you're on a people search page
- Wait for the page to load completely

## 💡 **Important Tips**

1. **Always test first** with Test Mode enabled
2. **Use low limits** to start (e.g., 5-10 connections)
3. **Monitor the console** to see detailed logs
4. **Reload the page** if something goes wrong
5. **Respect LinkedIn limits** to avoid restrictions

## 🔄 **For Updates**

When the main script is updated:
1. Run `python build-local.py` to generate new version
2. Reload the LinkedIn page
3. Execute again: config.js → main script
