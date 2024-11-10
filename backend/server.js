import './config/db.js';
import express from 'express';
import cors from 'cors';
import AutRoutes from './routes/Auth.js';
const app = express();
const port = 3000;



app.use(express.json());
app.use(cors());

app.use('/auth', AutRoutes)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
    console.error("Failed to start server:", err);
});
