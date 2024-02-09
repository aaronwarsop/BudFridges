const express = require("express")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(checkRole);

const User = require("./models/userModel");
const fridgeItem = require("./models/fridgeItemModel");
const Passcode = require('./models/Passcode');
const Delivery = require('./models/deliveryModel');
const DamagedItem = require('./models/damagedItemModel');
const DeliveryReport = require("./models/deliveryReportModel");
const orderItem = require("./models/orderModel");
const activity = require("./models/activityModel");
const healthAndSafetyReportItem = require("./models/healthAndSafetyReportModel");

//register section
app.post('/register', async (req, res) => {
    const { username, password, role, email } = req.body;

    try {
        const exist = await User.findOne({username:username});

        if (exist) {
            res.json('userexists');
        }
        else {
            const user = new User({ username:username, password:password, role:role, email:email });
            await user.save();
            res.json({status:"accountcreated", role:role});
        }
    } catch (err) {
        res.json("usernotfound");
    }
});

app.get("/login", cors(), (req, res) => {
    
})

//login section
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username }).select("role");
        if (user) {
            role = user.role;
            res.json({status: "userfound", role:role});
        } else {
            res.json('Invalid username or password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
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



const randomOrgAPIKey = "98abdc56-e679-4f8f-9667-5c2abfe4d401";

async function generateRandomID() {
    try {
      const response = await axios.post("https://api.random.org/json-rpc/2/invoke", {
            jsonrpc: "2.0",
            method: "generateIntegers",
            params: {
              apiKey: randomOrgAPIKey,
              n: 1, // number of integers to generate
              min: 1,
              max: 10000000,
              replacement: false,
            },
            id: 42,
        },
    );

      console.log("Random.org API Response:", response.data);
  
      const randomID = response.data.result.random.data[0];
      return randomID;
    } catch (error) {
        console.error("Error generating random ID:", error);
        throw error;
    }
}

//check role  
function checkRole(req, res, next) {
    if(req.body.role === 'driver') {
      if(req.path === '/delivery' || req.path === '/login' || req.path === '/login') {
        next();
      } else {
        res.status(403).send('Access Denied'); 
      }
    } else {
        next();
    }
}

app.get('/healthandsafetyreport', checkRole, async (req, res) => {
    
});

  //random passcode for fridge
  function generatePasscode() {
    return Math.floor(100000 + Math.random() * 900000);
}

async function sendPasscodeToDriver(driverId, passcode) {
    try {
       
        const driver = await User.findById(driverId);
        if (!driver) {
            console.error('Driver not found');
            return;
        }

        const driverEmail = driver.email;
        
        const emailSubject = 'Passcode for External Door Access';
        const emailText = `Dear Driver,\n\nYour passcode for accessing the external door is: ${passcode}\n\nBest regards,\nThe Management`;
        
        await sendEmail(driverEmail, emailSubject, emailText);
    } catch (error) {
        console.error('Error sending passcode email:', error);
    }
}

// Endpoint to send email notification
app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await sendEmail(to, subject, text);
        if (result) {
            res.status(200).json({ message: 'Email sent successfully' });
        } else {
            res.status(500).json({ error: 'Failed to send email' });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to get email by user id
async function getEmailById(driverId) {
    try {
        const driver = await User.findById(driverId);
        if (driver) {
            return driver.email;
        } else {
            console.error('Driver not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching email by id:', error);
        throw error;
    }
}

async function sendPasscodeToDriver(driverId, passcode) {
    
    const driverEmail = getEmailById(driverId);

    if (!driverEmail) {
        console.error('Driver email not found');
        return;
    }

    // Send passcode to driver's email
    const emailSubject = 'Passcode for External Door Access';
    const emailText = `Dear Driver,\n\nYour passcode for accessing the external door is: ${passcode}\n\nBest regards,\nThe Management`;
    
    sendEmail(driverEmail, emailSubject, emailText);
}

// Function to send email
async function sendEmail(to, subject, text) {
}

// Endpoint to request access to the external door
app.post('/requesting-access', checkRole, cors(), async (req, res) => {
    const driverId = req.body.userId;

    // Generate a passcode for the driver
    const passcode = generatePasscode();

    // Send the passcode to the driver via email
    sendPasscodeToDriver(driverId, passcode);

    res.status(200).json({ message: 'Passcode sent successfully' });
});

// Endpoint to verify the passcode and grant access to the external door
app.post('/verify-passcode', checkRole, async (req, res) => {
    const driverId = req.body.driverId;
    const passcode = req.body.passcode;

    try {
        if (await isValidPasscode(driverId, passcode)) {
            // Grant access to the external door
            grantAccessToDoor(driverId);
            res.status(200).json({ message: 'Access granted' });
        } else {
            res.status(403).json({ message: 'Invalid passcode' });
        }
    } catch (error) {
        console.error('Error verifying passcode:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Function to verify the passcode
async function isValidPasscode(driverId, passcode) {
    try {
        // Query the Passcode collection to find a matching entry
        const passcodeEntry = await Passcode.findOne({ driverId, passcode });
        
        // If passcodeEntry is not null, it means a matching entry was found
        return passcodeEntry !== null;
    } catch (error) {
        console.error('Error checking passcode:', error);
        throw error;
    }
}

// Function to grant access to the external door
function grantAccessToDoor(driverId) {
    console.log(`Granting access to the external door for driver ID: ${driverId}`);
}

// places order and adds item to fridge
app.post('/order', async (req, res) => {
    const { username, role, orderItemName, orderQuantity } = req.body;

    const user = username;
    const userRole = role;
    
    try {

        do {
            randomID = await generateRandomID();
        } while (await orderItem.findOne({ orderId: randomID }));

        expiry = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));

        const newOrder = new orderItem({
            orderId: randomID,
            name: orderItemName,
            quantity: orderQuantity,
            username: user,
            role: userRole,
            expiryDate: expiry.toLocaleDateString({
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        });

        await newOrder.save();

        itemExists = await fridgeItem.findOne({name: orderItemName});

        
        do {
            randomID = await generateRandomID();
        } while (await fridgeItem.findOne({ itemId: randomID }));

        const newItem = new fridgeItem({
            itemId: randomID,
            name: orderItemName,
            quantity: orderQuantity,
            username: user,
            role: userRole,
            passcode: generatePasscode(),
            expiryDate: expiry.toLocaleDateString({
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        });

        await newItem.save();

        const newActivity = new activity({
            status: "added",
            orderId: randomID,
            itemId: randomID,
            name: orderItemName,
            quantity: orderQuantity,
            username: user,
            role: userRole,
            expiryDate: expiry.toLocaleDateString({
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        });
        
        await newActivity.save();
        
        res.json({
            status: "orderplaced",
            itemId: randomID,
            item: orderItemName,
            quantity: orderQuantity,
            username: user,
            role: userRole
        });
    } catch (err) {
        res.json("ordernotplaced");
        console.error("Error placing order", err);
    }
});

app.patch('/fridge', checkRole, async (req, res) => {
    const { itemId, removeQuantities } = req.body;

    try {
        const item = await fridgeItem.findOne({itemId:itemId});

        if (!item) {
            res.json({
                status:"quantitynotremoved"
            })
         }
        else if (item.quantity < removeQuantities) {
            res.json("removequantityexceeds")
        }
        else if (item && item.quantity >= removeQuantities) {

            const newActivity = new activity({
                status: "quantity removed",
                itemId: itemId,
                name: item.name,
                quantity: removeQuantities,
                username: item.username,
                role: item.role,
                expiryDate: item.expiryDate
            });
            
            await newActivity.save();

            const updateQuantity = await fridgeItem.findOneAndUpdate(
                {itemId:itemId}, 
                {$inc: {quantity: - removeQuantities}}, 
                {new: true}
            );

            res.json({
                status:"quantityremoved",
                updateQuantity
            });
        }
    } catch (err) {
        console.error(err)
        res.status(500).send(err);
    }
});

//delete item from fridge
app.delete('/fridge/:itemId', checkRole, async (req, res) => {
    const { itemId } = req.params;

    try {

        const item = await fridgeItem.findOne({itemId:itemId});

        const newActivity = new activity({
            status: "deleted",
            itemId: itemId,
            name: item.name,
            quantity: item.quantity,
            username: item.username,
            role: item.role,
            expiryDate: item.expiryDate
        });

        await newActivity.save();

        const deleteItem = await fridgeItem.deleteMany({itemId:itemId});

        if (!deleteItem) {
            res.status(404).send('Item not found');
        }
        else {
            await fridgeItem.deleteMany({itemId:itemId})
            res.json({
                status:"itemdeleted"
            })
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get all items in the fridge
app.get('/fridge', checkRole, async (req, res) => {
    try {
        const items = await fridgeItem.find()
            // orders by expiry date
            .sort({expiryDate: +1});

        res.send(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/order', checkRole, async (req, res) => {
    try {
        const items = await orderItem.find()
            // orders by newest created
            .sort({createdAt: -1});

        if (items.length > 0) {
            res.send(items);
        } else {
            res.status(404).send('No items found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/activity', checkRole, async (req, res) => {
    try {
        const activityData = await activity.find()
            .sort({createdAt: -1});
        if (activityData.length > 0) {
            res.send(activityData);
        } else {
            res.status(404).send('No activity found');
        }
    } catch (error) {
        
    }
});

app.post("/healthandsafetyreport", checkRole, async (req, res) => {
    const { username, role, reportTitle, reportInformation } = req.body;

    try {
        const newReport = new healthAndSafetyReportItem({
            username: username,
            role: role,
            reportTitle: reportTitle,
            reportInformation: reportInformation
        });

        await newReport.save();
        res.json({status: "healthandsafetyreportcreated"});
    } catch (error) {
        res.json("healthandsafetyreportnotcreated");
    }
});


  //delivery screen
  app.get('/delivery', (req,res) => {
    Delivery.find({}, (err, deliveries) =>{
        if (err){
            return res.status(500).send(err);
        }

    res.render('delivery',{
        deliveries: deliveries
    });
    });
  });

  //const order = await Delivery.findById(orderId);

  app.post('/log-damaged-missing-item', async (req, res) => {
    try {
        const { itemId, description, userId } = req.body;
        const itemLog = new DamagedMissingItem({ itemId, description, userId });
        await itemLog.save();
        res.status(201).send(itemLog);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post('/delivery-report', async (req, res) => {
    try {
        const { deliveryId, driverId, status, comments } = req.body;
        const deliveryReport = new DeliveryReport({ deliveryId, driverId, status, comments });
        await deliveryReport.save();
        res.status(201).send(deliveryReport);
    } catch (error) {
        res.status(400).send(error);
    }
});

//update the fridge items
app.patch('/fridge/:id', async (req, res) => {
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
    app.listen(5000, () => {
        console.log("BudFridges is running on port 5000")
    })
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err)
})