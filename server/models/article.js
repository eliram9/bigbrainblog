const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true }, // Added 'required' for better data integrity
  author: { type: String, required: true }, 
  createdDate: {
    type: Date,
    default: Date.now // Automatically sets the date when a new document is created
  },
  openingImageUrl: { 
    type: String,
    required: false, // Set to true if every article must have an image
    validate: {
      validator: function(v) {
        // Simple URL validation
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v);
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  texts: [{
    type: Schema.Types.ObjectId,
    ref: 'text'
  }]
});

ArticleSchema.statics.addText = function(id, paragraph) {
  const Text = mongoose.model('text');

  return this.findById(id)
    .then(article => {
      const text = new Text({ paragraph, article });
      article.texts.push(text);
      return Promise.all([text.save(), article.save()])
        .then(([text, article]) => article);
    });
}

ArticleSchema.statics.findTexts = function(id) {
  return this.findById(id)
    .populate('texts')
    .then(article => article.texts);
}

mongoose.model('article', ArticleSchema);