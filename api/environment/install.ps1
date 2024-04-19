# install.ps1

# Check if virtual environment exists
if (-not (Test-Path env)) {
    # Create virtual environment
    python -m venv env
}

# Activate virtual environment
. .\env\Scripts\Activate

# Install requirements
pip install -r ./environment/requirements.txt

# Run app.py
python app.py