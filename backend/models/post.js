import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({

    caption: {
        type:String,
        required: true,
    },

    image:{
        public_id: String,
        url: {
            type:String,
            required: true,
        }
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    createdAt:{
        type: Date,
        default: Date.now,
    },

    likes:[
        {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        },
    ],

    Comments:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            Comment:{
                type: String,
                required: true,
            }
        }
    ]

});

const postModel = mongoose.model("post", postSchema)

export default postModel