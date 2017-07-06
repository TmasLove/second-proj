const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myPostSchema = new Schema (
  {
    image: { data: Buffer, contentType: String},
    username: {type: String},
    image_path: {type: String}
  },
  {
    timestamp: true
  }
);



const PostModel = mongoose.model('Post', myPostSchema);

module.exports = PostModel;
