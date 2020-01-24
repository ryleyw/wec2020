from flask import Flask
import csv
import json

app = Flask(__name__)


@app.route('/user/<username>')
def gethistory(username):
    return username

@app.route('/')
def index_page():
    return "Hello!"

def csv_to_json(filename):
    csv_file = open(filename, "r")
    json_file = open(filename.split(".")[0]+".json", "w")

    fields = ("Date", "Type", "Amount", "Title")
    csv_data = csv.DictReader(csv_file, fields)
    next(csv_data)

    json_str = []

    for transaction in csv_data:
        json_str.append(transaction)

    return json_str



def main():
    savings_dict = csv_to_json("SAVINGS.csv")
    chequing_dict = csv_to_json("CHEQUING.csv")




if __name__ == '__main__':
    app.run()
    #main()
