# Entropia Statistics App

An app to upload game data logs, analyze and create statistics from them.

## About the app

### Basic premise

In the game Entropia Universe, you can do all sorts of activities, and these activities cost you in-game money, with this tool, you can upload your activity log, it will analyze important bits of information, log them to database on run-by-run basis and show you information on what happened on that run.

For the time being this tool only focuses on Hunting activities, it will parse, log and show you the following info:

* Shots fired
* How many hits
* How many crits
* How many misses
* Total damage
* Average damage per shot
  
### Future plans

For the future implementations, i am planning on adding these features:

* Used tool/weapon from an API to get decay + ammo burn for those tools/weapons, to calculate actual cost values for runs, and manual input for any markup involved
* Graphs to compare runs and to show progression over several runs
* Add other activities, such as mining, crafting, etc.
* Comparing your results with others (at first limited to your society members)

## Technical info

### Database

![Database Diagram](https://github.com/MikkoKylliainen/EU-Statistics/blob/main/eustats/public/eustats_dbDiagram.jpg)

Nothing much to say about the Database for now, no relations, just simple tables (collections) for now, will be expanded in the future.

### Installation commands

#### Installation folder (/EU-Statistics/)

**npm create vite@latest**
-> project name: eustats

<sub>This will create the frontend folder /eustats/</sub>

#### Backend (/eustatsBase/api/)

**npm install express mongoose bcrypt body-parser cors —save-dev**

**Note:** body-parser was needed for uploading larger files, CORS was needed for Cross-Origin problems when moving backend around to different servers, moment package just saved a lot of touble when handling date/time formats.

#### Frontend (/eustatsBase/eustats/)

**npm install redux react-redux @reduxjs/toolkit @vitejs/plugin-react react-router-dom —save-dev**

**I builds.**
![Database Diagram](https://github.com/MikkoKylliainen/EU-Statistics/blob/main/eustats/public/eustats_ibuilds.png)
