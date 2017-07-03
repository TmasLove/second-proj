const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/second-project');

const User = require('../models/user-model.js');


const myUserArray = [
  {
    fullName: 'Tommy',
    username: 'Admin',
    password: 'admin'

  }

];
