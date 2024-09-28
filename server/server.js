import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import connect from './database/connection.js';
import router from './router/route.js';

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))
app.disabled('x-powered-by'); //less hackers know about our stack

const port = 8080;


//`api routes 

app.use('/api', router)

/// start server only when a have valid connection
connect().then(() => {
   try {
      //start server
      app.listen(port, () => {
         console.log(`server running on ${port}`)
      })
   } catch (error) {
      console.log('Cannot connect to the server')
   }
}).catch(error => console.log(`Invalid databse connection,${error}`))

