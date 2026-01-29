#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
COCINA BRASILEÑA - Actualizador Automático de Versión
======================================================

Este script actualiza automáticamente el número de versión
en el archivo index.html cada vez que modificás el menú.

USO:
    python actualizar_version.py

El script:
1. Lee la versión actual del index.html
2. La incrementa automáticamente
3. Actualiza todos los archivos necesarios
4. Te muestra un resumen de los cambios

"""

import re
import os
from datetime import datetime

# Colores para la terminal
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header():
    """Muestra el encabezado del script"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}🇧🇷  COCINA BRASILEÑA - Actualizador de Versión  🇧🇷{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def get_current_version(filepath):
    """Obtiene la versión actual del archivo index.html"""
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            # Buscar el patrón ?v=X.X.X
            match = re.search(r'\?v=(\d+)\.(\d+)\.(\d+)', content)
            if match:
                return match.group(1), match.group(2), match.group(3)
            return None, None, None
    except FileNotFoundError:
        print(f"{Colors.RED}❌ Error: No se encontró el archivo {filepath}{Colors.END}")
        return None, None, None

def increment_version(major, minor, patch, tipo='patch'):
    """Incrementa el número de versión según el tipo"""
    major = int(major)
    minor = int(minor)
    patch = int(patch)
    
    if tipo == 'major':
        major += 1
        minor = 0
        patch = 0
    elif tipo == 'minor':
        minor += 1
        patch = 0
    else:  # patch
        patch += 1
    
    return str(major), str(minor), str(patch)

def update_version_in_file(filepath, old_version, new_version):
    """Actualiza la versión en el archivo"""
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Reemplazar todas las ocurrencias de la versión antigua
        old_pattern = f'?v={old_version}'
        new_pattern = f'?v={new_version}'
        content = content.replace(old_pattern, new_pattern)
        
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)
        
        return True
    except Exception as e:
        print(f"{Colors.RED}❌ Error al actualizar {filepath}: {str(e)}{Colors.END}")
        return False

def create_backup(filepath):
    """Crea un backup del archivo"""
    try:
        backup_name = f"{filepath}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        with open(filepath, 'r', encoding='utf-8') as original:
            content = original.read()
        with open(backup_name, 'w', encoding='utf-8') as backup:
            backup.write(content)
        print(f"{Colors.GREEN}✅ Backup creado: {backup_name}{Colors.END}")
        return True
    except Exception as e:
        print(f"{Colors.YELLOW}⚠️  No se pudo crear backup: {str(e)}{Colors.END}")
        return False

def update_changelog(old_version, new_version, changes):
    """Actualiza el archivo de registro de cambios"""
    changelog_file = 'CHANGELOG.md'
    timestamp = datetime.now().strftime('%d/%m/%Y %H:%M')
    
    new_entry = f"\n## v{new_version} - {timestamp}\n\n"
    new_entry += f"Cambios desde v{old_version}:\n"
    for change in changes:
        new_entry += f"- {change}\n"
    new_entry += "\n---\n"
    
    try:
        if os.path.exists(changelog_file):
            with open(changelog_file, 'r', encoding='utf-8') as f:
                content = f.read()
            content = new_entry + content
        else:
            content = f"# Registro de Cambios - Cocina Brasileña\n\n{new_entry}"
        
        with open(changelog_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"{Colors.GREEN}✅ CHANGELOG actualizado{Colors.END}")
        return True
    except Exception as e:
        print(f"{Colors.YELLOW}⚠️  No se pudo actualizar CHANGELOG: {str(e)}{Colors.END}")
        return False

