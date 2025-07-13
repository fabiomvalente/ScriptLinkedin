import zipfile
from pathlib import Path
import re
import shutil
import json

# Caminhos
orig_script = Path("Adiciona Recrutadores Avançado.js")
dest_dir = Path("linkedin-addon")
dest_script = dest_dir / "script.js"
config_template = Path("config.template.js")  # Template na raiz
addon_config = dest_dir / "config.js"         # Config na pasta da extensão
manifest_path = dest_dir / "manifest.json"
zip_path = dest_dir / "linkedin-addon-local.zip"

def check_config_exists():
    """Verifica se o arquivo config.js existe na pasta da extensão"""
    return addon_config.exists()

def create_config_from_template():
    """Cria config.js a partir do template da raiz se não existir"""
    if not addon_config.exists() and config_template.exists():
        print("📝 Criando linkedin-addon/config.js a partir do template da raiz...")
        with open(config_template, "r", encoding="utf-8") as f:
            content = f.read()
        with open(addon_config, "w", encoding="utf-8") as f:
            f.write(content)
        print("⚠️  IMPORTANTE: Edite linkedin-addon/config.js com suas informações pessoais!")
        return True
    return False

def update_manifest_version(version):
    """Atualiza a versão no manifest.json"""
    if manifest_path.exists():
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.loads(f.read())
        manifest["version"] = version
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)
        print(f"📦 Manifest atualizado para versão {version}")

# Carrega o conteúdo original
with open(orig_script, "r", encoding="utf-8") as f:
    content = f.read().strip()

# Remove javascript:(function () { e })();
if content.startswith("javascript:"):
    content = content[len("javascript:"):].strip()
if content.startswith("(function () {"):
    content = content[len("(function () {"):].strip()
if content.endswith("})();"):
    content = content[:-len("})();")].strip()

# Detecta a linha const SCRIPT_VERSION = "x.y";
version_match = re.search(r'const\s+SCRIPT_VERSION\s*=\s*"([0-9.]+)"', content)
if not version_match:
    raise ValueError("❌ Versão do script não encontrada. Adicione 'const SCRIPT_VERSION = \"x.y\";' no topo do JS.")

script_version = version_match.group(1)

# Cria diretório destino se não existir
dest_dir.mkdir(exist_ok=True)

# Verifica se config.js existe na raiz
root_config = Path("config.js")
if not root_config.exists():
    print("❌ ERRO: Arquivo config.js não encontrado na raiz!")
    print("   1. Execute: copy config.template.js config.js")
    print("   2. Edite config.js com suas informações pessoais")
    print("   3. Execute este script novamente")
    exit(1)

# Copia config.js da raiz para a pasta da extensão
print("📋 Copiando config.js para a pasta da extensão...")
shutil.copy2(root_config, addon_config)

# Salva script limpo
with open(dest_script, "w", encoding="utf-8") as f:
    f.write(content)

# Arquivos Firefox já estão na pasta firefox/ - não precisa copiar

# Atualiza versão no manifest
update_manifest_version(script_version)

print(f"✅ script.js gerado com versão {script_version}")
print("✅ config.js copiado para a pasta da extensão")

# Gera o zip dentro da pasta linkedin-addon (excluindo arquivos pessoais)
excluded_files = {zip_path.name, "config.js", ".DS_Store", "Thumbs.db"}

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for file in dest_dir.rglob("*"):
        if file.is_file() and file.name not in excluded_files:
            zipf.write(file, arcname=file.relative_to(dest_dir))

print(f"✅ ZIP criado em: {zip_path}")
print("📦 Arquivos incluídos no ZIP:")
with zipfile.ZipFile(zip_path, 'r') as zipf:
    for name in sorted(zipf.namelist()):
        print(f"   - {name}")

print("\n🔒 Arquivos excluídos (dados pessoais):")
for excluded in excluded_files:
    if (dest_dir / excluded).exists():
        print(f"   - {excluded}")

print(f"\n🎯 Para usar a extensão:")
print(f"   1. Chrome/Edge/Opera: Carregue a pasta linkedin-addon/ no navegador")
print(f"   2. Firefox: Execute 'copy firefox\\*.* .' na pasta linkedin-addon/ primeiro")
print(f"   3. Certifique-se de que linkedin-addon/config.js está configurado com suas informações")
print(f"   4. 🧪 NOVO: Use 'Modo Teste' para validar mensagens")

# Verifica se config.js tem valores padrão
with open(addon_config, 'r', encoding='utf-8') as f:
    config_content = f.read()

if "Your Full Name Here" in config_content:
    print(f"\n⚠️  IMPORTANTE:")
    print(f"   - Edite config.js na raiz com suas informações pessoais")
    print(f"   - Substitua 'Your Full Name Here' pelo seu nome real")
    print(f"   - Substitua 'Your Current Position' pelo seu cargo")
    print(f"   - Substitua 'Your Area of Expertise' pela sua especialização")
    print(f"   - Execute novamente: python build-local.py")