import pool from "../db.js";
import express from "express";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import protect from "../middleware/auth.js";
import jwt from 'jsonwebtoken';
dotenv.config();
const router = express.Router()

const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV ==='production',//sends only https in production
    sameSite: 'Strict', //prevent srf attacks
    maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
}

const generateTokens =  (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET , {
        expiresIn : '30d'
    });
}

//route for create user
router.post("/Register", async(req, res) => {
    const {email, password, username} = req.body;

        const userExist = await pool.query("SELECT * FROM  data WHERE email = $1", [email]);
        if(userExist.rows.length > 0){
            return res.status(400).json({message: "User already Exist"})
        }
      
        //hash password of registered user, if user do not exist
        const hashPassword = await bcrypt.hash(password, 10);

        const createUser = await pool.query(
            "INSERT INTO data (email, password, username) VALUES ($1, $2, $3) RETURNING id, email, username, password",
            [email, hashPassword, username]);
    
        // generating token to user
        const token = generateTokens(createUser.rows[0].id);
        res.cookie('token', token, cookiesOptions); //this is express function to set cookie to browser 

        return res.status(201).json({user: createUser.rows[0] }); // here we returns only id, username & email to frontent 
         
});

//login route
router.post("/login", async(req, res) => {
    const { email, password } = req.body; // Changed: only email, not username
    
    if(!email || !password){
        return res.status(400).json({message: "Email and password are required"});
    }

    try {
        // Query user by email
        const checkUser = await pool.query("SELECT * FROM data WHERE email = $1", [email]);
        
        if(checkUser.rows.length === 0){
            return res.status(401).json({message: "Invalid credentials"});
        }
        
        const userData = checkUser.rows[0];
        
        // ✅ Compare with the actual password column
        const passMatch = await bcrypt.compare(password, userData.password);
        
        if(!passMatch){
            return res.status(401).json({message: "Invalid credentials"});
        }
        
        // Generate token
        const token = generateTokens(userData.id);
        res.cookie('token', token, cookiesOptions);
        
        return res.status(200).json({
            user: { 
                id: userData.id, 
                username: userData.username, 
                email: userData.email ,
                password: userData.password
            }
        });
        
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({message: "Server error"});
    }
});


//route to get data of logedin user but this route must be protected
router.get("/me", protect, async(req, res) => {
    res.json(req.user);
})

router.put("/update:id", protect, async(req, res) => {
 const userId = req.user.id;
 const{username, password, email, id} = req.body;

 if(parseInt(id) !== userId){
    return res.status(400).json({message: "Not authorized"});
 }

 //query to update user details 

 const updateUser = pool.query(
     "UPDATE data SET username = $1, password = $2, WHERE id = $3 RETURNING  email, username, id",
     [id],
     [email],
     [username]
 );

if(updateUser.rows.length === 0){
    return res.status(404).json({
        message: "Not user updated"
    });
}

res.json(updateUser.rows[0]);
})

//delete route

router.delete("/delete:id" ,protect, (req, res) => {
    const userId = req.user.id;
    const {username , email} = req.body;

    
})

//logout route
router.post("/logout", (req, res)=> {
    res.cookie('token', '', { ...cookiesOptions, maxAge: 1});
    res.json({message: "Logged out successfully"});
})

export default router;