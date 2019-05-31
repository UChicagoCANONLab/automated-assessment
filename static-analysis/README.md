#Static Analysis 

Created by Zack Crenshaw, in part based on code from Max White and Jean Salac (as marked)


batch.py: python3 batch.py (text file with commands)
    Will run a batch of calls of 'run.py', given a text or CSV file of arguments
    Each line of text file:
    	StudioURL/Studio ID, module folder, grade level, verbose (optional) 

run.py: python3 run.py (studio URL) (module folder) (grade level) [--verbose]
    scrapes the data from the given studio, and grades the projects, organized by grade level. 
    
    Input a valid link to scrape from the web
    Input just the studio ID to only grade existing JSON files
    Optional verbose tag outputs the grades to the console.
    
    Uses webScrape.py to scrape web data
        Uses scratchAPI.py to get the JSON files
    Uses grade.js to grade the scripts
    
mergeCSVs.py: python3 mergeCSV (folder containing CSVs) (output CSV file)
    Appends data from CSVs into new CSV
    
countCSV.py: python3 countCSV.py (input CSV) (output CSV)
    Counts each field of the input CSV, and saves the count to a single-line output CSV
    Currently designed to aggregate the first field into "grade level"
    Sets second field to the total count
    Subsequent fields are from the original CSV

Metadata files in the module folders are designed to be run by batch.py
These files thus have the structure: studioURL,module,grade level

    

    



    