import './config/db.js';
import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;



app.use(express.json());
app.use(cors());




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
    console.error("Failed to start server:", err);
});
