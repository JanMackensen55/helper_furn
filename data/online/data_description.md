# Data description - Online study  #
- version 15.6.22
Months refer to game trials in the full game (1 to 12)
They were not randomized.
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
  * **04** Gaming Experience:
    * [1] I do not play computer or console games in my free time.
    * [2] I play computer or console games at irregular intervals (maximum once a month).
    * [3] I play computer or console games from time to time (2-3 times a month).
    * [4] I play computer or console games regularly (at least once a week).
  * **05** Played before:
    * [1] no
    * [2] yes, played before
    * [-9] not answered
  * **06** Comments

* **AN01** (global strategy questions, after month 8 and 10)

    * **_01** "Was sollte ich tun um eine möglichst gute Lösung zu finden?"(What should I do to find the best possible solution?); after month 8

    * **_02** "Wie finde ich jeden Monat heraus, was ich bauen soll?"(How do I find out what to build in each month?), after month 10



* **AS** (Likert Answers and free text assessment):
  * **01**  after month 3
  * **02**  after month 6
  * suffix applies to both:
      * **_01**: Likert question "Wie gut schätzt du deine Lösung ein?" (How good do you think your solution is?)
              * [1]: very bad
              * [2]: rather bad
              * [3]: rather good
              * [4]: very good
              * [-1]: no idea
      * **_02** Warum schätzt du deine Lösung so ein? (Why do you rate your solution this way?)


* **FB** Questions asked to assess the solution of an npc (Mike),

  * **01** Month 11, suboptimal solution shown (1,4,0,6):
  ""
  * **02** Month 12, optimal solution shown (1,4,0,5)
  * suffix applies to both:

    * **_01** Likert question "Wie gut ist meine Lösung?" (How good is my solution?)
            * [1]: very bad
            * [2]: rather bad
            * [3]: rather good
            * [4]: very good
            * [-1]: no idea
    * **_02** " Was habe ich richtig/falsch gemacht?"(What did I do right/wrong?)

  * **FB02** Month 12, optimal solution shown


* **TI01_01**: Global Time in seconds

* **LG01_01** Action log during the game, consisting of tuple (action identifier, second,month)



* **TIME00**
  * time spent on each page
