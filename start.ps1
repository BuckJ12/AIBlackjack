# start.ps1

# Start the Python backend
Start-Process  -FilePath "powershell" -ArgumentList "-Command", "cd api; .\environment\install.ps1"

# Start the React server
Start-Process  -FilePath "powershell" -ArgumentList "-Command", "cd client; npm run dev"