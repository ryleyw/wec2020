from flask import Flask, request
from flask_cors import CORS
import csv
import json
import datetime

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/getuserjson": {"origins": "http://localhost:3000"}})

# @app.route('/user/<username>')
# def gethistory(username):
#     if username.lower() == "karen":
#         json_data = csv_to_json(f"db/karen/{request.args.get('db')}.csv")
#         print(json.dumps(json_data, indent=4))
#         return json.dumps(json_data)
#
#     return "404: User not found!"


@app.route('/getuserjson', methods=["GET", "POST"])
def getuserjson():
    user = request.json['user']
    if user.lower() == "karen":
        chequing_data = read_json("db/karen/CHEQUING.json")
        savings_data = read_json("db/karen/SAVINGS.json")

        chequing_total = get_balance(chequing_data)
        savings_total = get_balance(savings_data)

        totalJSON = {
            "username": user,
            "chequing": {
                "curr_total": chequing_total,
                "history": chequing_data
            },
            "savings": {
                "curr_total": savings_total,
                "history": savings_data
            }
        }

        #print(json.dumps(savings_data, indent=4))
        return json.dumps(totalJSON)

    return "404: User not found!"


@app.route('/newtransaction', methods=['POST'])
def new_transaction():

    user = request.json['user']
    account = request.json['account']

    new_transaction = {
        #TODO is date present or generated?
        "Date": request.json['Date'],
        "Type": request.json['Type'],
        "Amount": request.json['Amount'],
        "Title": request.json['Title'],
    }
    json_data = {
        "user": user,
        "transaction": new_transaction
    }

    # Sanitize!

    try:
        if float(new_transaction["Amount"]) < 0:
            return "Amount must be non-negative"
    except ValueError:
        return "Amount is not a number"


    if account != "SAVINGS" and account != "CHEQUING":
        return "Account doesn't exist"

    try:
        filename = f"db/{user}/{account}.json"
        transaction_history = read_json(filename)
    except FileNotFoundError:
        return "Database Error: User doesn't exist"

    if (new_transaction["Type"] == "D" or new_transaction["Type"] == "Withdrawl") and float(new_transaction["Amount"]) >= get_balance(transaction_history):
        return "You don't have enough money to withdraw"


    # if user.lower() == "bobby":


    if user.lower() == "karen":
        transaction_history.append(new_transaction)

    write_json(transaction_history, filename)

    return str(read_json(filename))


@app.route('/')
def index_page():
    return '<a href="/user/karen?db=CHEQUING"> Karen\'s JSON</a>'



def csv_to_json(filename):
    csv_file = open(filename, "r")
    json_file = open(filename.split(".")[0]+".json", "w")

    fields = ("Date", "Type", "Amount", "Title")
    csv_data = csv.DictReader(csv_file, fields)
    next(csv_data)

    json_list = []

    for transaction in csv_data:
        json_list.append(transaction)

    json.dump(json_list, json_file)
    #return json_list


def read_json(filename):
    with open(filename, "r") as f:
        data = json.load(f)
        #print(data)
        return data


def write_json(dict, filename):
    with open(filename, "w") as f:
        json.dump(dict, f)


def get_balance(dict):
    total = 0
    for transaction in dict:
        if transaction["Type"] == "C" or transaction["Type"] == "Deposit":
            total += float(transaction["Amount"])
        elif transaction["Type"] == "D" or transaction["Type"] == "Withdrawl":
            total -= float(transaction["Amount"])

    return total


def main():

    csv_to_json(f"db/karen/SAVINGS.csv")
    csv_to_json(f"db/karen/CHEQUING.csv")

    app.run(host="0.0.0.0")


if __name__ == '__main__':
    main()
