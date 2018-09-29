const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27018';
const dbName = 'test2'

const findDocuments = function(db, query, callback) {
  const collection = db.collection('collection1');

  collection.find(query).toArray(function(err, docs) {
    assert.equal(err)
    console.log('Found these documents:')
    console.log(docs)
    callback(docs)
  })
}

const insertDocument = function(db, doc, callback) {
  const collection = db.collection('collection1');

  collection.insertOne(doc, function(err, result) {
    assert.equal(err, null)
    console.log("Inserted 3 documents into the collection")
    callback({_id: doc._id});
  })
}

const deleteById = function(db, idString, callback) {
  db.collection('collection1', function(err, collection) {
    collection.deleteOne({_id: mongodb.ObjectID(idString)}, function(err, result) {
      assert.equal(err, null)
      callback(result)
    });
  })
}

const latestNodes = function(db, callback) {
  db.collection('collection1', function(err, collection) {
    collection.find({}).sort({'date': -1}).toArray(function(err, docs) {
      assert.equal(err)
      console.log('Found these latest documents:')
      console.log(docs)
      callback(docs)
    })
  })
}

const httpserver = function(db) {
  const express = require('express')
  const app = express()
  const port = 3000
  const bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());

  app.get('/nodes/get/:id', function(req, res) {
    const query = {'_id': mongodb.ObjectID(req.params['id'])}
    findDocuments(db, query, function(docs) {
      if (docs.length == 1) res.send(docs[0])
      else res.send("")
    })
  })

  app.get('/nodes/latest', function(req, res) {
    latestNodes(db, function(docs) {
      res.send(docs)
    })
  })

  var urlencodedParser = bodyParser.urlencoded({ extended: false })
  app.post('/nodes/new', function (req, res) {
    doc = { title: req.body['title'], content: req.body['content']}
    insertDocument(db, doc, function(result) {
      res.send(result)
    })
  });

  app.listen(port, function() {
    console.log('Example app listening on port 3000!')
  })
}

const mongoserver = function(err, client) {
  assert.equal(null, err)
  console.log('Sucessfully connected to server on port 27018');

  const db = client.db(dbName)
  httpserver(db)
}

MongoClient.connect(url, mongoserver)
