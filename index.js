const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8prwai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
  

    const coffeeCollaction = client.db('coffeeDB').collection('coffee')

    app.get('/coffee', async(req, res) => {
        const result = await coffeeCollaction.find().toArray();
        res.send(result)
    })

    app.get('/coffee/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollaction.findOne(query)
        res.send(result)

    })


 //post coffee store DB
 app.post('/coffee', async(req, res) => {
     const newCoffee = req.body;
     console.log(newCoffee)
     const result = await coffeeCollaction.insertOne(newCoffee)
     res.send(result)
 })

 app.put('/coffee/:id', async(req, res) => {
    const id = req.params.id
    const fillter = {_id: new ObjectId(id)}
    const options = {upsert: true}
    const updateCoffee = req.body
    const updateDoc = {
        $set: updateCoffee
    }
    const result = await coffeeCollaction.updateOne(fillter,options,updateDoc)
    res.send(result)
 })

 app.delete('/coffee/:id', async(req,res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await coffeeCollaction.deleteOne(query)
    res.send(result)

 })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('coffee server is getting hoter!')
})





app.listen(port, () => {
  console.log(`coffee server is running on port ${port}`)
})