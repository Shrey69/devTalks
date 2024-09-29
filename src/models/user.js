const mongoose  = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema(
    {
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
       
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    emailID: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email"+ value);
    
        }
    }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Require Strong Password"+ value);
        }
    },
},
    gender: {
        type: String,
        validate(val){
            if(!["male", "female", "others"].includes(val)){
                throw new Error("Invalid");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    skills: {
        type: [String]
    },
    about: {
        type: String,
        default: "about me..",
    },
    photoURL: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/21/21104.png",
    },

},{
    timestamp: true,
},)

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id}, "El@Camino$78", {expiresIn: "1d"})
    return token;
}

userSchema.methods.validatePassword = async function(passwordInput){
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInput, user.password)
    return isPasswordValid
}

const User = mongoose.model("User", userSchema);
module.exports = User;