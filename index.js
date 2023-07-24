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


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const userCollection = client.db('devdairires').collection('users')
    const commentCollection = client.db('devdairires').collection('comment')

    app.get('/blogs', async (req, res) => {
      const result = await BlogCollection.find().toArray();
      res.send(result)
    });

    // get all approved blogs
    app.get('/blog/approved', async (req, res) => {
      const result = await BlogCollection.find({ status: 'approved' }).toArray();
      res.send(result)
    })
    // post blog in database
    app.post('/blog', async (req, res) => {
      const blog = req.body
      const result = await BlogCollection.insertOne(blog);
      res.send(result)
    })


    // get blogs by category GO
    app.get('/blogs/go', async (req, res) => {
      const result = await BlogCollection.find({ category: 'Go' }).toArray()
      res.send(result)
    })

    // get blogs by category javascript
    app.get('/blogs/javascript', async (req, res) => {
      const result = await BlogCollection.find({ category: 'javascript' }).toArray()
      res.send(result)
    })

    // get blogs by category php
    app.get('/blogs/php', async (req, res) => {
      const result = await BlogCollection.find({ category: 'PHP' }).toArray()
      res.send(result)
    })

    // get blogs by category Python
    app.get('/blogs/python', async (req, res) => {
      const result = await BlogCollection.find({ category: 'Python' }).toArray()
      res.send(result)
    })


    // get blogs by ascending order by like
    app.get('/blogs/popular', async (req, res) => {
      const result = await BlogCollection.find().sort({ likes: -1 }).limit(6).toArray();
      res.send(result)
    })

    // get blogs by id
    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await BlogCollection.findOne(query)
      res.send(result)
    })
    // get blogs by email
    app.get('/blog/:email', async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email: email }
      const result = await BlogCollection.find(query).toArray()
      res.send(result)
    })


    // get three blog sort by date
    // app.get('/blog/date', async (req, res) => {
    //   const result = await BlogCollection.find().sort({ date: -1 }).limit(3).toArray();
    //   console.log('hello');
    //   res.send(result)

    // }) 

    app.get('/date', async (req, res) => {
      const result = await BlogCollection.find({ status: 'approved' }).sort({ date: -1 }).limit(3).toArray();
      res.send(result)
    })

    // get blog search by sub category category and tags
    app.get('/find/:text', async (req, res) => {
      const text = req.params.text;
      const result = await BlogCollection.find({
        $or: [
          { subcategory: { $regex: text, $options: "i" } },
          { category: { $regex: text, $options: "i" } },
          { tags: { $regex: text, $options: "i" } },

        ]
      }).toArray()
      res.send(result)
    })

    // get blogs by tags
    app.get('/subcategory/:text', async (req, res) => {
      const text = req.params.text;
      const result = await BlogCollection.find({
        $or: [
          { subcategory: { $regex: text, $options: "i" } },
        ]
      }).toArray()
      res.send(result)
    })




    // saved all comment in database with blog id
    app.post('/comment', async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment)
      res.send(result);
    })

    // get all comment by id
    app.get('/comment/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { id: id };
      const result = await commentCollection.find(query).toArray();
      res.send(result);
    })

    // saved user in database and role
    // app.put('/users/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const user = req.body;
    //   const query = { email: email };
    //   const options = { upsert: true }
    //   const updateDoc = {
    //     $set: user
    //   }
    //   const result = await userCollection.updateOne(query, updateDoc, options)
    //   console.log(result);
    //   res.send(result)
    // })
    app.post('/newUser', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.json({ message: 'user already exists' })
      }
      const result = await userCollection.insertOne(user);
      res.json(result);
    });
    // get all Users 
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })


    // approved blog
    app.patch('/blog/update/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { status: 'approved' }
      }
      const result = await BlogCollection.updateOne(query, updateDoc)
      res.send(result)
    })


    // deny blog
    app.patch('/blog/deny/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { status: 'deny' }
      }
      const result = await BlogCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    // set user role
    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: { role: 'admin' }
      }
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result)
    })

    // get user role
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
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