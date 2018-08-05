const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');

let id = '5b65712783788700b8da71ed';

User.findById(id).then((todo) => {
    if (!todo) {
        return console.log('Not able to find any todo');
    }
    console.log(todo);
}, (err) => {
    console.log(err);
});