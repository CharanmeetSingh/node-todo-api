const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

let {Todo} = require('./../models/todo');
let {User} = require('./../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'charan@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, acess: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'meet@gmail.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, acess: 'auth'}, 'abc123').toString()
    }]
}];

let todos = [{
    text: 'First test',
    _id: new ObjectID(),
    _createdBy: userOneId,
}, {
    text: 'Second test',
    _id: new ObjectID(),
    completed: true,
    completedAt: 333,
    _createdBy: userTwoId,
}];

let populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {done()});   
};

let populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
