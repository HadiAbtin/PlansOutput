#!/usr/bin/env python3
"""
Script to convert JSON data or string literals to proper Markdown format.
This handles the case where data comes with literal \n instead of actual newlines.

Usage:
    python3 convert_data_to_markdown.py <input_file> <output_file>
    python3 convert_data_to_markdown.py <input_file>  # outputs to <input_file>.md
"""

import sys
import os
import json
import ast

def convert_string_literal(content):
    """Convert a string literal with \n to actual newlines."""
    try:
        # Try to decode as Python string literal
        if content.startswith('"') and content.endswith('"'):
            # It's a quoted string, try to evaluate it
            try:
                content = ast.literal_eval(content)
            except:
                pass
        elif content.startswith("'") and content.endswith("'"):
            # Single quoted string
            try:
                content = ast.literal_eval(content)
            except:
                pass
        
        # Replace literal \n with actual newlines
        if '\\n' in content:
            content = content.encode().decode('unicode_escape')
        
        return content
    except Exception as e:
        print(f"Warning: Could not convert string literal: {e}")
        # Fallback: simple replace
        return content.replace('\\n', '\n')

def process_json_data(content):
    """Process JSON data and convert to Markdown."""
    try:
        data = json.loads(content)
        # If it's a string field, convert it
        if isinstance(data, str):
            return convert_string_literal(data)
        # Otherwise, return as JSON string (pretty printed)
        return json.dumps(data, indent=2, ensure_ascii=False)
    except json.JSONDecodeError:
        # Not JSON, treat as plain text
        return convert_string_literal(content)

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 convert_data_to_markdown.py <input_file> [output_file]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' not found.")
        sys.exit(1)
    
    # Determine output file
    if len(sys.argv) >= 3:
        output_file = sys.argv[2]
    else:
        # Default: add .md extension or replace extension
        base, ext = os.path.splitext(input_file)
        output_file = base + '.md'
    
    try:
        # Read input
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Process content
        if input_file.endswith('.json'):
            processed = process_json_data(content)
        else:
            processed = convert_string_literal(content)
        
        # Write output
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(processed)
        
        print(f"✓ Converted {input_file} -> {output_file}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

