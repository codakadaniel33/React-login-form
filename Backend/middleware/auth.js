import jwt from 'jsonwebtoken'
import pool  from '../db.js'


const protect  = async(req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(400).json({message: "No token found"});
        }

        //if token of user now have found
        const decoced = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query("SELECT id, username, email FROM data WHERE id = $1", [decoced.id]);
        
        if(user.rows.length === 0){
            return res.status(400).json({message: "Not authorized, No token"});
        }

        req.user = user.rows[0];
        next();
        
    } catch (error) {
        console.error("Not authorized , No token!");
        return res.status(400).json({message: "Not authorized , No token"});
    }
}

export default protect;