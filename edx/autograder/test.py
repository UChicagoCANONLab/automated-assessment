from xqueue_watcher.grader import Grader
import subprocess
import html
import json
import time
import sys

error_template = """<div><p>{error}</p></div>"""
results_template = """<div>{report_contents}</div>"""

problem = sys.argv[1]
student_response = sys.argv[2]


problem = "animationL1"
#problem = grader_config['module']
student_id = student_response.strip("/ \n\t").split('/')[-1]
results = {"correct": False,
            "score": 0,
            "msg": ''}
exec_args = ["node", "/Users/zacharycrenshaw/automated-assessment/edx/autograder/xqueue_grader.js", problem, student_id ]
# 1001 is the groupid and userid for the sandbox account
print(exec_args)
proc = subprocess.Popen(exec_args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
(output, err) = proc.communicate()
visible = "false"
error = ""
score = 0
in_report = False
in_grade_script = False
report_list = []

for line in output.split("\n"):
    print(line)
    if line == "start_grade_script":
        in_grade_script = True
    elif line == "end_grade_script":
        in_grade_script = False
    elif in_grade_script:
        # ignore any line in the grade script
        continue
    else:
        if line.startswith("Error"):
            error = line
        elif line == "report_start":
            in_report = True
            error = ""
        elif line == "report_end":
            in_report = False
        elif in_report:
            report_list.append(line)
        elif line.startswith("score:"):
            score = float(line.split(':')[1].strip())
        else:
            continue

if len(report_list) > 0:
    report_div = ""
    for item in report_list:
        report_div += item
        report_div += " <br> "

    report_div += " <br>"
else:
    report_div = ""



results['score'] = score
if len(error) > 0:
    results['msg'] = error_template.format(error=error)
else:
    results['msg'] = results_template.format(report_contents=report_div)



print(results)
