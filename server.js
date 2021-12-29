const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8000;
const secrest = require('./secret.json');
const { Pool } = require('pg');
const connection = new Pool(secrest);

const getAllUsers = async (req, res) => {
    const query = `select * from users`;
    const result = await connection.query(query);
    return await res.send(result.rows);
}

app.use(bodyParser.json());
app.get('/users', getAllUsers);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))