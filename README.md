#Static Analysis 

Created by Zack Crenshaw, based on code from Max White and Jean Salac (as marked)

run.py: python3 run.py (studio URL) (module folder) [--verbose]
    scrapes the data from the given studio, and grades the projects. 
    
    Input a valid link to scrape from the web
    Input just the studio ID to only grade existing JSON files
    Optional verbose tag outputs the grades to the console.
    
    Uses webScrape.py to scrape web data
        Uses scratchAPI.py to get the JSON
    Uses grade.js to grade the scripts
    
mergeCSV.py: python3 mergeCSV (folder containing CSVs) (name and path of new CSV)
    Merges CSVs with the same headers into new CSV
    

    



    