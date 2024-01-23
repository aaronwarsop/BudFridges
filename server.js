const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.send("Yo")
})

app.listen(3000, () => {
    console.log("BudFridges is running on port 3000")
})