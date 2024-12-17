const express=require('express');
const mongoose=require('mongoose');
const cors=require("cors");

const userRouter=require('./routes/userRouter');
const taskRouter=require("./routes/taskRouter");

const { connectToMongoDB }=require('./connection');

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/assignment').then(()=> console.log("MongoDb Connected"));

app.use(express.json());
app.use(cors());
app.use('/auth',userRouter);
app.use("/task",taskRouter);

app.listen(PORT,()=> console.log(`Server Started at Port : ${PORT} `));