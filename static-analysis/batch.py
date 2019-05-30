# Zack Crenshaw

# Will run a batch of calls to run.py
# python3 batch.py (text file with commands)

# Structure of line of command file: (studio URL/ID) (grading script) (grade level)

import sys
from subprocess import call

def main():

    file = sys.argv[1]

    # iterate through folder
    with open(file,'r') as commands:
        next = commands.readline().strip('\n').split(' ')
        while (len(next) > 1): # check for EOF
            # run the command
            call(['python3','run.py',next[0],next[1],next[2]])
            next = commands.readline().strip('\n').split(' ')




if __name__ == '__main__':
    main()