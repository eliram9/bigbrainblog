const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String },
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
      const text = new Text({ paragraph, article })
      article.texts.push(text)
      return Promise.all([text.save(), article.save()])
        .then(([text, article]) => article);
    });
}

ArticleSchema.statics.findTexts = function(id) { // Replaces 'findLyrics'
  return this.findById(id)
    .populate('texts')
    .then(article => article.texts);
}

mongoose.model('article', ArticleSchema);