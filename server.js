const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8000;
const secrest = require('./secret.json');
const { Pool } = require('pg');
const connection = new Pool(secrest);
const cron = require('node-cron');
const { json } = require('express/lib/response');

const getAllUsers = async (req, res) => {
    const query = `select * from users`;
    const result = await connection.query(query);
    return await res.send(result.rows);
}

const rotateUsers = async () => {

   const rotationQuery = `UPDATE 
  tasks t
SET
  starting_date = NOW(),
  user_id = 
     COALESCE(
        (SELECT id FROM users WHERE group_id = g.id and id > COALESCE(t.user_id, 0) LIMIT 1), /*get the next user*/
        (SELECT min(id) FROM users WHERE group_id = g.id) /*go back to first user*/
     ),
  task_completed = false
FROM 
  tidy_group g
WHERE
  t.group_id = g.id 
  AND NOW() >= t.starting_date + (
     CASE 
        WHEN g.frequency = 'weekly' THEN INTERVAL '7' DAY
        WHEN g.frequency = 'biweekly' THEN INTERVAL '14' DAY
        ELSE interval '30' DAY 
     END)`;

   console.log('Starting rotate users job')    
   await connection.query(rotationQuery);
   console.log('Rotate users job has ended')
}

app.use(bodyParser.json());
app.get('/users', getAllUsers);
cron.schedule('0 1 * * *', rotateUsers);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))