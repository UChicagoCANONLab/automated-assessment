#Zack Crenshaw

# Makes a bar graph out of data provided
# Groups of bars, one bar for each grade, group for each required element

#python3 groupedBarGraph.py (module)

import sys,random
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

#calculates the percentage for a given row of data
def calcPercentages(data):
    output = []
    count = float(data[1])
    output.append(data[0])

    for i in range(3,len(data)): #ignore error projects
        dataf = float(data[i])
        output.append((dataf/count)*100)
    return output

def main():

    module = sys.argv[1]

    module += '/' if module[-1] != '/' else ''
    file = module+"csv/aggregated/aggregated.csv"

    modname = module.strip("./ ")

    #Will be structured: grade,count,attribute1...attributeN
    data = []
    header = []
    needHeader = True

    with open(file,'r') as rawdata:
        for d in rawdata.readlines():
            d = d.strip().split(',')
            if needHeader:
                header = d
                needHeader = False
            else:
                data.append(d)
    header.pop(2) #ignore error projects
    percentData = []
    for i in range (len(data)):
        percentData.append(calcPercentages(data[i]))



    # Construct data for graph
    graph_data = {}
    graph_data['Requirement'] = header[2:]
    for i in range(len(percentData)):
        graph_data[percentData[i][0]] = percentData[i][1:]


    df = pd.DataFrame(graph_data, columns = graph_data.keys())


    # Construct graph

    # Setting the positions and width for the bars
    pos = list(range(len(df[percentData[0][0]])))
    labels = list(map(chr, range(ord('A'), ord('Z')+1)))
    width = .15

    # Setting the color palette
    # Currently designed to handle 6 grade levels, 3 through 8.
    colors = ["#080080","#990099","#B31B00","#FFEB00","#07CC00","#00B1E6"]

    # Plotting the bars
    fig, ax = plt.subplots(figsize=(10, 6))

    i = 0
    for k in graph_data.keys():
        if "Requirement" not in k:
            plt.bar(pos if i==0 else [p + width * i for p in pos] ,
                    df[k],
                    width,
                    alpha=0.7,
                    color=colors[int(k)-3],
                    label=df['Requirement'][0])
            i+=1


    # Set the y axis label
    ax.set_ylabel('Percent Complete')

    # Set the chart's title
    ax.set_title(module.strip("./ ").title())

    # Set the position of the x ticks
    ax.set_xticks([p + width for p in pos])

    # Set the labels for the x ticks
    ax.set_xticklabels(labels)

    # Setting the x-axis and y-axis limits
    plt.xlim(min(pos) - width, max(pos) + width * i)
    plt.ylim([0, 150])

    # Adding the legend and showing the plot
    plt.legend(df.keys()[1:], loc='upper left')
    plt.savefig(module+modname+'-groupedBar.pdf')
    #plt.show() #if you want to see it










if __name__ == '__main__':
    main()