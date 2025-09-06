import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const app = express();
app.use(cors()); app.use(express.json()); app.use(morgan('dev'));
app.get('/api/health', (req,res)=>res.json({ status:'ok' }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log('Server running on', PORT));
