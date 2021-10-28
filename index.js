const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
// get the ObjectId to delete an user
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// user: mydbuser1
// pass: JnUv8XxmgMOdAyS1

// Add your connection string into your application code
// Include full driver code example

// databases connection uri
const uri =
  "mongodb+srv://mydbuser1:JnUv8XxmgMOdAyS1@cluster0.5rymw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// creating an instance of the database
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Using Async Await
async function run() {
  try {
    await client.connect();
    const database = client.db("foodMaster");
    const usersCollection = database.collection("users");

    // GET API
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollection.findOne(query);
      console.log("load user with id: ", id);
      res.send(user);
    });

    // UPDATE API
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      // update user else insert user
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("updating user ", res);
      res.send(result);
    });

    // POST API (post method route)
    app.post("/users", async (req, res) => {
      // new user will be found in req.body
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      console.log("got new user", req.body);
      console.log("added user", result);

      // sending the whole result to the client side
      res.json(result);
    });

    // DELETE API
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      // set the id to be deleted
      const query = { _id: ObjectId(id) };
      // delete the item & store the response
      const result = await usersCollection.deleteOne(query);
      console.log("deleting user with id ", id);
      // pass the result in the client side
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

/* // connecting the client of the database
client.connect((err) => {
  const collection = client.db("foodMaster").collection("users");

  // checking whether the database is working or not (hafiz)
  console.log("Hitting the database");

  const user = {
    name: "Sakib Sami",
    email: "sami@gmail.com",
    phone: "01777777777",
  };
  collection.insertOne(user).then(() => {
    console.log("insert success");
  });

  // perform actions on the collection object
  //   client.close();
}); */

// checking whether the port is working or not
app.get("/", (req, res) => {
  res.send("Running my CRUD Server");
});

// checking in which port server is running
app.listen(port, () => {
  console.log("Running Server on port", port);
});
