let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://todo-user:todo-password1@ds061196.mlab.com:61196/node-todo' || 'mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };