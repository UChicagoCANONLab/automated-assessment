#Zack Crenshaw
#Runs static analysis

import sys
from subprocess import call
from Naked.toolshed.shell import execute_js, muterun_js
import csv
import os

# Order of operations:
# Scrape Web

# Get the grading script

# Create grade for this studio

#Save grade to CSV

#COMMAND LINE: python3 run.py (studio URL) (module folder) (grade level) [--verbose]
#if do not need to call from the web again (local files saved), put just the studio number

def main():
    #Get studio URL
    studioURL = sys.argv[1]

    studioScrape = studioURL.strip('1234567890 ') #Check for a bare number

    studioID = studioURL.strip('htps:/cra.mieduo') #Takes off "https://scratch.mit.edu/studios/"

    teacherID = sys.argv[2]

    #Get folder for a module
    module = sys.argv[3].strip()
    if module[-1] == '/':
        module = module[:-1]
    #Get grade level
    grade = int(sys.argv[4])

    # Get data from web
    if studioScrape != "":
        print("Scraping " + studioID+ " data from web...")
        call(["python3", "webScrape.py",studioURL,module])
        print("Scraped.\n")
    else:
        print("No request to scrape...moving on to grading " + studioID + ".\n")

    # Prepare inputs for grading script

    modname = module.strip("./ ")

    # looks for script in higher directory
    script = "../grading-scripts-s3/"+modname+".js"
    project = module + "/json_files_by_studio/" + studioID+"/"
    folder = module + "/csv/" +str(grade)+'/'
    results = folder + teacherID + '-' + studioID + ".csv"

    # Check for verbose tag
    verbose = ""
    if len(sys.argv) > 4 and "verbose" in sys.argv[4]:
        verbose = " --verbose"
        print("Verbose grading active.")

    # Run grading script on studio
    print("Running grading script...")
    execute_js('grade.js', script + " " + project + " " + results + verbose)
    print("Finished grading.\n")


if __name__ == '__main__':
        main()
