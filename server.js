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

    const dateQuery = `select starting_date from tasks where group_id=7`

    const dateResult = await connection.query(dateQuery);

    const dateResponse = dateResult.rows[0].starting_date;

    function addDays(date, days) {
        date.setDate(date.getDate() + days)
        return date;
    }

    // date from database plus 7 days 
    const newDate = addDays(dateResponse, 3);

    // current date
    const currentDate = new Date();

    console.log(newDate);
    console.log(currentDate);

    // we need to change the format of the date because just we want to match the days not the exactly hour
    if (newDate === currentDate) {
        console.log('Chnaging frequency!!!');
    } else {
        console.log('It is working but is not the date to change frequency!!');
    }


    // we should find a way to change the id of the group
    const frequencyQuery = `select frequency from tidy_group where id=7`;

    const result = await connection.query(frequencyQuery);

    // getting the exact value of the frequency
    const frequencyResult = result.rows[0].frequency

    // checking if the frequency match 
    if (frequencyResult === 'weekly') {
        console.log('It is working!!');
    } else {
        console.log('it is working but it is not weekly');
    }

    console.log('running a task every minute');
  });

app.use(bodyParser.json());
app.get('/users', getAllUsers);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))