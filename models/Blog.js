const mongoose = require('mongoose');
const debug = require('debug')('models:blog');
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  _user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Blog', blogSchema);
