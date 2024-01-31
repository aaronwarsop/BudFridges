const express = require("express")
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
});

app.get("/", (req, res) => {
    res.send("Welcome To BudFridges")
})


//login section
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            req.session.user = user;
            res.redirect('/menu');
        } else {
            res.send('Invalid username or password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome ${req.session.user.role}`);
    } else {
        res.redirect('/login');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});


//Fridge Items
const fridgeItemsSchema = new mongoose.Schema({
    itemId: { type: String, unique: true },
    name: String,
    quantity: Number,
    expiryDate: Date,
});

const FridgeItem = mongoose.model('FridgeItem', fridgeItemsSchema);

app.use(bodyParser.json());


//add item to fridge
app.post('/fridge', async (req, res) => {
    try {
        const newItem = new FridgeItem(req.body);
        await newItem.save();
        res.status(201).send(newItem);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all items in the fridge
app.get('/fridge', async (req, res) => {
    try {
        const items = await FridgeItem.find();
        res.send(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

//update the fridge items
app.patch('/fridge/id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['quantity', 'expiryDate'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Updates Are Invalid' });
    }
    try {
        const item = await FridgeItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!item) {
            return res.status(404).send();
        }

        //Updating if item quantity is below a certain point (5)
        if (item.quantity < 5) {
            console.log('Message: ${item.name} is low in stock');

            const placeOrder = {
                item: item.name,
                quantity: 50
            };
            console.log('Item Purchased', placeOrder);
        }
        
        res.send(item);
    } catch (err) {
        res.status(400).send(err);
    }
});



app.listen(3000, () => {
    console.log("BudFridges is running on port 3000")
})