const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/second-project');

const User = require('../models/user-model.js');


const userArray = [
  {
    fullName: 'Tommy',
    username: 'tomcat',
    password: 'password1234'

  }

];
