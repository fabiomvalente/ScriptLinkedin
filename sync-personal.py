#!/usr/bin/env python3
"""
Script de Sincronização para Pasta Pessoal
Sincroniza atualizações do projeto preservando dados pessoais configurados.

@author Fábio M Valente - https://github.com/fabiomvalente
@version 1.4
"""

import os
import shutil
import json
from pathlib import Path

def print_header():
    print("🔄 Sincronização de Projeto LinkedIn")
    print("=" * 50)

def get_personal_folder():
    """Solicita o caminho da pasta pessoal"""
    while True:
        folder = input("📁 Caminho da sua pasta pessoal (ex: C:\\MeuLinkedIn): ").strip()
        if not folder:
            continue
        
        folder_path = Path(folder)
        if not folder_path.exists():
            create = input(f"❓ Pasta '{folder}' não existe. Criar? (y/N): ")
            if create.lower() == 'y':
                folder_path.mkdir(parents=True, exist_ok=True)
                print(f"✅ Pasta criada: {folder}")
                return folder_path
            else:
                continue
        return folder_path

def backup_personal_configs(personal_folder):
    """Faz backup dos arquivos de configuração pessoal"""
    backups = {}
    
    # Backup config.js principal
    main_config = personal_folder / "config.js"
    if main_config.exists():
        with open(main_config, 'r', encoding='utf-8') as f:
            backups['main_config'] = f.read()
        print("💾 Backup: config.js principal")
    
    # Backup config.js da extensão
    addon_config = personal_folder / "linkedin-addon" / "config.js"
    if addon_config.exists():
        with open(addon_config, 'r', encoding='utf-8') as f:
            backups['addon_config'] = f.read()
        print("💾 Backup: config.js da extensão")
    
    return backups

def sync_files(source_folder, personal_folder):
    """Sincroniza arquivos do projeto para a pasta pessoal"""
    source = Path(source_folder)
    target = Path(personal_folder)
    
    # Arquivos para sincronizar (excluindo configs pessoais)
    files_to_sync = [
        "Adiciona Recrutadores Avançado.js",
        "build-local.py",
        "setup-extension.py",
        "README.md",
        "setup.md",
        "config.template.js",
        "config.example.js"
    ]
    
    # Pastas para sincronizar
    folders_to_sync = [
        "linkedin-addon"
    ]
    
    print("\n📂 Sincronizando arquivos...")
    
    # Sincronizar arquivos individuais
    for file_name in files_to_sync:
        source_file = source / file_name
        target_file = target / file_name
        
        if source_file.exists():
            target_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_file, target_file)
            print(f"✅ {file_name}")
    
    # Sincronizar pastas (excluindo config.js)
    for folder_name in folders_to_sync:
        source_folder_path = source / folder_name
        target_folder_path = target / folder_name
        
        if source_folder_path.exists():
            # Remove pasta de destino se existir
            if target_folder_path.exists():
                shutil.rmtree(target_folder_path)
            
            # Copia pasta completa
            shutil.copytree(source_folder_path, target_folder_path)
            
            # Remove config.js se foi copiado
            config_in_target = target_folder_path / "config.js"
            if config_in_target.exists():
                config_in_target.unlink()
            
            print(f"✅ Pasta {folder_name}/")

def restore_personal_configs(personal_folder, backups):
    """Restaura os arquivos de configuração pessoal"""
    print("\n🔧 Restaurando configurações pessoais...")
    
    # Restaurar config.js principal
    if 'main_config' in backups:
        main_config = personal_folder / "config.js"
        with open(main_config, 'w', encoding='utf-8') as f:
            f.write(backups['main_config'])
        print("✅ Restaurado: config.js principal")
    
    # Restaurar config.js da extensão
    if 'addon_config' in backups:
        addon_config = personal_folder / "linkedin-addon" / "config.js"
        addon_config.parent.mkdir(exist_ok=True)
        with open(addon_config, 'w', encoding='utf-8') as f:
            f.write(backups['addon_config'])
        print("✅ Restaurado: config.js da extensão")

def create_initial_configs(personal_folder):
    """Cria configurações iniciais se não existirem"""
    print("\n📝 Verificando configurações...")
    
    # Config principal
    main_config = personal_folder / "config.js"
    main_template = personal_folder / "config.template.js"
    
    if not main_config.exists() and main_template.exists():
        shutil.copy2(main_template, main_config)
        print("📋 Criado config.js principal a partir do template")
        print("⚠️  EDITE o arquivo config.js com suas informações!")
    
    # Config da extensão
    addon_config = personal_folder / "linkedin-addon" / "config.js"
    addon_template = personal_folder / "linkedin-addon" / "config.template.js"
    
    if not addon_config.exists() and addon_template.exists():
        shutil.copy2(addon_template, addon_config)
        print("📋 Criado config.js da extensão a partir do template")
        print("⚠️  EDITE o arquivo linkedin-addon/config.js com suas informações!")

def main():
    print_header()
    
    # Pasta atual (projeto)
    current_folder = Path.cwd()
    print(f"📁 Pasta do projeto: {current_folder}")
    
    # Solicitar pasta pessoal
    personal_folder = get_personal_folder()
    print(f"📁 Pasta pessoal: {personal_folder}")
    
    # Fazer backup das configurações pessoais
    backups = backup_personal_configs(personal_folder)
    
    # Sincronizar arquivos
    sync_files(current_folder, personal_folder)
    
    # Restaurar configurações pessoais
    restore_personal_configs(personal_folder, backups)
    
    # Criar configurações iniciais se necessário
    create_initial_configs(personal_folder)
    
    print("\n🎉 Sincronização concluída!")
    print(f"\n📁 Sua pasta pessoal: {personal_folder}")
    print("📋 Próximos passos:")
    print("   1. Verifique se seus arquivos config.js estão corretos")
    print("   2. Execute build-local.py na pasta pessoal para gerar a extensão")
    print("   3. Use a extensão normalmente")
    
    print(f"\n🔄 Para futuras atualizações:")
    print(f"   Execute: python {current_folder}/sync-personal.py")

if __name__ == "__main__":
    main()
