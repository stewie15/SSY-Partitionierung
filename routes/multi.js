function getRouter(shard_nr) {
    const express = require('express');
    const db = require('../src/multi-database');
    const router = express.Router();

    router.get('/:id', getItem);
    router.put('/:id', putItem);
    router.delete('/:id', delItem);


    function getItem(req, res) {
        const collection = db.getCollection('multi-' + shard_nr);
        console.log('param: ', req.params.id);
        let item = collection.findOne({key: req.params.id});
        console.log('Item: ', item);
        if(item == null) {
            res.status(404).end()
        } else {
            res.send(item.value)
        }
    }


    function putItem(req, res) {
        const collection = db.getCollection('multi-' + shard_nr);

        let item = collection.findOne({key: req.params.id});

        if (item === null) {
            item = collection.insert({key: req.params.id, value: req.body});
        } else {
            item.value = req.body;
            collection.update(item);
        }
        res.json(item.value);
    }


    function delItem(req, res) {
        const collection = db.getCollection('multi-' + shard_nr);

        let item = collection.findOne({key: req.params.id});

        if(item == null) {
            res.status(404).end();
        } else {
            collection.remove(item);
            res.send("Value: " + item.value + " has been removed!");
        }
    }

    return router;
}

module.exports = getRouter;
