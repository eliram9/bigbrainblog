const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SourceSchema = new Schema({
    sourceName: { type: String, required: true },
    url: {
        type: String,
        required: true,
        validate: {
        validator: function (v) {
            // Simple URL validation regex
            return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
        },
    },
});

// Register the model with Mongoose
mongoose.model('source', SourceSchema);