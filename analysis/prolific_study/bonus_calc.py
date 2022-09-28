import pandas as pd
import numpy as np
import ast
import json
import os
from df_utils_prolific import *
import seaborn as sns
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D


cur_dir =  os.getcwd()
sns.set(font_scale=2, style = 'white', palette = 'Set3')


# get data csv
cur_dir =  os.getcwd()
parent_dir = os.path.dirname(os.path.dirname(cur_dir))
#data_file = 'data/prolific/data_FurnitureCompany_2022-06-13_14-10.csv'
data_file ='data/prolific/data_FurnitureCompany_2022-07-07_11-02.csv'

data_path = os.path.join(parent_dir, data_file)

# transform to dataframe




df = pd.read_csv(data_path,  encoding = 'UTF-16', sep = ';')
df = df[df['UD01_RV1'].notna()]

df_pl = df.filter(regex='PL01')
df_pl = df_pl.rename(columns = dict(zip(df_pl.columns, list(range(1,13)))))
df_m = df.filter(regex='MD01')
df_m = df_m.rename(columns = dict(zip(df_m.columns, list(range(1,13)))))

df_bonus =df_pl.divide(df_m)
bonus = []
ind_b =[]
for index, rows in df_bonus.iterrows():
    p_bon = []
    for c in rows:
        if (c >= 0.9) and (c < 1):
            p_bon.append(10)
        elif c == 1:
            p_bon.append(20)
        elif c == c:
            p_bon.append(0)
    bonus.append( [str(df.loc[index,['UD01_RV1']].values[0]), sum(p_bon), str(df.loc[index,['STARTED']].values[0]), str(df.loc[index,['CASE']].values[0])])
    ind_b.append(p_bon)

c = 0
for p in bonus:
    print('DATE: ' + p[2] + ', Prolific_ID: ' + p[0] + ' Sum of Bonus: ' + str(p[1]))

    print('VP: ' + p[3] + ', In month: ' + str(ind_b[c]) + '\n')

    c+=1
