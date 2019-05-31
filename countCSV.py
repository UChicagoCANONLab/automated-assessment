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
            nativeHeader = input.readline().strip('\n').split(',')
            length = len(nativeHeader)
            header = [0] * (length + 1)
            header[0] = "Grade level"
            header[1] = "Count"
            for i in range(1, length):
                header[i+1] = nativeHeader[i]

            filewriter.writerow(header)

            # Create array to count
            count = [0] * (length + 1)
            count[0] = grade

            # Iterate through CSV
            next = input.readline().strip('\n').split(',')
            while (next != ['']):
                count[1]+=1
                for i in range (2,length):
                    count[i+1] += int(next[i])
                next = input.readline().strip('\n').split(',')
            filewriter.writerow(count)


if __name__ == '__main__':
    main()