const express = require("express")
const mongoose = require('mongoose');
const app = express()



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

app.post('/login', async(req, res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username, password});
        if (user) {
            req.session.user = user;
            res.redirect('/menu');
        }else{
            res.send('Invalid username or password');
        }
    }catch (err) {
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


app.listen(3000, () => {
    console.log("BudFridges is running on port 3000")
})