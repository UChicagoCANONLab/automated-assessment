#Zack Crenshaw
#Runs static analysis

import sys
from subprocess import call
from Naked.toolshed.shell import execute_js, muterun_js
import csv

# Order of operations:
# Scrape Web

# Get the grading script

# Create grade for this studio

# TODO: Enforce labeling for first set of data in grade

# TODO: Able to batch input

#COMMAND LINE: python3 run.py (studio URL) (module folder) [--verbose]
#if do not need to call from the web again (local files saved), put just the studio number

def main():
    #Get studio URL
    studioURL = sys.argv[1]

    studioScrape = studioURL.strip('1234567890 ') #Check for a bare number

    studioID = studioURL.strip('htps:/cra.mieduo') #Takes off "https://scratch.mit.edu/studios/"


    #Get folder for a module
    module = sys.argv[2]
    if module[-1] == '/':
        module = module[:-1]

    # Get data from web
    if studioScrape != "":
        print("Scraping data from web...")
        call(["python3", "webScrape.py",studioURL,module])
        print("Scraped.\n")
    else:
        print("No request to scrape...moving on to grading.\n")

    #Prepare inputs for grading script
    modname = module.strip("./")
    script = module+"/"+modname+".js"
    project = module+"/user_json_files/"+studioID
    results = module+"/output.txt"

    # Check for verbose tag
    verbose = ""
    if len(sys.argv) > 3 and sys.argv[3] == "--verbose":
        verbose = " --verbose"
        print("Verbose grading active.")

    # Run grading script on studio
    print("Running grading script...")
    result = execute_js('grade.js', script + " " + project + " " + results + verbose)
    print("Finished grading.\n")


    # Get CSV data from text file
    print("Loading grades data...")
    with open(results,'r') as grades:
        data = []
        line = []
        firstID = grades.readline().strip('\n') #first id is special
        line.append(firstID)
        headers = []
        headers.append("ID")
        headers.append("Error grading project")


        data.append([])
        seek = True
        next = grades.readline().strip('\n')


        # Get user data
        while (next != ''): #read until EOF
            line = []
            next = grades.readline().strip('\n')
            while (next != "|"):
                if next == '': #check for EOF
                    break
                if "Requirements:" not in next and "Extensions:" not in next:
                    stripped = next.split(',')
                    if len(line) == 1 and len(stripped) > 1: #if no error grading project
                        line.append(0)
                    try: #if not error grading project, attempt to add the field
                        line.append(stripped[1])
                        if seek:
                            headers.append(stripped[0])
                    except:
                        # if not enough places, it is either an ID or an error message
                        #if error message, record it and zero out other values
                        if "Error" in stripped[0]:
                            line.append(1)
                            for i in range(2,len(headers)):
                                line.append(0)
                        #if not, log ID
                        else:
                            line.append(stripped[0])
                next = grades.readline().strip('\n')
            if len(headers) > 2:
                seek = False
            data.append(line)

        data[0] = headers

    print("Loaded.\n")

    # Adds grades to CSV
    print("Pushing data to CSV...")
    with open(module+"/csv/"+studioID+'.csv', 'w') as csvfile:
        filewriter = csv.writer(csvfile, delimiter=',',
                                quotechar='|', quoting=csv.QUOTE_MINIMAL)

        for i in range(len(data)):
            filewriter.writerow(data[i])

    print("Pushed.\n")







if __name__ == '__main__':
        main()
