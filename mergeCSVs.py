#Zack Crenshaw

#will merge CSVs in a given folder into a single CSV

#python3 mergeCSVs.py (folder) (output)

import os
import sys
import csv


def merge(input, output):
    header = False #Check for header
    with open(input,'r') as input:
        with open(output,'a') as output:
            filewriter = csv.writer(output, delimiter=',',
                                    quotechar='|', quoting=csv.QUOTE_MINIMAL)

            # loop through input then write to output
            inline = input.readline().strip('\n').split(',')
            outline = ''
            needHeader = True
            while (len(inline) > 1):
                # If merging into empty document, copy the header
                if needHeader:
                    try:
                        outline = output.readline().strip('\n').split(',')
                    except:
                        pass
                    if len(outline) < 2:
                        filewriter.writerow(inline)
                    needHeader = False
                # if not, just append the data
                else:
                    filewriter.writerow(inline)
                inline = input.readline().strip('\n').split(',')


def main():

    folder = sys.argv[1]
    folder += '' if folder[-1] == '/' else '/'

    output = sys.argv[2]


    for filename in os.listdir(folder):
        if filename.endswith(".csv"):
            path = folder+filename
            merge(path,output)
        else:
            continue



if __name__ == '__main__':
    main()