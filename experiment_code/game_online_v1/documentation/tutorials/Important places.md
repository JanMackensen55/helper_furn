# Important places

This tutorial is intended to show the most important places where basic things of the game meachnik can be changed. This tutorial should serve as a quick guide to enable a fast familiarization with the codebase.

## MainScene.js
These file contain the central control unit of the game. The following things are controlled:

+ At the start of the game, all important objects of the game are initialized here. Among them the UI, the player and the linear problems to be solved.
+ Specifies what happens at the change from one month to the next (next_month()).
+ Here the look of the game interface is determined and rendered.
+ Sets the order in which the previously selected months are played and initializes a timer that measures the elapsed time within a month.

In general, for any kind of adjustment, the MainScene is a good place to start looking for the functionality to change, if it is not clear where exactly it is implemented. 

## UI.js
In this file all elements of the graphical interface are managed, which have nothing to do with the landscape of the Furniture Company

+ The button with which the month can be ended. Here you can program queries that should take place before the month really ends.
+ The upper part of the UI where you can see the money earned at the moment, the resources of wood and iron that are still available, the timer of the current month and the month you are currently in.

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

## Preloader.js
Loads all sprites and graphics used in the game (with a few exceptions, which are loaded in the spicial scenes themselves).

## Tutorial.js
Everything concerning the tutorial is determined in this file.

+ Which text fields are displayed.
+ Which tasks have to be done.
+ What will be changed in the game at the beginning and end of the month.
+ Which resources are available in the tutorial month.