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
    
countCSV.py: python3 countCSV.py (input CSV) [output CSV]
    Counts each field of the input CSV, and saves the count to a single-line output CSV
    If no explicit output, will output to file with same name with "-counted" appended
    Currently designed to aggregate the first field into "grade level"
    Sets second field to the total count
    Subsequent fields are from the original CSV

Metadata files in the module folders are designed to be run by batch.py
These files thus have the structure: studioURL,module,grade level

Data for each module is contained in the folder with that module's name.
Json files output by run.py will be organized by studio in "json_files_by_studio"
Text files containing the grades from these json files are in grades.txt, named for the studio ID
CSV files created by run.py will be named STUDIOID.csv, and placed in the folder with the grade indicated when run.py is called
The csv files in aggregated with grade levels are all the csv files for a given grade level appended to each other
Each of the CSVs in counted is this grade-wide data with some counting of the data, condensed to single line
aggregated.csv (or variants thereof) is all the counted csvs (or some subset) appended together. It is from this csv that the graphs (pdfs in the top level of a module) are based.



    

    



    