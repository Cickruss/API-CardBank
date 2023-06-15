const express = require("express")
const cors = require("cors")
const app = express()
const bodyParser = require('body-parser');

const PORT = 3000
const HOST = '0.0.0.0'
app.use(cors())

app.use(express.json())
app.use(bodyParser.json());

const conn = require("./db/conn")
conn()

const routes = require("./routes/router")
app.use("/api", routes)

app.listen(PORT, HOST)
