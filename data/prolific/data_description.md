# Data description - Prolific study #
- version 14.6.22
Months refer to game trials in the full game (1 to 12)
Trials refer to the chosen month for the participant. A subset of 6 months were randomly chosen for each subject. The Tutorial trial was the same for all participants and not in the list of global months.
The following rows were not used in the experiment and can be ignored:
* GE01-06 are the german versions, not relevant here


identifier are signified in bold, values with []

* **PL** (Player): the values the player reached at the end of the trial
  * **01** profit
  * **02** beds
  * **03** bookcases
  * **04** tables
  * **05** chairs
  * **06** interrupted: 0 or 1 for being interrupted by the timelimit when something is still built in the workshop
  * The suffix **_m** is added with m being the number of the month chosen in trials. For months under 10 a 0 is added to the number. The order of the trials is not represented here. The cells are filled with NaN if the participant did not play the month.
  * Example: PL01_01 - player profit in month 0

* **MD** (Model): the optimal values the model determined, note that multiple optimal values are possible
    * **01** profit
    * **02** beds
    * **03** bookcases
    * **04** tables
    * **05** chairs
    * The suffix **_m** is added with m being the number of the month chosen in trials. For months under 10 a 0 is added to the number. The order of the trials is not represented here. The cells are filled with NaN if the participant did not play the month.
    * Example: MD01_01 - optimal profit in month 0


* **GE** (General Questions):
  * **13** Age:
    * [1] <18 (not permitted)
    * [2] 18-24
    * [3] 25-29
    * [4] 30-39
    * [5] 40-49
    * [6] 50-59
    * [7] >60
  * **15** Gender:
    * [1] male
    * [2] female
    * [3] diverse
  * **16** Gaming Experience:
    * [1] I do not play computer or console games in my free time.
    * [2] I play computer or console games at irregular intervals (maximum once a month).
    * [3] I play computer or console games from time to time (2-3 times a month).
    * [4] I play computer or console games regularly (at least once a week).
  * **17** Comments

* **AS01** (Likert Answers):
    * The suffix **_m** is added with m being the number of the month chosen in trials. For months under 10 a 0 is added to the number. The order of the trials is not represented here. The cells are filled with NaN if the participant did not play the month.
    * subjects were asked in 4 trials: "How good do you think your solution is?"
    * Values:
      * [1]: very bad
      * [2]: rather bad
      * [3]: rather good
      * [4]: very good
      * [-1]: no idea

  * **TI01_01**: Global Time in seconds

  * **LG01_01** Action log during the game, consisting of tuple (action identifier, second, trial number)
    * note that the trial number refers to the iteration of the trial not the month
    * there is a reference to trial 6 which corresponds to the two closing actions XA, DO

  * **EO01_01** (Month mapping to each trial):
    * index is the trial number, value is the month

  * **CQ01** (Control Questions):
    * **01** ( directly after tutorial) "Which furniture item did you have to build to go through the tutorial? ( **table**, chair, bookcase bed)": [True] if right, [False] if wrong
    * **02** (after trial 5) "Which piece of furntiure is not produced in the furniture company?" (table, chair, **wardrobe**, bookcase, bed): : [True] if right, [False] if wrong

* **UD01** Prolific information:
  * **RV1** Prolific_PID
  * **RV2** Prolific Study_ID
  * **RV3** SESSION_ID

* **TIME00**
  * time spent on each page
