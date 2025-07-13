#!/usr/bin/env python3
"""
Sistema de Sincronização Inteligente
Usa configurações do config.js para automatizar sincronização e builds.

@author Fábio M Valente - https://github.com/fabiomvalente
@version 1.4
"""

import os
import shutil
import json
import re
from pathlib import Path

def print_header():
    print("🔄 Sincronização Inteligente LinkedIn")
    print("=" * 50)

def load_config():
    """Carrega configurações do arquivo config.js"""
    config_file = Path("config.js")
    if not config_file.exists():
        print("❌ Arquivo config.js não encontrado!")
        print("   Execute: copy config-master.template.js config.js")
        print("   Depois edite o arquivo com suas informações")
        return None
    
    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extrair configurações básicas usando regex
        config = {}
        
        # Extrair paths
        paths_match = re.search(r'PERSONAL_FOLDER:\s*["\']([^"\']+)["\']', content)
        if paths_match:
            config['personal_folder'] = paths_match.group(1)
        
        addon_match = re.search(r'ADDON_SYNC_FOLDER:\s*["\']([^"\']+)["\']', content)
        if addon_match:
            config['addon_folder'] = addon_match.group(1)
        
        # Extrair auto_create
        auto_create_match = re.search(r'AUTO_CREATE_FOLDERS:\s*(true|false)', content)
        if auto_create_match:
            config['auto_create'] = auto_create_match.group(1) == 'true'
        
        return config
    except Exception as e:
        print(f"❌ Erro ao ler config.js: {e}")
        return None

def setup_folders(config):
    """Configura as pastas conforme configuração"""
    personal_folder = Path(config.get('personal_folder', ''))
    addon_folder = Path(config.get('addon_folder', 'linkedin-addon'))
    auto_create = config.get('auto_create', True)
    
    if not personal_folder.exists() and auto_create:
        print(f"📁 Criando pasta pessoal: {personal_folder}")
        personal_folder.mkdir(parents=True, exist_ok=True)
    
    if not addon_folder.exists():
        print(f"📁 Criando pasta de addon: {addon_folder}")
        addon_folder.mkdir(parents=True, exist_ok=True)
    
    return personal_folder, addon_folder

def sync_to_personal(personal_folder):
    """Sincroniza arquivos para pasta pessoal preservando configs"""
    print(f"\n📂 Sincronizando para: {personal_folder}")
    
    # Backup configs existentes
    config_backup = None
    personal_config = personal_folder / "config.js"
    if personal_config.exists():
        with open(personal_config, 'r', encoding='utf-8') as f:
            config_backup = f.read()
        print("💾 Backup da configuração pessoal")
    
    # Arquivos para sincronizar
    files_to_sync = [
        "Adiciona Recrutadores Avançado.js",
        "build-local.py",
        "sync-smart.py",
        "GUIA-RAPIDO.md",
        "config-master.template.js"
    ]
    
    # Sincronizar arquivos
    for file_name in files_to_sync:
        source_file = Path(file_name)
        target_file = personal_folder / file_name
        
        if source_file.exists():
            target_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_file, target_file)
            print(f"✅ {file_name}")
    
    # Sincronizar pasta linkedin-addon (sem config.js)
    source_addon = Path("linkedin-addon")
    target_addon = personal_folder / "linkedin-addon"
    
    if source_addon.exists():
        if target_addon.exists():
            # Backup config da extensão se existir
            addon_config_backup = None
            addon_config = target_addon / "config.js"
            if addon_config.exists():
                with open(addon_config, 'r', encoding='utf-8') as f:
                    addon_config_backup = f.read()
            
            shutil.rmtree(target_addon)
        
        shutil.copytree(source_addon, target_addon)
        
        # Remove config.js copiado
        copied_config = target_addon / "config.js"
        if copied_config.exists():
            copied_config.unlink()
        
        # Restaura config da extensão se havia backup
        if 'addon_config_backup' in locals() and addon_config_backup:
            with open(target_addon / "config.js", 'w', encoding='utf-8') as f:
                f.write(addon_config_backup)
            print("✅ Configuração da extensão restaurada")
        
        print("✅ Pasta linkedin-addon/")
    
    # Restaurar config principal
    if config_backup:
        with open(personal_config, 'w', encoding='utf-8') as f:
            f.write(config_backup)
        print("✅ Configuração principal restaurada")
    else:
        # Criar config inicial se não existir
        template_file = personal_folder / "config-master.template.js"
        if template_file.exists() and not personal_config.exists():
            shutil.copy2(template_file, personal_config)
            print("📋 Configuração inicial criada - EDITE o arquivo config.js!")

def sync_to_github(addon_folder):
    """Sincroniza para pasta linkedin-addon (GitHub)"""
    print(f"\n📦 Sincronizando para GitHub: {addon_folder}")
    
    # Arquivos essenciais para GitHub
    essential_files = [
        ("linkedin-addon/manifest.json", "manifest.json"),
        ("linkedin-addon/background.js", "background.js"),
        ("linkedin-addon/icon.png", "icon.png"),
        ("linkedin-addon/config.template.js", "config.template.js"),
        ("linkedin-addon/firefox", "firefox")
    ]
    
    for source_path, target_name in essential_files:
        source = Path(source_path)
        target = addon_folder / target_name
        
        if source.exists():
            if source.is_dir():
                if target.exists():
                    shutil.rmtree(target)
                shutil.copytree(source, target)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, target)
            print(f"✅ {target_name}")
    
    # Gerar script.js a partir do arquivo original
    original_script = Path("Adiciona Recrutadores Avançado.js")
    target_script = addon_folder / "script.js"
    
    if original_script.exists():
        with open(original_script, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove wrapper javascript: se existir
        if content.startswith("javascript:"):
            content = content[len("javascript:"):].strip()
        if content.startswith("(function () {"):
            content = content[len("(function () {"):].strip()
        if content.endswith("})();"):
            content = content[:-len("})();")].strip()
        
        with open(target_script, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ script.js gerado")

def main():
    print_header()
    
    # Carregar configurações
    config = load_config()
    if not config:
        return
    
    print(f"📋 Configurações carregadas:")
    print(f"   Pasta pessoal: {config.get('personal_folder', 'Não configurada')}")
    print(f"   Pasta addon: {config.get('addon_folder', 'linkedin-addon')}")
    
    # Configurar pastas
    personal_folder, addon_folder = setup_folders(config)
    
    # Sincronizar para pasta pessoal
    if personal_folder and personal_folder != Path('.'):
        sync_to_personal(personal_folder)
    
    # Sincronizar para GitHub
    sync_to_github(addon_folder)
    
    print("\n🎉 Sincronização concluída!")
    print("\n📋 Próximos passos:")
    if personal_folder and personal_folder != Path('.'):
        print(f"   1. Vá para sua pasta pessoal: {personal_folder}")
        print("   2. Execute: python build-local.py")
        print("   3. Use a extensão da pasta linkedin-addon/")
    else:
        print("   1. Execute: python build-local.py")
        print("   2. Use a extensão da pasta linkedin-addon/")
    
    print("\n🔄 Para futuras atualizações:")
    print("   Execute: python sync-smart.py")

if __name__ == "__main__":
    main()
