const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true }, 
  createdDate: {
    type: Date,
    default: Date.now // Automatically sets the date when a new document is created
  },
  openingImageUrl: { 
    type: String,
    required: false, // Optional if not every article needs an image
    validate: {
      validator: function(v) {
        // Validate both image URLs and Giphy GIFs
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v) || 
               /^https:\/\/media\.giphy\.com\/media\/[a-zA-Z0-9]+\/giphy\.gif(\?.*)?$/.test(v);
      },
      message: props => `${props.value} is not a valid image or Giphy GIF URL!`
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['EMDR Therapy General', 'EMDR for Trauma and PTSD', 'EMDR for Anxiety and Stress', 'EMDR and ADHD', 'EMDR Success Stories'], // Restrict to these 5 options
    message: 'Category is not valid.'
  },
  summary: {type: String, required: true},
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  texts: [{
    type: Schema.Types.ObjectId,
    ref: 'text'
  }],
  sources: [{
    type: Schema.Types.ObjectId,
    ref: 'source'
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