import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import connectToMongodb from './db/mongodb';
import { authEndUserMiddleware, authSenderMiddleware } from './middleware/auth';
import endUserRouter from './routers/end';
import senderRouter from './routers/sender';
const mainRouter = express.Router();
dotenv.config();
connectToMongodb()
const app: Application = express();
const port = process.env.PORT || 8000;
app.use(morgan('dev'))
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
endUserRouter.use('/public', express.static(path.join(__dirname, process.env.NODE_ENV === "production" ? '../public' : 'public')))
mainRouter.use('/end-user', authEndUserMiddleware, endUserRouter)
mainRouter.use('/sender', authSenderMiddleware, senderRouter)
app.use(process.env.NODE_ENV === "production" ? '/city-park-lot/api' : '/', mainRouter)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});