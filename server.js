const express = require("express")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const User = require("./models/userModel");
const fridgeItem = require("./models/fridgeItemModel")

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

//add item to fridge
app.post('/fridge', async (req, res) => {
    try {
        const newItem = new fridgeItem(req.body);
        await newItem.save();
        res.status(201).send(newItem);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all items in the fridge
app.get('/fridge', async (req, res) => {
    try {
        const items = await fridgeItem.find();
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
        const item = await fridgeItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

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
})

mongoose.set("strictQuery", false)
mongoose.connect('mongodb+srv://AADUser:AADPassword@cluster0.29couu8.mongodb.net/?retryWrites=true&w=majority')
.then(() =>  {
    console.log('Connected to MongoDB')
    app.listen(3000, () => {
        console.log("BudFridges is running on port 3000")
    })
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err)
})