const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const leaderScheme =  new Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String
    },
    description: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false
    }
},{

    timestamp: true
});

var Leaders = mongoose.model('Leader', leaderScheme);

module.exports = Leaders;