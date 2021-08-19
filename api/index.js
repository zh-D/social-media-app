const express = require('express')

const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")

// routes
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")

dotenv.config()

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));

// middleware
app.use(express.json()) // body parser,when you make a post request
app.use(helmet()) // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(morgan("common")) // HTTP request logger middleware for node.js

// controller
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

app.listen(8080, () => {
    console.log("Backend server is running!");
})