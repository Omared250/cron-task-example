const express = require('express');
const app = express();
const PORT = 8000;
const secrest = require('./secret.json');
const { Pool } = require('pg');
const connection = new Pool(secrest);




app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))