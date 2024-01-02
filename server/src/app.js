// var express = require('express');
import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session'
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
    name: 'userSession',
    secret: 'not-so-secret 111'
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
