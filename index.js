const connectToMongo = require('./db');
const express = require('express');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const dotenv = require('dotenv');
var cors = require('cors')

dotenv.config();
connectToMongo();
const app = express();

app.use(express.json());
app.use(cors());
 
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.listen(5000, ()=>{
    console.log('listening at port 5000');
})