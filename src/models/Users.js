
'use strict';
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    status:{
        type:Number,
        default: 0
    }
})

const UserSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    
    phone:{
        type: String,
    },
    role: RoleSchema,
    access_token:{
        type: String,
    },
    followers: {
        type: Array,
        default: [],
      },
    followings: {
        type: Array,
        default: [],
      },
    Title:{
        type:String
    },
    userId: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        max: 500,
      },
      img: {
        type: String,
      },
      likes: {
        type: Array,
        default: [],
      },
      unlikes:{
        type: Array,
        default:[]
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      comments:{
        type:String,
        require: true,
      }
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
module.exports = mongoose.model('Users', UserSchema);