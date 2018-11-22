const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const promotionScheme =  new Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true
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

var Promotions = mongoose.model('Promotion', promotionScheme);

module.exports = Promotions;