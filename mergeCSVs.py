#Zack Crenshaw

#will merge CSVs in a given folder into a single CSV

#python3 mergeCSVs.py (folder) (output)

import os
import sys
import csv
import io


def merge(infile, outfile):
    needHeader = False # to check if file needs a header (is empty or non-existent)
    with open(infile,'r') as input:
        try: #check for file exist
            with open(outfile, 'r') as check:
                #check for file empty
                needHeader = len(check.readline().strip('\n').split(',')) < 2
        except:
            #if does not exist, mark as needing header
            needHeader = True

        with open(outfile,'a+') as output:
            filewriter = csv.writer(output, delimiter=',',
                                    quotechar='|', quoting=csv.QUOTE_MINIMAL)

            inline = input.readline().strip('\n').split(',')

            # if new or empty document create and/or add header
            if needHeader:
                filewriter.writerow(inline)

            inline = input.readline().strip('\n').split(',')

            # iterate through input, append to output
            while (len(inline) > 1): #check for EOF
                filewriter.writerow(inline)
                inline = input.readline().strip('\n').split(',')


def main():

    folder = sys.argv[1]
    folder += '' if folder[-1] == '/' else '/'

    output = sys.argv[2]


    for filename in os.listdir(folder):
        if filename.endswith(".csv"):
            path = folder+filename
            print(path)
            merge(path,output)
        else:
            continue



if __name__ == '__main__':
    main()