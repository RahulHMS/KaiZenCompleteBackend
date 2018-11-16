/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/30
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/
'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const docSchema = mongoose.Schema({
    registerObj:Object,
    Email: { type: String, unique: true },
    Password: String,   
    userID:String,
    UserType:String,
    Specialization:String,
    startedPractice:Number,
    location:String,
    created_at: Date
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hms:hms123@ds151513.mlab.com:51513/hms',{ useNewUrlParser: true } );

module.exports = mongoose.model('doc', docSchema);