const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfz3k0z.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const userCollection = client.db("identityPulse").collection('users');

 


// Post user data while registration and check if the user already exists or not.
app.post('/users', async(req, res) => {
    const user = req.body;
    const query = {email : user.email};
    const isUserExists = await userCollection.findOne(query);
    if(isUserExists){
      return res.send({message : "User already exists", insertedId : null})
    }
    const result = await userCollection.insertOne(user);
    res.send(result);
  });


    //Get users data
    app.get('/users', async(req,res)=> {
      let query = {};
      if(req.query?.email){
        query = { email : req.query.email}
      }
      const result = await userCollection.find(query).toArray();
      res.send(result);
    })


    // Update user info
    app.put('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const updatedData = req.body;
      const updatedDoc = {
        $set : {
          name: updatedData.name,
          bio: updatedData.bio,
          image: updatedData.image,
          title: updatedData.title,
        }
      }
      const result = await userCollection.updateOne(query, updatedDoc);
      res.send(result)
    });







    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Identity is finding")
})

app.listen(port, () => {
    console.log(`Server is running ${port}`);
})