def main():
    """Función principal"""
    print_header()
    
    index_file = 'index.html'
    
    # Verificar que el archivo existe
    if not os.path.exists(index_file):
        print(f"{Colors.RED}❌ Error: No se encontró {index_file}{Colors.END}")
        print(f"{Colors.YELLOW}Asegurate de ejecutar este script desde la carpeta raíz del proyecto.{Colors.END}")
        return
    
    # Obtener versión actual
    major, minor, patch = get_current_version(index_file)
    
    if major is None:
        print(f"{Colors.RED}❌ No se pudo leer la versión actual{Colors.END}")
        return
    
    old_version = f"{major}.{minor}.{patch}"
    print(f"{Colors.BOLD}Versión actual: {Colors.YELLOW}v{old_version}{Colors.END}\n")
    
    # Preguntar tipo de actualización
    print("¿Qué tipo de cambios hiciste?")
    print(f"{Colors.GREEN}1.{Colors.END} Cambios pequeños (precios, descripciones) → Incrementar PATCH")
    print(f"{Colors.BLUE}2.{Colors.END} Cambios medianos (agregar/quitar platos) → Incrementar MINOR")
    print(f"{Colors.RED}3.{Colors.END} Cambios grandes (renovación completa) → Incrementar MAJOR")
    print()
    
    choice = input("Elegí una opción (1/2/3) [1]: ").strip() or "1"
    
    tipo_map = {
        '1': 'patch',
        '2': 'minor',
        '3': 'major'
    }
    
    tipo = tipo_map.get(choice, 'patch')
    
    # Incrementar versión
    new_major, new_minor, new_patch = increment_version(major, minor, patch, tipo)
    new_version = f"{new_major}.{new_minor}.{new_patch}"
    
    print(f"\n{Colors.BOLD}Nueva versión: {Colors.GREEN}v{new_version}{Colors.END}\n")
    
    # Confirmar
    confirm = input(f"¿Confirmar actualización? (s/n) [s]: ").strip().lower() or 's'
    
    if confirm != 's':
        print(f"\n{Colors.YELLOW}❌ Actualización cancelada{Colors.END}")
        return
    
    # Crear backup
    print(f"\n{Colors.BOLD}Creando backup...{Colors.END}")
    create_backup(index_file)
    
    # Actualizar versión
    print(f"\n{Colors.BOLD}Actualizando versión...{Colors.END}")
    success = update_version_in_file(index_file, old_version, new_version)
    
    if success:
        print(f"{Colors.GREEN}✅ Versión actualizada exitosamente!{Colors.END}")
        
        # Preguntar por changelog
        print(f"\n{Colors.BOLD}¿Querés registrar estos cambios?{Colors.END}")
        add_changelog = input("(s/n) [n]: ").strip().lower() or 'n'
        
        if add_changelog == 's':
            changes = []
            print("\nIngresá los cambios realizados (dejá vacío para terminar):")
            while True:
                change = input("- ").strip()
                if not change:
                    break
                changes.append(change)
            
            if changes:
                update_changelog(old_version, new_version, changes)
        
        # Resumen final
        print(f"\n{Colors.BOLD}{Colors.GREEN}{'='*60}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.GREEN}✅  ACTUALIZACIÓN COMPLETADA  ✅{Colors.END}")
        print(f"{Colors.BOLD}{Colors.GREEN}{'='*60}{Colors.END}")
        print(f"\n{Colors.BOLD}Versión anterior:{Colors.END} v{old_version}")
        print(f"{Colors.BOLD}Versión nueva:{Colors.END} v{new_version}")
        print(f"\n{Colors.BOLD}Próximos pasos:{Colors.END}")
        print(f"{Colors.YELLOW}1.{Colors.END} Guardá todos los archivos")
        print(f"{Colors.YELLOW}2.{Colors.END} Subí los archivos al servidor")
        print(f"{Colors.YELLOW}3.{Colors.END} Verificá en modo incógnito")
        print(f"\n{Colors.GREEN}¡Los clientes verán la nueva versión inmediatamente!{Colors.END}\n")
    else:
        print(f"{Colors.RED}❌ Error al actualizar la versión{Colors.END}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}❌ Actualización cancelada por el usuario{Colors.END}\n")
    except Exception as e:
        print(f"\n{Colors.RED}❌ Error inesperado: {str(e)}{Colors.END}\n")
