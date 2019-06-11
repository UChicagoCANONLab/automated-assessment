# Zack Crenshaw

# Adds letter correspondence to CSV

# python3 addLetterHeading.py (input file) (output file) (column to start lettering at)
# output file: "self" for the same file, "copy" for a copy with addition to name

# column is 1-indexed (starts at 1)

import string
import sys
import csv


def main():
    input = sys.argv[1]
    output = sys.argv[2]
    startLettering = int(sys.argv[3])

    data = [[]]
    #initialize row with letters with blank spots for non-lettered attributes
    for i in range (startLettering-1):
        data[0].append("")

    if "self" in output: # will write back to the input file
        output = input
    if "copy" in output: # will copy to file with same name but added ending
        output = input[:-4] + "-letterHeadings.csv"

    # read input file, save in memory
    with open(input,'r') as input:
        reader = csv.reader(input)
        for row in reader:
            data.append(row)

    # write to output
    with open(output,'w') as output:
        writer = csv.writer(output, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)

        # add letter row to the top
        for i in range (len(data[1])-startLettering+1):
            data[0].append(string.ascii_uppercase[i])

        # write to file
        for item in data:
            writer.writerow(item)



if __name__ == '__main__':
    main()
