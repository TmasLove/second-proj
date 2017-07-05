const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myUserSchema = new Schema (
  {     //1st argument -> structure object
    firstName: {type: String},
    lastName: {type: String},
    email: { type: String },
    username: {type: String},

    //SIGN UP/LOG IN FORM users --------
    encryptedPassword: {type: String},

    //FACEBOOK users----------------------
    facebookId: {type: String},


  },
  {     // 2nd argument -> additional settings
    timestamps: true
        //timestamps creates two additional fields: "createdAt" & "updatedAt"
  }
);

const UserModel = mongoose.model('User', myUserSchema);

module.exports = UserModel;
