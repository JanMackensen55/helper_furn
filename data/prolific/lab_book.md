# Lab Book Möbelfabrik, Prolific Experiment

Diese Studie ist gedacht als etwas vereinfachte Version des Onlineexperiments mit counterbalanced Gruppen um den Confounder der Lerneffekte zu entfernen.
Ca. 100 Personen mit je 6 Trials sollen aufgenommen werden.
Je 25 werden in eine Gruppe eingeteilt und bekommen dieselben Trials in randomisierter Reihenfolge. Die Gruppen sind in hinsicht auf Anzahl der optimalen Lösungen, der Restriktionen, der optimalen Strategien und der Fokus Items in den optimalen Lösungen eingeteilt. Die Gruppen überschneiden sich alle in jeweils 2 Trials.

Die Gruppen sind:

s1: [1,2,3,4,5,11]

s2: [2,4,6, 9,10,12]

s3: [1,6,7,8,9,11]

s4: [3,5,7,8,10,12]

## Pilot:
1. Pilot: Über Prolific
 * vp 93-97 gehören zum piloten
 * 93 muss rausgenommen werden, weil die Person den Tab gewechselt hat und damit die Zeiteinordnung durcheinandergebracht hat.
 Durch das Tab wechseln ist die Zeitleiste beim Zeitlimit nicht weitergelaufen, die globale Zeit in Soscisurvey aber schon.
  Deswegen kamen mehr als 3 Minuten in dem Monat zustande
  * 96 wurde rausgenommen, weil keine komplette Lösung
 *94-97 können verwendet werden sind nur noch nicht in der Gruppenzuteilung

Es wurde daraufhin die Zeitrechnung angepasst, indem der Monat auch abläuft wenn die Person den Tab wechselt.

2. Pilot:
 * vp 118-120
 * diese Personen haben die neue Zeitrechnung und die neue Counterbalancing Zuordnung implementiert und können in den Hauptdatensatz aufgenommen werden
 * bei 119 und 120 gab es ein Problem, weil Aktionen, die im Tutorial durchgeführt wurden, dem ersten Trial zugeordnet wurden.
Dieses Problem wurde danach in der Experiment-Implementation gefixt und wird im preprocessing in df_utils_prolific auch abgefangen
 * 118 war sehr schlecht und hat keine vollständige Lösung abgegeben

## Hauptexperimt

excluded werden Personen, die keine komplette Lösung abgeben oder so viel den Tab wechseln , dass zu viele Dinge nicht gebaut werden können (die Vps sind nicht durchgehend nummeriert)
1. Gruppe [121-146], Monate [1,2,3,4,5,11]:
* keine komplette Lösung:,123,136
* zu oft Tab gewechselt: 143
* überhaupt Tab gewechselt aber nicht excluded: 122, 124, 127,142

 * Total: 22

2. Gruppe [129-179]
* keine komplette Lösung:136,143,93,152,154,157,158,159,160,161,174,175,179
* zu oft Tab gewechselt: 157, 161, 172
* überhaupt Tab gewechselt: 167 (not excluded)

3. Gruppe [181-208]
* keine komplette Lösung: 182,183,195,200,201,203
* 185 returned their sheet
4. Gruppe [209-238]
* keine komplette Lösung 212,213,219,225
