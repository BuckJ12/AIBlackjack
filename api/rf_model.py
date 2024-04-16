import pickle
import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

# Load the data
bj = pd.read_csv('bj_dataset.csv')

# Separate features and target
X = bj.drop(labels=['move', 'win'], axis=1)
y = bj['move']

# Initialize the scaler
scaler = StandardScaler()

# Fit the scaler to the features
X_scaled = scaler.fit_transform(X)

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.25, random_state=101)

# Create a Random Forest Classifier
RFModel = RandomForestClassifier(n_estimators=200, max_features='sqrt',
                                 min_samples_leaf=4, min_samples_split=10, random_state=101)
# Train the model
RFModel.fit(X_train, y_train)

# Define paths for the model and scaler
pickle_path = 'models/RandomForestModel.pkl'
scaler_path = 'models/RFScaler.pkl'

# Create the directory if it does not exist
os.makedirs(os.path.dirname(pickle_path), exist_ok=True)

# Save the Random Forest model
with open(pickle_path, 'wb') as file:
    pickle.dump(RFModel, file)

# Save the scaler
with open(scaler_path, 'wb') as file:
    pickle.dump(scaler, file)
