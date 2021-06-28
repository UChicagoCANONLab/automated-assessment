from xqueue_watcher.grader import Grader
import subprocess
import html
import json
import time

def format_errors(errors):
    esc = html.escape
    error_string = ''
    error_list = [esc(e) for e in errors or []]
    if error_list:
        items = '\n'.join(['<li><pre>{0}</pre></li>\n'.format(e) for e in error_list])
        error_string = '<ul>\n{0}</ul>\n'.format(items)
        error_string = '<div>{0}</div>'.format(error_string)
    return error_string

class ScratchGrader(Grader):
    error_template = """<div><p>{error}</p></div>"""
    results_template = """<div>{report_contents}</div>"""

    def grade(self, grader_path, grader_config, student_response):
        problem = grader_config['module']
        student_id = student_response.strip('/').split('/')[-1]
        print("problem", problem)
        results = {"correct": False,
                    "score": 0,
                    "msg": ''}
        exec_args = ["node", "/home/scratch_encore/automated_assessment/edx/autograder/xqueue_grader.js", problem, student_id ]
        # 1001 is the groupid and userid for the sandbox account
        proc = subprocess.Popen(exec_args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        (output, err) = proc.communicate()
        print("process error: ", err)
        visible = "false"
        error = ""
        score = 0
        in_report = False
        in_grade_script = False
        report_list = []
        print("Output: ", output, "\nEnd Output")
        for line in output.split("\n"):
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
            results['msg'] = self.error_template.format(error=error)
        else:
            results['msg'] = self.results_template.format(report_contents=report_div)

        print("Results:\n", results)
        return results

    def render_results(self, results):
        return results
