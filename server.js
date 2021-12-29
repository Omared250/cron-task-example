const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8000;
const secrest = require('./secret.json');
const { Pool } = require('pg');
const connection = new Pool(secrest);

// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });



/* 

---- dentro de la funcion
- query : fecha de creacion, user_id, group_id, frequency (obtener la informacion exacta de cada columna antes mencionada)
- validacion de las frequencias fecha de creacion con fecha actual teniendo encuenta la frequencia escogida
- intercambio de roomies asignados a las diferentes tareas segun su group id

- intercambiar tareas entre los roomies del mismo grupo
- actualizar tabla task user_id
- segun la frecuencia que escogio el admin

*/

// CRON
const cron = require('node-cron');
const { json } = require('express/lib/response');

const getAllUsers = async (req, res) => {
    const query = `select * from users`;
    const result = await connection.query(query);
    return await res.send(result.rows);
}

cron.schedule('* * * * *', async () => {
    const query = `select frequency from tidy_group where id=1`;
    const result = await connection.query(query);
    const frequencyResult = result.rows[0].frequency;
    console.log(frequencyResult);
    console.log('running a task every second');
  });

app.use(bodyParser.json());
app.get('/users', getAllUsers);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))