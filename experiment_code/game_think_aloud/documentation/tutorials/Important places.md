# Important places

This tutorial is intended to show the most important places where basic things of the game meachnik can be changed. This tutorial should serve as a quick guide to enable a fast familiarization with the codebase.

## MainScene.js / MainScene-2.js
These two files contain the central control unit of the game. The following things are controlled:

+ At the start of the game, all important objects of the game are initialized here. Among them the UI, the player and the linear problems to be solved.
+ Loads all sprites and graphics used in the game (with a few exceptions, which are loaded in the spicial scenes themselves).
+ Specifies what happens at the end of a month (month_done_behavour()).
+ Specifies what happens at the change from one month to the next (next_month()).

The two files are identical and differ only in the linear problems that are loaded. This was necessary to allow an automatic division of the subjects into two different experiment groups by SoSci Survey. Thus, changes to one MainScene file should always be made to the other. 

In general, for any kind of adjustment, the MainScene is a good place to start looking for the functionality to change, if it is not clear where exactly it is implemented. 

## UI.js
In this file all elements of the graphical interface are managed, which have nothing to do with the item cards.

+ Bars that show the consumption of raw materials or the time spent in the workshops.
+ The button with which the month can be ended. Here you can program queries that should take place before the month really ends.
+ The upper part of the UI where you can see the money earned at the moment and the medals received.

## Slider.js
In this file the appearance and the logic of the sliders are determined. So if you need to change anything about their appearance or behavior, this is the right place.

## EventDispatcher.js
Here are all the elements needed to log the actions of the player during the experiment. 

So all listeners are initialized here (activateListeners()). This can be done with the following code:
```javascript
this.on('actionName', (options, to, specify, action) =>
        {
            this.logAction(this.getShortForm('full description of the action'));
        });
```
It is important that the long description of the action must always be linked with a two-letter abbreviation in action_map.xml .

If the listeners are initialized, they can be triggered from anywhere in the code. This is done as follows:
```javascript
this.scene.eventEmitter.emit('actionName', options, to, specify, action)
```

Likewise, the EventDispatcher determines the format of the log, which is then stored on SoSci Survey. For a detailed explanation of the log format see **Experiment Data Explaination**.
