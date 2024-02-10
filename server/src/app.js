// var express = require('express');
import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session'
import logger from 'morgan';
import cors from 'cors'

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import tweetsRouter from './routes/tweets';

var app = express();

app.use(cors({origin: true, credentials: true}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({secret:"secret"}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tweets', tweetsRouter)

module.exports = app;
