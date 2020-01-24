import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


# Read given training file
train_file_path = 'MACY_OLD.csv'
given_train_data = pd.read_csv(train_file_path)
#print(given_train_data.head())

# Read given test file
test_file_path = 'MACY_NEW.csv'
given_test_data = pd.read_csv(test_file_path)

df_train = given_train_data[['Close']]
# print('Training data head is:')
# print(df_train.tail())

df_test = given_test_data[['Close']]

# How many days ahead do we predict
days = 2

#Create target prediction column shifted n units up for training
df_train['Prediction'] = df_train['Close'].shift(-days)

X_train = np.array(df_train.drop(['Prediction'],1))

#Remove the last 'days' rows
X_train = X_train[:-days]

#Create independent dataset y_train
y_train= np.array(df_train['Prediction'])

#Get rid of last 'days' rows from y
y_train=y_train[:-days]

#Final training data
x_train = X_train
y_train = y_train


# Create and train the Linear Regression  Model
lr = LinearRegression()
# Train the model
lr.fit(x_train, y_train)

X_to_predict = np.array(df_test)
Y_predicted = lr.predict(X_to_predict)[days:]

X_to_predict = np.squeeze(X_to_predict[:-days])


# print(X_to_predict)
# print(Y_predicted)



#Make DataFrame after 2 days

df_dates = given_test_data[['Date']]
dates = np.array(df_dates)
dates = np.squeeze(dates)[:-days]

final_df = pd.DataFrame({'Date': dates, 'Today Price': X_to_predict, 'After 2 days': Y_predicted})
#print(final_df)

#Lets do the same thing for 7 days



given_train_data = pd.read_csv(train_file_path)
given_test_data = pd.read_csv(test_file_path)

df_train = given_train_data[['Close']]
df_test = given_test_data[['Close']]

days = 7

df_train['Prediction'] = df_train['Close'].shift(-days)

X_train = np.array(df_train.drop(['Prediction'],1))

#Remove the last 'days' rows
X_train = X_train[:-days]

#Create independent dataset y_train
y_train= np.array(df_train['Prediction'])

#Get rid of last 'days' rows from y
y_train=y_train[:-days]

#Final training data
x_train = X_train
y_train = y_train


# Create and train the Linear Regression  Model
lr = LinearRegression()
# Train the model
lr.fit(x_train, y_train)

X_to_predict = np.array(df_test)
Y_predicted = lr.predict(X_to_predict)[days:]

X_to_predict = np.squeeze(X_to_predict[:-days])

df_dates = given_test_data[['Date']]
dates = np.array(df_dates)
dates = np.squeeze(dates)[:-days]


final_df2 = pd.DataFrame({'Date': dates, 'Today Price': X_to_predict, 'After 7 days': Y_predicted})
print(final_df2)

final_df3 = pd.DataFrame({'Date': dates, 'Today Price': X_to_predict, 'After 2 days': final_df['After 2 days'][:-5], 'After 7 days': Y_predicted})

final_df3['Yesterday value'] = final_df3[['Today Price']].shift(1)
final_df3['2 days ago'] = final_df3[['Today Price']].shift(2)
final_df3['30 days ago'] = final_df3[['Today Price']].shift(30)
print(final_df3)


final_df3.to_csv('Predicted.csv', encoding='utf-8', index=False)

#Now we need the values of stock yesterday, 2 days ago, and 30 days ago











