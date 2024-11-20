import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please enter a name"],
    },

    avatar: {
        public_id: String,
        url: String,
    },

    email:{
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "Email already exists"],
    },

    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "password must be 6 characters long"],
        select: false,
    },

    posts: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "post",
        },
    ],

    followers: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "post",
        },
    ],

    following: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "post",
        },
    ],

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});


userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log(resetToken);     //debug 
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    console.log(this.resetPasswordToken);   //debug
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};


const userModel = mongoose.model("user", userSchema)

export default userModel