#Web scraping tool for static analysis
#Zack Crenshaw
#Adapted from code by Jean Salac

#COMMAND LINE: python3 webScrape.py (studio URL) (file path)

import sys
import json
import requests
import scratchAPI as sa
import os
from bs4 import BeautifulSoup

def main():

    # Take in Scratch Studio URL
    studioURL = sys.argv[1]

    studioID = studioURL.strip('https://scratch.mit.edu/studios/')


    # Get module
    module = sys.argv[2]

    # Convert studio URL to the one necessary for scraping Scratch usernames and project IDs.
    # Pull projects until page number does not exist

    # Initialize studio URL and requests
    pageNum = 1
    studio_api_url = sa.studio_to_API(studioURL, pageNum)
    r = requests.get(studio_api_url, allow_redirects=True)

    # While the studio API URL exists, pull all the projects
    while (r.status_code == 200):
        studio_html = r.content
        studio_parser = BeautifulSoup(studio_html, "html.parser")

        for project in studio_parser.find_all('li'):
            # Find the span object with owner attribute
            span_string = str(project.find("span", "owner"))

            # Pull out scratch username
            scratch_username = span_string.split(">")[2]
            scratch_username = scratch_username[0:len(scratch_username) - 3]

            # Get project ID
            proj_id = project.get('data-id')

            # Read json file from URL. Convert Scratch URL to Scratch API URL, then read file.
            apiURL = sa.create_API_URL(proj_id)
            json_stream = requests.get(apiURL, allow_redirects=True)
            user_directory = module + "/json_files_by_studio/" + studioID + "/"
            json_filename = user_directory + scratch_username + ".json"
            if not os.path.exists(user_directory):
                os.makedirs(user_directory)
            open(json_filename, 'wb').write(json_stream.content)
            json_data = open(json_filename, "r")
            data = json.load(json_data)
            json_data.close()



        pageNum += 1
        studio_api_url = sa.studio_to_API(studioURL, pageNum)
        r = requests.get(studio_api_url, allow_redirects=True)


if __name__ == '__main__':
        main()