import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { login } from './src/api/login.js';
import { register } from './src/api/register.js';
import { authToken } from './src/auth/authToken.js';
import { loginToken } from './src/api/loginToken.js';


const app = express();
app.use(cors());
const jsonParser = bodyParser.json();

app.post('/api/login', jsonParser, login)
app.post('/api/register', jsonParser, register)
app.post('/api/loginToken', jsonParser, authToken, loginToken)


const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});