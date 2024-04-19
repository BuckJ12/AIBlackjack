#!/bin/bash
# Stop on error
set -e

# Run model creation script
echo "Creating model..."
python rf_model.py

# Run the main application
echo "Starting the app..."
python app.py
