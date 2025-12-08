import express from "express";
import dotenv from "dotenv"   ;
import { sql } from "./config/db.js";
 
dotenv.config();


const app = express();
// //middleware
// app.use(express.json());
// app.use((req,res,next) =>{
//     console.log("Hey we hit a req, the method is",req.method)
//     next();
// });
const PORT = process.env.PORT || 5000;

async function initDB() {

    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            category_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        console.log("DB Initialized successfully!!");  
    } catch (error) {
        console.log("Error intializing DB ", error);
        process.exit(1); // status code 1 means failure, 0 success
    }
}
app.get("/", (req,res) => {
    res.send("It is working..")
   
})


app.get("/", (req, res) => {
   res.send("It is working 123");
});

app.post("/api/transactions"    , (req, res) => {
    //title,amount,catagorey,useid
try {
    const {title, amount,catagoryy,user_id} = req.body;
    
} catch (error) {
    
}
})



initDB().then(() => {
app.listen(PORT, () => {
   console.log("Server is up and running on port", PORT  );
});
});