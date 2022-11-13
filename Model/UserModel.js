const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    hashed_password:{
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    salt: String
},{timestamps: true})

// virtual field
UserSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(this._password)
})
.get(function(){
    return this._password
})

// methods
UserSchema.methods = {
    authenticate: function(password){
        return this.hashed_password === this.encryptPassword(password)
    },
    encryptPassword: function(password){
        if(password==null){
            return ''
        }
        try{
            return(this.hashed_password = crypto.createHmac('sha1', this.salt))
            .update(password)
            .digest('hex')
        }
        catch(error){
            return ''
        }
    },
    
}

module.exports = mongoose.model("User",UserSchema)