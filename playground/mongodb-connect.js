const {MongoClient, ObjectID} = require('mongodb');
//const ObjectID = require('mongodb').ObjectID;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server.');
    }

    console.log('MongoDB Server connected successfully.');
    let db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Amanda',
    //     age: 25,
    //     location: 'Hollywood'
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert user', err);
    //     }

    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    // db.collection('Users').find({
    //     _id: new ObjectID('5b61a2218b75510cb4f609a4')
    // }).toArray().then((docs) => {
    //     console.log('Users');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch', err);
    // });

    // db.collection('Users').findOneAndDelete({ _id: new ObjectID('5b646abc320cb1a491f34cde')}).then((res) => {
    //     console.log(res);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b646a9c320cb1a491f34cd2')
    }, {
        $set: {
            location: 'Sydney',
            age: 23
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    });

    client.close();

});