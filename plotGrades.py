# By Marco Anaya, based on code from Zack Crenshaw


# python3 plotGrades.py (module)

import sys
import random
import os
import math
import string

import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator
from matplotlib.backends.backend_pdf import PdfPages

# supports coloring 12 categories, repeating once until 24
colors = dict(zip(string.ascii_uppercase,
            ['#E58606', '#5D69B1', '#52BCA3', '#99C945', '#CC61B0', '#24796C', 
            '#DAA51B', '#2F8AC4', '#764E9F', '#ED645A', '#CC3A8E', '#A5AA99',
            '#E58606', '#5D69B1', '#52BCA3', '#99C945', '#CC61B0', '#24796C', 
            '#DAA51B', '#2F8AC4', '#764E9F', '#ED645A', '#CC3A8E', '#A5AA99',
            '#E58606', '#5D69B1', '#52BCA3']))

by_tID_data = {}
by_cID_data = []

def plot_grade(module, grade_dir):

    modname = module.split('/')[1]
    grade = grade_dir.split('/')[-2]

    # initializing the post-processed data for each of the 3 graphs
    by_reqs_data = pd.DataFrame()
    totals_data = pd.Series()
    distr_data = []

    class_ids = []
    # data manipulation for each csv in folder
    for filename in os.listdir(grade_dir):
        if not filename.endswith(".csv"):
            continue
        path = grade_dir+filename
    
        class_id = path.split('/')[-1].split('.')[0]
        print(class_id)
        class_data = pd.read_csv(path).drop(['ID', 'Error grading project'], axis=1)
        # make sure class size is of a certain size
        if len(class_data.index) < 5:
            print(class_id, "not enough")
            continue

        class_id = path.split('/')[-1].split('.')[0] + ' (n=' + str(len(class_data.index)) + ')'
        class_ids.append(class_id)

        # data for percentage of completion by class by requirement
        by_reqs_aggr = class_data.apply(lambda x: (100 * x.sum()/len(x.index)).round(0))
        by_reqs_data = by_reqs_data.append(by_reqs_aggr, ignore_index=True, sort=False)[by_reqs_aggr.index.tolist()]
        
        # data for percentage of total class completion by class
        possible_score = len(class_data.index) * len(class_data.columns)
        totals_aggr = class_data.sum(axis=0).sum() * 100 / possible_score
        totals_data = totals_data.append(pd.Series(totals_aggr, index=[class_id]))
        
        # data for distributions by class
        distr_aggr = pd.concat([class_data, pd.DataFrame(class_data.sum(axis=1), columns=['Sum'])], axis=1)
        distr_aggr = distr_aggr.groupby('Sum').Sum.count()
        distr_aggr.name = class_id
        distr_aggr = distr_aggr.reindex(range(len(by_reqs_data.columns) + 1), fill_value=0)
        distr_data.append(distr_aggr)


        tID = class_id.split('-')[0]
        if tID in by_tID_data.keys():
            by_tID_data[tID] = by_tID_data[tID].append(class_data)
        else:
            by_tID_data[tID] = class_data

    by_reqs_data = by_reqs_data.transpose()
    by_reqs_data.columns = class_ids
    by_reqs_data.index.name = 'Requirement'
    by_reqs_data = by_reqs_data.reset_index()

    by_cID_data.append(totals_data)

    # defining pdf where graphs for each class will be joined
    pdf = PdfPages(module + 'graphs/' + modname + '-' + grade + '.pdf')

    # construct per-requirement graph
    plt.subplots(figsize=(10, 6))
    plt.title((modname + ' grade ' + grade + ' Classroom Performance Per Requirement').title())

    pos = list(range(len(by_reqs_data.index)))
    width = .7 / (len(class_ids))

    # plotting a set of bars for each grade level
    for i, class_id in enumerate(class_ids):
        if 'Requirement' not in class_id:
            plt.bar(
                pos if i == 0 else [p + width * i for p in pos],
                by_reqs_data[class_id],
                width * .9,
                alpha=0.7,
                color=colors[class_id.split('-')[0]],
                label=class_id,
                zorder=3
            )
    plt.xlabel('Requirements')
    plt.ylabel('Percent Complete')
    plt.ylim([0, 100])
    plt.grid(axis='y', zorder=0, which='both')
    plt.legend(bbox_to_anchor=(1.04, 1), loc='upper right', ncol=1)

    plt.savefig(module + 'graphs/pngs/' + modname + '-' + grade + '-per-req.png', bbox_inches='tight')
    pdf.savefig(bbox_inches='tight')


    # construct totals graph
    if len(class_ids) > 1:
        plt.subplots(figsize=(10, 6))
        plt.title((modname + ' grade ' + grade + ' Classroom Performance Totals').title())
        plt.bar(
            list(range(len(class_ids))),
            totals_data,
            alpha=0.7,
            color=[colors[ID.split('-')[0]] for ID in class_ids],
            zorder=3
        )
        plt.xlabel('Classroom')
        plt.xticks(list(range(len(class_ids))), labels=class_ids, rotation=20, horizontalalignment='right')
        plt.ylabel('Percent Complete')
        plt.ylim([0, 100])
        plt.grid(axis='y', zorder=0, which='both')

        plt.savefig(module + 'graphs/pngs/' + modname + '-' + grade + '-totals.png', bbox_inches='tight')
        pdf.savefig(bbox_inches='tight')

    # construct distribution graph
    fig, axs = plt.subplots(math.ceil(len(distr_data) / 2), 2, figsize=(10, 5 * math.ceil(len(distr_data) / 2)))
    fig.suptitle('Grade Distributions')
    for i, [ax, d] in enumerate(zip(axs.reshape(-1), distr_data + [0])):
        if i < len(class_ids):
            pos = list(range(len(d.index)))
            ax.bar(
                pos,
                d,
                .95,
                alpha=0.7,
                zorder=3,
                color=colors[class_ids[i].split('-')[0]]
            )

            ax.set_title(('Classroom ' + d.name).title())

            ax.set_xlabel('Score')
            ax.set_xticks(pos)
            ax.set_xticklabels = d.index

            ax.set_ylabel('Students')
            ax.yaxis.set_major_locator(MaxNLocator(integer=True))

            ax.grid(axis='y', zorder=0, which='major', alpha=0.5)

        else:
            ax.remove()  # remove the possible extra subplot

    plt.savefig(module + 'graphs/pngs/' + modname + '-' + grade + '-distributions.png', bbox_inches='tight')
    pdf.savefig(bbox_inches='tight')

    pdf.close()


