//main entry point for backend server
import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';
import connectionRoutes from './routes/connection.js';
import cors from 'cors';

const app = express();
dotenv.config();

//app.get('/', (req, res)=>{
 //res.send("Hello world")
//})
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    credentials: true
}));

app.use("/api/auth", connectionRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    
})

export default app
