from flask import Flask, request
from flask_cors import CORS
import csv
import json

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

    if user != "karen" and user != "bobby":
        return "ERROR: User not found"

    chequing_data = read_json(f"db/{user}/CHEQUING.json")
    chequing_total = get_balance(chequing_data)

    total_json = {}
    total_json["username"] = user
    total_json["chequing"] = {
            "curr_total": chequing_total,
            "history": chequing_data
        }

    if user != "bobby":
        savings_data = read_json(f"db/{user}/SAVINGS.json")
        savings_total = get_balance(savings_data)
        total_json["savings"] = {
            "curr_total": savings_total,
            "history": savings_data
        }


    #print(json.dumps(savings_data, indent=4))
    return json.dumps(total_json)


@app.route('/newtransaction', methods=['POST'])
def new_transaction():

    user = request.json['user']
    account = request.json['account']

    attempted_transaction = {
        # We'll let the client set the date for testing purposes
        "Date": request.json['Date'],
        "Type": request.json['Type'],
        "Amount": request.json['Amount'],
        "Title": request.json['Title'],
    }
    json_data = {
        "user": user,
        "transaction": attempted_transaction
    }

    # Sanitize!

    try:
        if float(attempted_transaction["Amount"]) < 0:
            return "ERROR: Amount must be non-negative"
    except ValueError:
        return "ERROR: Amount is not a number"

    if account != "SAVINGS" and account != "CHEQUING":
        return "ERROR: Invalid account type"

    try:
        filename = f"db/{user}/{account}.json"
        transaction_history = read_json(filename)
    except FileNotFoundError:
        return "ERROR: User or account doesn't exist"

    if (attempted_transaction["Type"] == "D" or attempted_transaction["Type"] == "Withdrawl") \
            and float(attempted_transaction["Amount"]) >= get_balance(transaction_history):
        return "ERROR: You don't have enough money to withdraw"

    # Hardcode the users, no databases here, folks
    if user.lower() == "karen":
        transaction_history.append(attempted_transaction)

    if user.lower() == "bobby":
        if account == "SAVINGS":
            return f"ERROR: {user} doesn't have a {account} account!"
        attempted_transaction = manage_spending(attempted_transaction, transaction_history)
        if attempted_transaction == False:
            return f"ERROR: {user}'s account is locked"
        transaction_history.append(attempted_transaction)

    write_json(transaction_history, filename)

    return str(read_json(filename))


@app.route('/')
def index_page():
    return '<h1> Welcome to the Backend!</h1>'


def manage_spending(attempted_transaction, transaction_history):
    spent_today = 0
    for transaction in transaction_history:
        if transaction["Date"] == attempted_transaction["Date"]:
            if "Locked" in transaction:
                return False
            spent_today += float(transaction["Amount"])

    if float(attempted_transaction["Amount"]) + spent_today >= 100:
        attempted_transaction["Title"] = f"Locked: tried to spend ${attempted_transaction['Amount']}"
        attempted_transaction["Amount"] = "0"
        attempted_transaction["Locked"] = True

    return attempted_transaction


def transactions_to_json(filename):
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


def investments_to_json(filename):
    csv_file = open(filename, "r")
    json_file = open(filename.split(".")[0]+".json", "w")

    fields = ("Date", "Price Today", "Price Yesterday", "Price in 7 Days", "Price 2 Days Ago",
              "Price in 2 Days", "Price 30 Days Ago")
    csv_data = csv.DictReader(csv_file, fields)
    next(csv_data)

    json_list = []

    for investment in csv_data:
        json_list.append(investment)

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

    transactions_to_json(f"db/karen/SAVINGS.csv")
    transactions_to_json(f"db/karen/CHEQUING.csv")
    transactions_to_json(f"db/bobby/CHEQUING.csv")

    app.run(host="0.0.0.0")



if __name__ == '__main__':
    main()
