# Experiment Data Explanation

This tutorial briefly explains all the data stored by SoSci Survey for the Experiment.

---

## Player Data (PL)

### Profit Player (PL01_01 - PL01_12)
This variable stores for each month how much profit the player has achieved at the end of the month.

### Player Beds (PL02_01 - PL02_12)
This variable stores for each month how much beds the player has build at the end of the month.

### Player Bookcases (PL03_01 - PL03_12)
This variable stores for each month how much bookcases the player has build at the end of the month.

### Player Tables (PL04_01 - PL04_12)
This variable stores for each month how much tables the player has build at the end of the month.

### Player Chairs (PL05_01 - PL05_12)
This variable stores for each month how much Chairs the player has build at the end of the month.

### Interrupted (PL06_01 - PL06_12)
Indicates whether the expiration of time has interrupted the production in a workshop in a month

---

## Model Data (MD)

### Profit Model (MD01_01 - MD01_12)
This variable stores for each month what the optimal profit is for that month.

### Model Beds (MD02_01 - MD02_12)
This variable stores for each month what the optimal number of beds is for that month.

### Model Bookcases (MD03_01 - MD03_12)
This variable stores for each month what the optimal number of bookcases is for that month.

### Model Tables (MD04_01 - MD04_12)
This variable stores for each month what the optimal number of tables is for that month.

### Model Chairs (MD05_01 - MD05_12)
This variable stores for each month what the optimal number of chairs is for that month.

---

## Answer (AN)
The answers that the subject gives to various questions during the experiment are stored here (not used in this experiment).

### Mike's first question (AN01_01)

### Mikes's second question (AN01_02)

### Anwers 3-7 (AN01_03 - AN01_07)

---

## Assessment (AS)

### Lickert answer (AS01_01 & AS01_12)
This assessment includes a performance evaluation in the Lickert Scale for every month.

---

## Feedback to Mike (FB) 
(not used in this experiment)

### First Feedback (FB01_01 & FB01_02)
Here Mike will provide feedback on his solution for a month. This feedback consists of a Lickert Scale (FB01_01) and an open response area (FB01_02).

### First Feedback (FB02_01 & FB02_02)
Here Mike will provide feedback on his solution for a month. This feedback consists of a Lickert Scale (FB02_01) and an open response area (FB02_02).

---

## Global Timer (TI)

### Track Global Time (TI01_01)
This variable is stored by SoSci Survey at the end of the game and indicates how long the subject has played in total. During the experiment, however, this variable is also used to determine the times in the log.

---

## Log Data (LG)

### Performed Actions (LG01)
This variable stores a list of actions that the subject has done during the game. The list is structured as follows:

**[(action, timestamp, month), (acton, timestamp, month),...]**


---

## Experiment Order (EO)

### Order (EO01_01)
Saves the order of the months in which the subject plays the game

---

## Controll Questions (CQ)

### Questions (CQ01_01 & CQ01_02)
This variable stores whether the answers to test questions are true or false. Thus it can be controlled whether the subject really plays the game attentively or not. An attentive subject should not have any question wrong. (<https://www.prolific.co/>)

---

## User Data (UD)

### Track IDs (UD01_RV1 - UD01_RV3)
Stores the Prolific ID (UD01_RV1), the Study ID (UD01_RV2) and the Session ID (UD01_RV3) that are passed to SoSci Survey from Prolific (online experiment platform). The Prolific ID is used to match the subjects in the experiment to those on Prolific. 

---

## Generall Questions (GE)


### Alter (GE01)
Saves the age of the test person. If the subject is under 18, he/she is not allowed to participate in the experiment.

### Gender (GE03)
Saves the specified gender of the test subject

### Anmerkung (GE06)
Saves any comments the subject had after completing the experiment.

### Spielerfahrung (GE07)
Saves how much player skill the subject has.

### Schon gespielt (GE08)
Stores whether the subject has participated in this or a very similar experiment before.

### Einteilung in Experimentalgruppe (GE11)
Saves which of the two experiment groups the test person was assigned to. This division takes place automatically and determines which linear problems need to be solved.