def main():
    module = sys.argv[1]
    module += '' if module[-1] == '/' else '/'
    modname = module.split('/')[1]

    grades = []
    for entry in os.listdir(module + 'csv/'):
        if not os.path.isdir(module + 'csv/' + entry) or 'aggregated' in entry:
            continue

        grade_dir = module + 'csv/' + entry + '/'
        plot_grade(module, grade_dir)

        grades.append(entry)
    
    pdf = PdfPages(module + 'graphs/' + modname + '-teacher-analysis.pdf')

    # construct graph measuring performance by classroom and grade
    fig, axs = plt.subplots(1, len(by_cID_data), sharey=True, sharex=True, figsize=(3 * len(by_cID_data), 6))
    fig.suptitle((modname + ' Requirement Completion by Classroom and Grade').title())
    fig.text(0.5, 0.05, 'Grades', ha='center', va='center')
    fig.text(0.08, 0.5, 'Classroom Completion (%)', ha='center', va='center', rotation='vertical')

    for i, [d, ax] in enumerate(zip(by_cID_data, axs)):
        bar = ax.bar(
            list(range(len(d.index))),
            d,
            .9,
            color=[colors[ID.split('-')[0]] for ID in d.index],
            alpha=0.7,
            zorder=3
        )
        ax.set_ylim([0, 100])
        ax.set_xlabel(grades[i])
        ax.tick_params(labelbottom=False)
        ax.legend(bar, d.index, bbox_to_anchor=(1, -0.1), loc='upper right', ncol=1)

    plt.savefig(module + 'graphs/pngs/' + modname + '-by-classroom.png', bbox_inches='tight')
    pdf.savefig(bbox_inches='tight')

    # construct graph measuring performance by teacher
    data5 = pd.Series()
    for tID, df in by_tID_data.items():
        aggr = df.sum(axis=0).sum() * 100 / (len(df.columns) * len(df.index))
        data5 = data5.append(pd.Series(aggr, index=[tID]))
    
    plt.subplots(figsize=(10, 6))
    plt.title((modname + ' Requirement Completion by Teacher').title())
    plt.bar(
        list(range(len(data5))),
        data5,
        alpha=0.7,
        color=[colors[tID] for tID in data5.keys()],
        zorder=3
    )
    plt.xlabel('Teacher')
    plt.xticks(list(range(len(data5.keys()))), labels=data5.keys())
    plt.ylabel('Percent Complete')
    plt.ylim([0, 100])
    plt.grid(axis='y', zorder=0, which='both')

    plt.savefig(module + 'graphs/pngs/'+ modname + '-by-teacher.png', bbox_inches='tight')
    pdf.savefig(bbox_inches='tight')

    pdf.close()

if __name__ == '__main__':
    main()
