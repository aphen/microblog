/**
 * Created by web on 23/7/18.
 */
const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');

app.use('/', indexRouter);
app.use('/users', userRouter);

app.listen(3001);