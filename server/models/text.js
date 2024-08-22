const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TextSchema = new Schema({
  article: { 
    type: Schema.Types.ObjectId,
    ref: 'article'
  },
  likes: { type: Number, default: 0 },
  paragraph: { type: String }
});

TextSchema.statics.like = function(id) {
  const Text = mongoose.model('text');

  return Text.findById(id)
    .then(text => {
      ++text.likes;
      return text.save();
    });
}

mongoose.model('text', TextSchema);