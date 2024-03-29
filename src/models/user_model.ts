import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true,
    },
    refresh_tokens:{
        type: [String]
    },
    avatar_url:{
        type: String,
        required: true,
    }
})

export = mongoose.model('User', userSchema)
