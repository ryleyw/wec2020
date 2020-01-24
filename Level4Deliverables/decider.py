import csv

outF = open('Decider.csv', 'w')
outF.write('Date,Today Price,After 2 days,After 7 days,Yesterday value,2 days ago,30 days ago\n')

with open ('Predicted.csv','r') as csv_file:
    reader =csv.reader(csv_file)
    #outF.write(reader)
    next(reader) # skip first row
    for i in range(30):
        next(reader)
    for row in reader:
        today = float(row[1])
        after2 = float(row[2])
        after7 = float(row[3])
        yesterday = float(row[4])
        before2 = float(row[5])
        before30= float(row[6])


        if((yesterday - today)/yesterday >= 0.015 and (after7 - today)/today >=0.0075):
            decision = 'SELL'
        elif((today-before2)/today >=0.02 and (today-after2)/today <=0):
            decision = 'SELL'
        elif((today-before30)/today >= 0.015):
            decision = 'BUY'
        else:
            decision = 'HOLD'

        row.append(decision)
        outF.write(str(row)+'\n')
