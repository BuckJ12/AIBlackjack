from flask import Flask, jsonify, request
from flask_cors import CORS
import pred_methods
import pickle

app = Flask(__name__)
CORS(app)

# Load the model and scaler once when the app starts
with open('models/RandomForestModel.pkl', 'rb') as rf_model_file:
    rf_model = pickle.load(rf_model_file)

with open('models/RFScaler.pkl', 'rb') as rf_scaler_file:
    rf_scaler = pickle.load(rf_scaler_file)


@app.route('/api/predict', methods=['POST'])
def predict():
    if not request.json:
        return jsonify({'error': 'No data provided'}), 400

    data = request.get_json()
    cards_remaining = data.get('cards_remaining', 0)
    dealer_up = data.get('dealer_up', 0)
    true_count = data.get('true_count', 0)
    initial_sum = data.get('initial_sum', 0)
    # Assuming double is a boolean, adjust if needed
    double = data.get('double', False)

    try:
        prediction_result = pred_methods.rfPrediction(
            cards_remaining, dealer_up, true_count, initial_sum, double, rf_model, rf_scaler
        )
        return jsonify({'prediction': prediction_result, 'message': initial_sum})
    except Exception as e:
        return jsonify({'error': 'Failed to make a prediction', 'message': str(e)}), 500


@app.route('/api/test', methods=['GET'])
def get_data():
    return jsonify({'message': 'AI Connected'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
