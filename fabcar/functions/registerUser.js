/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/28
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/


'use strict';


const user = require('../models/user');
const bcSdk=require("../sdk/invoke")

exports.registerUser = (registerObj,Email,Password,Type,userID) =>

    new Promise((resolve, reject) => {
    
 

        const newUser = new user({
           registerObj: registerObj,
           Email:Email,
           Password:Password,
           userType:Type,
           userID:userID,
          created_at: new Date(),
           });
      
        newUser.save().then(() =>{
             bcSdk.createUser(registerObj,userID).then(bcresult=>{
                 console.log("bcresult===================================>",bcresult)
                 
                 if(bcresult.status==200){
                 resolve({
                    status: 201,
                    message: 'patient profile created...patient enrolled to KAIZEN blockchain network'
                })
            }
            else{
                return reject({
                    status:406,
                    message:"tx propossal was bad"
                })
            }
             })
            
            
     } )

            .catch(err => {
                if (err.code == 11000) {

                    reject({
                        status: 409,
                        message: 'User Already Registered !'
                    });

                } else {

                    reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            });
    });
    