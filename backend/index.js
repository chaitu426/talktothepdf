import express from 'express';
import pdfRoute from './routes/pdf.route.js';
import chatRoute from './routes/chat.route.js';
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "https://talktothepdf.vercel.app",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

//routes
app.use('/api/pdf', pdfRoute);
app.use('/api/chat', chatRoute);


app.listen(3000, () => {
  console.log('Server is running on port 3000')
});