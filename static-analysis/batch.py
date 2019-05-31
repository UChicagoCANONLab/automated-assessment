# Zack Crenshaw

# Will run a batch of calls to run.py
# python3 batch.py (text file with commands)

# Structure of line of command file: (studio URL/ID),(grading script),(grade level)

import sys
from subprocess import call

def main():

    file = sys.argv[1].strip()

    print("Start batch of commands: \n")

    # iterate through folder
    with open(file,'r') as commands:
        next = commands.readline().strip().split(',')
        for i in range (len(next)):
            next[i] = next[i].strip()
        while (len(next) > 1): # check for EOF
            # run the command
            call(['python3','run.py',next[0],next[1],next[2]])
            next = commands.readline().strip().split(',')

    print("Finished batch.")


if __name__ == '__main__':
    main()