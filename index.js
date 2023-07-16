const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000



// middleWare
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  }
app.use(cors(corsOptions))
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://devDairies:smS5I7TcQcdo4uPC@cluster0.6jlixm1.mongodb.net/?retryWrites=true&w=majority";

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

    const BlogCollection = client.db('devdairires').collection('blogs');

    app.get('/blogs', async(req,res)=>{
      const result = await BlogCollection.find().toArray();
      res.send(result)
  });

  // get blogs by category GO
  app.get('/blogs/go', async(req,res)=>{
    const result = await BlogCollection.find({category : 'Go'}).toArray()
    res.send(result)
})

// get blogs by category javascript
app.get('/blogs/javascript', async(req,res)=>{
    const result = await BlogCollection.find({category : 'javascript'}).toArray()
    res.send(result)
})

// get blogs by category php
app.get('/blogs/php', async(req,res)=>{
    const result = await BlogCollection.find({category : 'PHP'}).toArray()
    res.send(result)
})

// get blogs by category Python
app.get('/blogs/python', async(req,res)=>{
    const result = await BlogCollection.find({category : 'Python'}).toArray()
    res.send(result)
})


// get blogs by ascending order by like
app.get('/blogs/populars', async(req,res)=>{
    const result = await BlogCollection.find().sort({likes : -1}).limit(6).toArray();
    res.send(result)
})

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})