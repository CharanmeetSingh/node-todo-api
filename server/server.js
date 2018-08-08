const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo || todo === null) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch(e => {
        res.status(404).send(e);
    });
});

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo || todo === null) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch(e => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Server is up on port : ${port}`);
});

module.exports = {app};