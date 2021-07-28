# Creating full-fledged twitter

# Day 1

I have always been into web-dev but never had a reason top pursue it fully. I have taken some Lynda course on fullstack dev, PHP etc. 

## Goal

Each user will have profile and profile page. They can follow other users. At home page they see tweets from people they follow chronologically. 

## Database design

This is the first step in my opinion. After watching some YT to start my brain gears running I decided to have 5 tables:
1. user: this is simply list of users. only constraint is to have each username unique. It has three columns username, fullname and bio. In sqlite, apparently you do not need to explicitly create and point to id column since it is done in the background by default (under the column name *rowid*)
2. tweet: 
3. quote and reply: these are simply many-to-many relation of tweetids
4. follow: this is where we keep the following list for each user. 

For now I have skipped 3rd table. 

# Day 2
## Backend: expressJS

Our backend will only serve as collection of API enpoints. I am only aware of expressJS in this ecosystem, so will be using this. For now I only need two endpoints: `/login` and `/home`. Latter will serve the tweets a user follows chronologically. In order to know which user is logged in, I believe we have to use *cookies*. Happily it is available as *cookie-parser* middleware for express. 

For now I think I will need following endpoints:
* `/newtweet`: request needs just the tweet content (username,userid will be given by the session)
* `/follow` : needs username to follow
* `/retweet` : tweet id to retweet

Implement these later

* `/reply` : 
* `/quote` :
* `/login` : 

--- 

# Learning SQL by making a twitter

> bit of motivation here. My main reason is to learn SQL, secondary reason is to make a tutorial on how to make a fucking EDIT  button.

>What are the goals of the project?
