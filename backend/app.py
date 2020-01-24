from flask import Flask, request
import csv
import json

app = Flask(__name__)

# @app.route('/user/<username>')
# def gethistory(username):
#     if username.lower() == "karen":
#         json_data = csv_to_json(f"db/LEVEL_1/{request.args.get('db')}.csv")
#         print(json.dumps(json_data, indent=4))
#         return json.dumps(json_data)
#
#     return "404: User not found!"


@app.route('/getuserjson', methods=["POST"])
def getuserjson():
    user = request.json['user']
    if user.lower() == "karen":
        chequing_data = csv_to_json(f"db/LEVEL_1/CHEQUING.csv")
        savings_data = csv_to_json(f"db/LEVEL_1/SAVINGS.csv")

        chequing_total = get_dict_total(chequing_data)
        savings_total = get_dict_total(savings_data)

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


@app.route('/')
def index_page():
    return '<a href="/user/karen?db=CHEQUING"> Karen\'s JSON</a>'

def csv_to_json(filename):
    csv_file = open(filename, "r")
    #json_file = open(filename.split(".")[0]+".json", "w")

    fields = ("Date", "Type", "Amount", "Title")
    csv_data = csv.DictReader(csv_file, fields)
    next(csv_data)

    json_str = []

    for transaction in csv_data:
        json_str.append(transaction)

    return json_str


def get_dict_total(dict):
    total = 0
    for transaction in dict:
        if transaction["Type"] == "Deposit":
            total += float(transaction["Amount"])
        elif transaction["Type"] == "Withdrawl":
            total -= float(transaction["Amount"])

    return total



def main():
    savings_dict = csv_to_json("SAVINGS.csv")
    chequing_dict = csv_to_json("CHEQUING.csv")




if __name__ == '__main__':
    app.run()
    #main()
