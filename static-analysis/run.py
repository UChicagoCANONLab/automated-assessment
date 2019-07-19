# Zack Crenshaw
# Code simplified by Marco Anaya, Summer 2019
# A combination of what was batch.py and run.py

# Structure of line of command file: (studio URL/ID),(grading script),(grade level), [--verbose]

import sys
import os
import csv
from subprocess import call
from Naked.toolshed.shell import execute_js

def grade_and_save(studioURL, teacherID, module, grade, verbose=""):

    studioScrape = studioURL.strip('1234567890 ')  # Check for a bare number

    studioID = studioURL.strip('htps:/cra.mieduo')  # Takes off "https://scratch.mit.edu/studios/"

    # Get folder for a module
    module = module.strip()
    if module[-1] == '/':
        module = module[:-1]
    # Get grade level
    grade = int(grade)

    project = module + "/json_files_by_studio/" + studioID+"/"

    project = module + "/json_files_by_studio/" + studioID+"/"
    print(project)
    # Get data from web
    if not os.path.isdir(project):
        print("Studio " + studioID + " not found locally, scraping data from web...")
        call(["python3", "webScrape.py", studioURL, module])
        print("Scraped.\n")
    else:
        print("Studio " + studioID + " found locally.")

    # Prepare inputs for grading script

    modname = module.strip("./ ")

    # looks for script in higher directory
    script = "../grading-scripts-s3/"+modname+".js"
    folder = module + "/csv/" + str(grade)+'/'
    results = folder + teacherID + '-' + studioID + ".csv"

    # Check for verbose tag

    if "verbose" in verbose:
        verbose = " --verbose"
        print("Verbose grading active.")

    # Run grading script on studio
    print("Running grading script...")
    execute_js('grade.js', script + " " + project + " " + results + verbose)
    print("Finished grading.\n")


def main():

    file = sys.argv[1].strip()

    print("Start of grading: \n")
    grades = []

    # iterate through folder
    with open(file, 'r') as f:
        reader = csv.reader(f)
        csv_to_list = list(reader)
        for row in csv_to_list:
        
            if row[3] not in grades:
                grades.append(row[3])
            # run the command
            if len(row) > 4:  # if there is a verbose flag
                grade_and_save(row[0], row[1], row[2], row[3], row[4])
            else:  # if no verbose flag
                grade_and_save(row[0], row[1], row[2], row[3])
            
    print("Grading completed.")
    module = file.split('/')[1] + '/'

    # for grade in grades:
    #     call(['python3','mergeCSVs.py', './' + module + 'csv/' + grade + '/', './' + module + 'csv/aggregated/' + grade + '.csv'])
    #     call(['python3', 'countCSV.py', './' + module + 'csv/aggregated/' + grade + '.csv', './' + module + 'csv/aggregated/counted/' + grade + '-counted.csv'])

    # call(['python3', 'mergeCSVs.py', './' + module + 'csv/aggregated/counted', './' + module + 'csv/aggregated/aggregated.csv'])

    # call(['python3', 'addLetterHeading.py', './' + module + 'csv/aggregated/aggregated.csv', 'copy', '4'])
    print("\nStart of graphing:")
    call(['python3', 'plotGrades.py', './' + module])
    print("Finished graphing.")


if __name__ == '__main__':
    main()