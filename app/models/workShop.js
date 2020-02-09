const mongoose = require('mongoose')


const workShopSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required:true
    },
    time:{
        type: String,
        // required: true
    },
    location:{
        type: String,
        required: true

    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('WorkShop',workShopSchema)