import bodyParser from "body-parser";
dotenv.config({path:'./config.env'});
const PORT = process.env.PORT || 5000;
import cors from 'cors'
import apis from './router/apis.js'
import dotenv from "dotenv";
import express from "express";

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(cors());
import cookieParser from 'cookie-parser'

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(apis);

app.listen(PORT, ()=>{
    console.log('server is running at port '+ PORT);
})