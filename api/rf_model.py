import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

bj = pd.read_csv('bj_dataset.csv')

X = bj.drop(labels=['move', 'win'], axis=1)
y = bj['move']

scaler = StandardScaler()
X = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=101)

RFModel = RandomForestClassifier(100, random_state=101)
RFModel.fit(X_train, y_train)
RFpred = RFModel.predict(X_test)