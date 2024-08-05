import express from 'express';
const Route = express.Router();
const user = require('./user');
const admin = require('./admin')

for (const property in user) {
  Route.use('/user', user[property]);
}

for(const property in admin){
  Route.use('/admin', admin[property])
}

export default Route;