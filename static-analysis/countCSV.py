#Zack Crenshaw

#Will count each field for a given CSV
#Will replace the first field with the name of the input file

#python3 countCSV.py (input) (output)

import sys
import csv


def main():

    input = sys.argv[1]
    output = sys.argv[2]

    #Get grade level (should be name of csv file)
    grade = output.split('/')[-1][:-4]

    with open(input,'r') as input:
        with open(output,'w') as output:
            filewriter = csv.writer(output, delimiter=',',
                                    quotechar='|', quoting=csv.QUOTE_MINIMAL)
            # Get header data
            header = input.readline().strip('\n').split(',')
            header[0] = "Grade level"
            filewriter.writerow(header)

            # Create array to count
            length = len(header)
            count = [0] * length
            count[0] = grade

            # Iterate through CSV
            next = input.readline().strip('\n').split(',')
            while (next != ['']):
                for i in range (1,length):
                    count[i] += int(next[i])
                next = input.readline().strip('\n').split(',')
            filewriter.writerow(count)


if __name__ == '__main__':
    main()