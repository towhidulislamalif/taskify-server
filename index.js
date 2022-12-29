const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// ! middlewares
app.use(cors());
app.use(express.json());

// database connect
const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    console.log('database connected');
  } finally {
  }
}
run().catch(console.dir);

const TaskCollection = client.db('taskify').collection('taskcollection');
// get all tasks from the database
app.get('/tasks', async (req, res) => {
  try {
    const query = {};
    const result = await TaskCollection.find(query).toArray();
    // console.log('🚀 ~ file: index.js:41 ~ app.get ~ result', result);
    res.send(result);
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// get all tasks by specific user email from the database
app.get('/tasks/:email', async (req, res) => {
  try {
    const email = req.params.email;
    // const result = await TaskCollection.find(query).toArray();
    const query = { email: email };
    const result = await TaskCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// add tasks to the database
app.post('/tasks', async (req, res) => {
  try {
    const task = req.body;
    const result = await TaskCollection.insertOne(task);
    res.send(result);
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// update tasks to the database
app.put('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
      $set: {
        completed: true,
      },
    };
    const result = await TaskCollection.updateOne(filter, updatedDoc, options);
    res.send(result);
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// add comment
app.put('/tasks/comment/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const comment = req.body;
    const filter = { _id: ObjectId(id) };
    console.log('🚀 ~ file: index.js:101 ~ app.put ~ comment', comment);
    const options = { upsert: true };
    const updatedDoc = {
      $set: {
        comment: comment,
      },
    };
    const result = await TaskCollection.updateOne(filter, updatedDoc, options);
    console.log('🚀 ~ file: index.js:110 ~ app.put ~ result', result);
    res.send(result);
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// update tasks to the database
app.put('/tasks/notcompleted/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
      $set: {
        completed: false,
      },
    };
    const result = await TaskCollection.updateOne(filter, updatedDoc, options);
    res.send(result);
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// delete task to the database
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TaskCollection.deleteOne({ _id: ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
