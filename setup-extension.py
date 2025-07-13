#!/usr/bin/env python3
"""
Automated setup script for LinkedIn Connect Browser Extension
Handles configuration, building, and packaging for all supported browsers.

@author Fábio M Valente - https://github.com/fabiomvalente
@version 1.4
"""

import os
import shutil
import json
import zipfile
from pathlib import Path

def print_header():
    print("🚀 LinkedIn Connect Extension Setup")
    print("=" * 50)

def check_requirements():
    """Check if all required files exist"""
    required_files = [
        "Adiciona Recrutadores Avançado.js",
        "linkedin-addon/config.template.js",
        "linkedin-addon/manifest.json",
        "linkedin-addon/background.js",
        "linkedin-addon/icon.png"
    ]
    
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print("❌ Arquivos obrigatórios não encontrados:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("✅ Todos os arquivos obrigatórios encontrados")
    return True

def setup_config():
    """Setup configuration file"""
    addon_dir = Path("linkedin-addon")
    config_template = addon_dir / "config.template.js"
    config_file = addon_dir / "config.js"
    
    if config_file.exists():
        response = input("📝 config.js já existe. Sobrescrever? (y/N): ")
        if response.lower() != 'y':
            print("⏭️  Mantendo config.js existente")
            return True
    
    if not config_template.exists():
        print("❌ config.template.js não encontrado!")
        return False
    
    # Copy template to config.js
    shutil.copy2(config_template, config_file)
    print("✅ config.js criado a partir do template")
    
    # Interactive configuration
    print("\n📋 Configure suas informações pessoais:")
    name = input("Seu nome completo: ").strip()
    position = input("Seu cargo atual: ").strip()
    expertise = input("Sua área de especialização: ").strip()
    
    if name and position and expertise:
        # Update config file
        with open(config_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = content.replace('"Your Full Name Here"', f'"{name}"')
        content = content.replace('"Your Current Position or Job Title"', f'"{position}"')
        content = content.replace('"Your Area of Expertise or Specialization"', f'"{expertise}"')
        
        with open(config_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ Configurações pessoais salvas")
        return True
    else:
        print("⚠️  Configuração incompleta. Edite config.js manualmente.")
        return True

def build_extension():
    """Build the extension from main script"""
    print("\n🔨 Construindo extensão...")
    
    # Run the existing build script
    try:
        import subprocess
        result = subprocess.run(["python", "build-local.py"], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Extensão construída com sucesso")
            return True
        else:
            print(f"❌ Erro na construção: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Erro ao executar build-local.py: {e}")
        return False

def create_browser_packages():
    """Create packages for different browsers"""
    print("\n📦 Preparando para diferentes navegadores...")

    addon_dir = Path("linkedin-addon")
    firefox_dir = addon_dir / "firefox"

    # Para Chrome/Edge/Opera - já está pronto na pasta linkedin-addon/
    print("✅ Chrome/Edge/Opera: Use a pasta linkedin-addon/ diretamente")

    # Para Firefox - apenas mostrar instruções
    if firefox_dir.exists():
        print("✅ Firefox: Copie os arquivos da pasta firefox/ quando necessário")
        print("   Comando: copy firefox\\manifest.json manifest.json")
        print("   Comando: copy firefox\\background.js background.js")
    else:
        print("⚠️  Firefox: Pasta firefox/ não encontrada")

    return True

def main():
    print_header()
    
    if not check_requirements():
        print("\n❌ Setup cancelado devido a arquivos faltantes")
        return
    
    if not setup_config():
        print("\n❌ Setup cancelado devido a erro na configuração")
        return
    
    if not build_extension():
        print("\n❌ Setup cancelado devido a erro na construção")
        return
    
    if not create_browser_packages():
        print("\n❌ Setup cancelado devido a erro na criação de pacotes")
        return
    
    print("\n🎉 Setup concluído com sucesso!")
    print("\n📁 Arquivos criados:")
    print("   - linkedin-addon/config.js (suas configurações)")
    print("   - linkedin-addon/script.js (gerado automaticamente)")

    print("\n🚀 Próximos passos:")
    print("   1. Para Chrome/Edge/Opera:")
    print("      - Abra chrome://extensions/ (ou edge://extensions/)")
    print("      - Ative 'Modo desenvolvedor'")
    print("      - 'Carregar sem compactação' → selecione pasta linkedin-addon/")
    print("   2. Para Firefox:")
    print("      - Execute: copy linkedin-addon\\firefox\\*.* linkedin-addon\\")
    print("      - Abra about:debugging → 'Carregar extensão temporária'")
    print("   3. Consulte GUIA-RAPIDO.md para mais detalhes")

if __name__ == "__main__":
    main()
