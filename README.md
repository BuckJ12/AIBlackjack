# AI Blackjack
## Node.js/React Install
Installation process
first download node.js  https://nodejs.org/en/download
then go into the client file
`cd client`
install all npm packages
`npm i`

## Python install
go into the api folder and run 
`python -m venv env`
This will create a python environment for the project
Install all requirements for the python environment 
```
pip install numpy
pip install -r ./environment/requirements.txt
```
Create Model
`python rf_model.py`

# Run the site
go into client folder
`cd client`
Run node.js frontend
`npm run dev`

open second terminal
then go into api folder
`cd api`
Run python-Flask backend
`python app.py`

Access the game by opening a webbrowser to http://localhost:5173/
