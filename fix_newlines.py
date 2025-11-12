#!/usr/bin/env python3
"""
Script to fix newlines in Markdown files that have literal \n instead of actual newlines.
Usage: python3 fix_newlines.py <file_path>
"""

import sys
import os

def fix_newlines(file_path):
    """Fix literal \n characters to actual newlines in a file."""
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        return False
    
    try:
        # Read the file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file contains literal \n (not actual newlines)
        if '\\n' in content and content.count('\n') < content.count('\\n'):
            print(f"Fixing newlines in {file_path}...")
            
            # Replace literal \n with actual newlines
            # Handle both \n and \\n cases
            content = content.replace('\\n', '\n')
            
            # Write back
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✓ Fixed {file_path}")
            return True
        else:
            print(f"✓ {file_path} already has correct newlines")
            return False
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 fix_newlines.py <file_path>")
        print("   or: python3 fix_newlines.py <file_path1> <file_path2> ...")
        sys.exit(1)
    
    files = sys.argv[1:]
    fixed_count = 0
    
    for file_path in files:
        if fix_newlines(file_path):
            fixed_count += 1
    
    if fixed_count > 0:
        print(f"\n✓ Fixed {fixed_count} file(s)")
    else:
        print("\n✓ No files needed fixing")

