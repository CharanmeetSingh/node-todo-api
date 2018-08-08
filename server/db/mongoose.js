let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp' || 'mongodb://todo-user:todo-password1@ds061196.mlab.com:61196/node-todo');

module.exports = { mongoose };