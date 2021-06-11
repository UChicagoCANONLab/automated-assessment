from xqueue_watcher.grader import Grader
import time
from path import Path
import subprocess
import os
import html
import traceback

def format_errors(errors):
    esc = html.escape
    error_string = ''
    error_list = [esc(e) for e in errors or []]
    if error_list:
        items = '\n'.join(['<li><pre>{0}</pre></li>\n'.format(e) for e in error_list])
        error_string = '<ul>\n{0}</ul>\n'.format(items)
        error_string = '<div>{0}</div>'.format(error_string)
    return error_string

def demote(user_uid, user_gid):
    def result():
        os.setgid(user_gid)
        os.setuid(user_uid)
    return result

def check_file(response):
  errors = []
  for i, line in enumerate(response.split("\n"), 1):
    error = None
    if line.find("import os") >= 0:
      error = f"line {i}: You are no allowed to use the os package"
    if line.find("import sys") >= 0:
      error = f"line {i}: You are no allowed to use the sys package"
    if line.find("import shutil") >= 0:
      error = f"line {i}: You are no allowed to use the shutil package"
    if line.find("import pickle") >= 0:
      error = f"line {i}: You are no allowed to use the pickle package"
    if line.find("import multiprocessing") >= 0:
      error = f"line {i}: You are no allowed to use the multiprocessing package"
    if line.find("import subprocess") >= 0:
      error = f"line {i}: You are no allowed to use the subprocess package"
    if line.find("import requests") >= 0:
      error = f"line {i}: You are no allowed to use the requests package"
    if line.find("import socket") >= 0:
      error = f"line {i}: You are no allowed to use the socket package"
    if line.find("exec(") >= 0:
      error = f"line {i}: You are no allowed to use the exec function"
    if line.find("open(") >= 0:
      error = f"line {i}: You are no allowed to use the open function"
    if line.find("read(") >= 0:
      error = f"line {i}: You are no allowed to use the read function"
    if line.find("write(") >= 0:
      error = f"line {i}: You are no allowed to use the write function"
    if error is not None:
      errors.append(error)

  if len(errors) == 0:
    errors = None
  return errors

class ScratchGrader(Grader):

  results_template = """
<div class="test">
<header>Run results</header>
  <section>
    <div class="shortform">
    {status}
    </div>
    <div class="longform">
      {errors}
      {results}
    </div>
  </section>
</div>"""

  def _grade(self, grader_path, grader_config, student_response):
    grader_file = Path(grader_path).dirname() / "grade.py"
    problem = grader_config['grader']
    current_file = "/tmp/" + str(int(time.time())) + ".py"
    index = 0
    while os.path.exists(current_file):
      no_ending = current_file.split(".")
      current_file = no_ending + "-" + str(index) + ".py"
      index += 1
    results = {"correct": False,
                "score": 0,
                "tests": [("Blank Space", "1")],
                "errors": []}
    errors = check_file(student_response)
    if errors is not None:
      results["errors"] += errors
      return results
    file_obj = open(current_file, "w+")
    file_obj.write(student_response)
    file_obj.close()
    exec_args = ["/home/litteken/qcfa-grader/bin/python", str(grader_file), problem, current_file]
    # 1001 is the groupid and userid for the sandbox account
    proc = subprocess.Popen(exec_args, preexec_fn=demote(1001, 1001), stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    try:
      return_code = proc.wait(timeout=10)
    except subprocess.TimeoutExpired as e:
      results["errors"].append("Unable to complete task in 10 seconds.")
      os.remove(current_file)
      return results
    os.remove(current_file)
    in_error = False
    in_test = False
    for line in proc.stderr:
      if line.startswith("error:"):
        results["errors"].append(line)
      elif line == "---begin error---\n":
        in_error = True
        results["errors"].append("")
        continue
      elif line == "---end error---\n":
        in_error = False
        continue
      elif line == "---begin test results---\n":
        in_test = True
        continue
      elif line == "---end test results---\n":
        in_test = False
        continue

      if in_error:
        results["errors"][-1] += line
      elif in_test:
        line_split = line.strip("\n").split(":")
        test = line_split[0]
        score = line_split[1]
        if test == "all":
          score_split = score.split("/")
          recieved = int(score_split[0])
          possible = int(score_split[1])
          assert recieved <= possible, "Score given is greater than possible score."
          results["correct"] = recieved == possible
          results["score"] = recieved / possible
          continue
        results["tests"].append((test, score))
    if proc.returncode != 0 and len(results["errors"]) == 0:
      raise Exception("Error in grade.py")
    return results

  def grade(self, grader_path, grader_config, student_response):
    try:
      return self._grade(grader_path, grader_config, student_response)
    except Exception as e:
      with open('/home/litteken/grader-log.txt', 'a') as f:
        f.write(">>>>> Error Begin\n")
        f.write("Time: {}\n".format(time.ctime()))
        f.write("----Traceback----\n")
        f.write(str(e))
        f.write(traceback.format_exc())
        f.write("----grader_config----\n")
        f.write(str(grader_config) + "\n")
        f.write("----student_response----\n")
        f.write(student_response + "\n")
        f.write(">>>>> Error End\n")
      return {"correct": False,
              "score": 0,
              "tests": [("Blank Space", "1")],
              "errors": ["Please contact the course administrators to fix the problem, along with the time of this error: " + time.ctime()]}


  def render_results(self, results):
    if len(results['errors']) > 0:
      errors = format_errors(results['errors'])
    else:
      errors = format_errors(["There were no errors running the code."])

    status = 'Ran without errors'
    if len(results['errors']) > 0:
        status = 'ERROR running submitted code'

    return self.results_template.format(status=status,
                                        errors=errors,
                                        results='')
