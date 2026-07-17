#!/usr/bin/env python
import os
import sys

def main():
    # Add parent directory to sys.path so Backend is importable as a module
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
