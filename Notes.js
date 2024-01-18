const mongoose = require('mongoose');
const { Schema } = mongoose;
const NotesSchema = new Schema({
    // yha par hum yh isly use kar rhe hai isse yh pta lgega ki konsi id ke notes hme mil rhe hai
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    tag:{
        type: String,
        required: false,
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Notes', NotesSchema);