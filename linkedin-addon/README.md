# 🧩 LinkedIn Connect Browser Extension

This folder contains the browser extension files. This is where `build-local.py` generates the final files for browser use.

## 🚀 **How to Use**

### 1. **Initial Setup**
```bash
# In the project root folder
copy config.template.js config.js
# Edit config.js with your personal information

# Generate the extension
python build-local.py
```

### 2. **Install in Browser**

**Chrome/Edge/Opera:**
1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode"
3. "Load unpacked" → select this `linkedin-addon/` folder

**Firefox:**
1. Run: `copy firefox\manifest.json manifest.json`
2. Run: `copy firefox\background.js background.js`
3. Open `about:debugging` → "Load Temporary Add-on"
4. Select `manifest.json` from this folder

### 3. **Browser Console Usage (Alternative)**
```javascript
// 1. Open LinkedIn console (F12)
// 2. Paste and execute the content of config.js file
// 3. Paste and execute the content of script.js file
```

## 📁 **This Folder Structure (GitHub)**

```
linkedin-addon/
├── README.md                  ← This file
├── manifest.json              ← Manifest V3 (Chrome/Edge/Opera)
├── background.js              ← Background script V3
├── config.template.js         ← Configuration template
├── icon.png                   ← Extension icon
├── firefox/                   ← Firefox specific files
│   ├── manifest.json          ← Manifest V2 (Firefox)
│   └── background.js          ← Background script V2
├── README-Chrome.md           ← Chrome instructions
├── README-Edge.md             ← Edge instructions
├── README-Firefox.md          ← Firefox instructions
└── README-Opera.md            ← Opera instructions
```

## ⚠️ **Files NOT Included (Generated Automatically)**

- `script.js` - Generated from "Adiciona Recrutadores Avançado.js"
- `config.js` - Your personal settings (not committed)

## 🔄 **Workflow**

1. **Development**: Edit `Adiciona Recrutadores Avançado.js` in root
2. **Sync**: Run `python sync-smart.py`
3. **Build**: Run `python build-local.py` in personal folder
4. **Use**: Load extension from personal folder

## 🧪 **Novas Funcionalidades**

### Modo de Teste
- ✅ Checkbox "Modo Teste" no painel de controle
- ✅ Pausa antes de cada envio para validação manual
- ✅ Preview da mensagem personalizada
- ✅ Confirmação individual de cada conexão

### Configuração Centralizada
- ✅ Um único arquivo `config.js` com todas as opções
- ✅ Template de mensagem personalizável
- ✅ Configuração de caminhos automática
- ✅ Sincronização inteligente

### Multi-Browser
- ✅ Chrome, Edge, Opera (Manifest V3)
- ✅ Firefox (Manifest V2)
- ✅ Arquivos específicos organizados

## 📖 **Documentação Completa**

- [GUIA-RAPIDO.md](../GUIA-RAPIDO.md) - Instruções rápidas
- [README.md](../README.md) - Documentação completa
- [config-master.template.js](../config-master.template.js) - Template de configuração

## 🔒 **Segurança**

- ✅ Dados pessoais nunca commitados
- ✅ Configurações separadas do código
- ✅ Sistema de backup automático
- ✅ Validação de segurança integrada
