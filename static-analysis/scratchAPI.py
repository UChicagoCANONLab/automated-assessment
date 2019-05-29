#Jean Salac
#Functions to interact with the scratch API

#Method to convert Scratch URL to URL needed to fetch json project
def scratch_to_API(scratch_URL):
	api_prefix = "http://projects.scratch.mit.edu/"
	api_suffix = "/get/"
	project_id = "" 
	for char in scratch_URL:
		if char.isdigit():
			project_id = project_id+char
	api_URL = api_prefix + project_id + api_suffix
	return api_URL

#Method to create project API URL given the project ID
def create_API_URL(project_id):
	api_prefix = "http://projects.scratch.mit.edu/"
	api_suffix = "/get/"
	api_URL = api_prefix + project_id + api_suffix
	return api_URL

#Method to convert Studio URL to URL needed to get Scratch IDs
def studio_to_API(studio_URL, pageNum):
	api_prefix = "https://scratch.mit.edu/site-api/projects/in/"
	api_suffix = "/"+str(pageNum)+"/"
	studio_id = "" 
	for char in studio_URL:
		if char.isdigit():
			studio_id = studio_id+char
	api_URL = api_prefix + studio_id + api_suffix
	return api_URL


#Method to retrieve project ID from Scratch project URL
def get_proj_id(scratch_URL):
	project_id = ""
	for char in scratch_URL:
		if char.isdigit():
			project_id = project_id+char
	return project_id
