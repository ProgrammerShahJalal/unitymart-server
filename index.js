const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tllgu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }

    }
    next();
}

async function run() {
    try {
        await client.connect();
        const database = client.db('unity-mart');
        const mensCollection = database.collection('mens');
        const womensCollection = database.collection('womens');
        const kidsCollection = database.collection('kids');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');
        const ordersCollection = database.collection('orders');
        const blogsCollection = database.collection('blogs');
        const featuresCollection = database.collection('features');
        const specialsCollection = database.collection('specials');


        /* -------------BLOGS COLLECTION------------ */
        // GET BLOGS API
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        })
        // GET SINGLE BLOG API
        app.get('/blogs/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const blog = await blogsCollection.findOne(query);
            res.json(blog);
        })

        // ADD BLOG
        app.post('/blogs', async (req, res) => {
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog);
            res.json(result);
        });

        /* ---------------FEATURES COLLECTION-------------------- */
        // GET FEATURES API
        app.get('/features', async (req, res) => {
            const cursor = featuresCollection.find({});
            const features = await cursor.toArray();
            res.send(features);
        })
        // GET SINGLE FEATURE API
        app.get('/features/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const feature = await featuresCollection.findOne(query);
            res.json(feature);
        })

        /* ---------------SPECIALS COLLECTION-------------------- */
        // GET SPECIALS API
        app.get('/specials', async (req, res) => {
            const cursor = specialsCollection.find({});
            const specials = await cursor.toArray();
            res.send(specials);
        })
        // GET SINGLE SPECIAL API
        app.get('/specials/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const special = await specialsCollection.findOne(query);
            res.json(special);
        })

        // GET MEN SERVICE API
        app.get('/mens', async (req, res) => {
            const cursor = mensCollection.find({});
            const mens = await cursor.toArray();
            res.send(mens);
        })
        // GET WOMEN SERVICE API
        app.get('/womens', async (req, res) => {
            const cursor = womensCollection.find({});
            const womens = await cursor.toArray();
            res.send(womens);
        })
        // GET KIDS SERVICE API
        app.get('/kids', async (req, res) => {
            const cursor = kidsCollection.find({});
            const kids = await cursor.toArray();
            res.send(kids);
        })
        // GET MEN SINGLE SERVICE API
        app.get('/mens/buy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const men = await mensCollection.findOne(query);
            res.json(men);
        })
        // GET WOMEN SINGLE SERVICE API
        app.get('/womens/buy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const women = await womensCollection.findOne(query);
            res.json(women);
        })
        // GET KIDS SINGLE SERVICE API
        app.get('/kids/buy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const kid = await kidsCollection.findOne(query);
            res.json(kid);
        })

        // GET SINGLE ORDER API
        app.get('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const order = await ordersCollection.findOne(query);
            res.json(order);
        })

        // ADD ORDER
        app.post("/addOrders", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });

        // GET ALL ORDERS
        app.get("/allOrders", async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });

        // GET MY ORDERS
        app.get('/myOrders', verifyToken, async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            console.log(query)
            const cursor = ordersCollection.find(query);
            const myOrders = await cursor.toArray();
            res.json(myOrders);
        })

        // UPDATE BUTTON SHIPPED/ PUT API
        app.put('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedShipped = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedShipped.status
                }
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            console.log('updating pending to shipped', id);
            res.json(result);
        })

        // DELETE API FOR ORDER
        app.delete('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        // GET REVIEWS API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        // GET USERS API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        // POST API / ADD REVIEW
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log('Hitting the post api', review);
            const result = await reviewsCollection.insertOne(review);
            console.log(result);
            res.json(result);
        });

        // ADD MEN SERVICE
        app.post('/mens', async (req, res) => {
            const men = req.body;
            const result = await mensCollection.insertOne(men);
            res.json(result);
        });
        // ADD WOMEN SERVICE
        app.post('/womens', async (req, res) => {
            const women = req.body;
            const result = await womensCollection.insertOne(women);
            res.json(result);
        });
        // ADD KIDS SERVICE
        app.post('/kids', async (req, res) => {
            const kid = req.body;
            const result = await kidsCollection.insertOne(kid);
            res.json(result);
        });

        // GET USERS ACCORDING TO EMAIL
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            console.log(user);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

        // Collect Users by API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })

        // Update Users
        app.put('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // Update User to be Admin and verify by JWT
        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });
                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                }
            }
            else {
                res.status(403).json({ message: 'you do not have access to make admin' })
            }

        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Unity Mart Server is running');
})

app.listen(port, () => {
    console.log('Unity Mart Best Server is running on the port :', port);
})