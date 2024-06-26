import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from pred_methods import lrPrediction, standardize_inputs, standardize_input


bj = pd.read_csv('bj_dataset.csv')

X = bj.drop(labels=['move', 'win'], axis=1)
y = bj['move']

scaler = StandardScaler()
X = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=101)

LRModel = LogisticRegression(C=0.01, penalty='l1', solver='saga', class_weight=None)
LRModel.fit(X_train, y_train)

