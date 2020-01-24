import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split


# Read given training file
train_file_path = 'TESLA_OLD.csv'
given_train_data = pd.read_csv(train_file_path)
#print(given_train_data.head())



df_train = given_train_data[['Close']]
#print(df_train.head())





# How many days ahead do we predict
days = 7

#Create target prediction column shifted n units up for training
df_train['Prediction'] = df_train['Close'].shift(-days)


#Create independent dataset X_train
#Convert dataframe to Numpy array

X_train = np.array(df_train .drop(['Prediction'],1))

#Remove the last 'days' rows
X = X_train[:-days]
#print(X_train)

y = np.array(df_train['Prediction'])

y = y[:-days]
print(y)

x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2)


svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)
svr_rbf.fit(x_train, y_train)

svm_confidence = svr_rbf.score(x_test, y_test)
print("svm confidence: ", svm_confidence)

# Create and train the Linear Regression  Model
lr = LinearRegression()
# Train the model
lr.fit(x_train, y_train)
lr_confidence = lr.score(x_test, y_test)
print("lr confidence: ", lr_confidence)














