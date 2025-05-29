const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.listen(5000, () => {
    console.log("Servidor corriendo en http://localhost:5000");
});
