# Data description - Think Aloud Study, Slider Game#
- version 15.6.22
Months refer to game trials in the full game (1 to 12). Here the resources and hours were taken x2.
Trials refer to the chosen month for the participant. A subset of 6 months were chosen for each subject based on two counterbalanced groups.
* Group 1 got the months 5, 6, 11, 2, 3, 12
* Group 2 got the months 11, 12, 5, 3, 2, 6
 The Tutorial trial was the same for all subjects and corresponded to month 1.

The following rows were not used in the experiment and can be ignored:
* GE10, GE11
identifier are signified in bold, values with []

* **PL** (Player): the values the player reached at the end of the trial
  * **01** profit
  * **02** beds
  * **03** bookcases
  * **04** tables
  * **05** chairs
  * The suffix **_0m** is added with m being the number of the trial (not the month!).
  * Example: PL01_01 - player profit in trial 1 (here tutorial)

* **MD** (Model): the optimal values the model determined, note that multiple optimal values are possible
    * **01** profit
    * **02** beds
    * **03** bookcases
    * **04** tables
    * **05** chairs
    *  The suffix **_0t** is added with t being the number of the trial (not the month!).
    * Example: MD01_01 - optimal profit in trial 1 (here tutorial)

* **PT01** (Player time in each trial)
  * **_0t** time in seconds in used in trial t

* **LG01_01** Action log during the game, consisting of tuple (action identifier, second, trial number, state of the sliders (chairs, tables, bookcases, beds))
    * note that the trial number refers to the iteration of the trial not the month

* **GE** (General Questions):
  * **01** Age:
    * [1] <18 (not permitted)
    * [2] 18-24
    * [3] 25-29
    * [4] 30-39
    * [5] 40-49
    * [6] 50-59
    * [7] >60
  * **03** Gender:
    * [1] male
    * [2] female
    * [3] diverse
  * **06_01** Comments
  * **07** Gaming Experience:
    * [1] I do not play computer or console games in my free time.
    * [2] I play computer or console games at irregular intervals (maximum once a month).
    * [3] I play computer or console games from time to time (2-3 times a month).
    * [4] I play computer or console games regularly (at least once a week).
  * **09** Group (order of trials) 
    * [1]: 5, 6, 11, 2, 3, 12
    * [2]: 11, 12, 5, 3, 2, 6

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

* **TIME00**
  * time spent on each page
