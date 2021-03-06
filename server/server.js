require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _createdBy: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_createdBy: req.user._id}).then((todos) => {
        res.send({todos});
    }, (err) => {
        res.send(err);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _createdBy: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _createdBy: req.user._id
    }).then((todo) => {
        if (!todo || todo === null) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch(e => {
        res.status(404).send(e);
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    //res.send(body);
    if (_.isBoolean(body.completed) && body.completed) {
        // set completedAt to timestamp
        body.completedAt = new Date().getTime();
        // set completed to false
        body.completed = true;
    } else {
        // set completedAt to null
        body.completedAt = null;
        // set completed to false
        body.completed = false;
    }

    Todo.findOneAndUpdate({ _id: id, _createdBy: req.user._id}, {$set: body}, {new: true}).then((todo) => {
        if (!todo || todo === null) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch(e => {
        res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);
    
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
    	res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });
    }).catch(e => {
        res.status(400).send();
    });
});

app.delete('/users/me/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Server is up on port : ${port}`);
});

module.exports = {app};