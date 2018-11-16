/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/23
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/

'use strict';


const doctor = require('../models/doctors');
const bcSdk=require("../sdk/invoke")

exports.register = (registerObj,Email,Password,userID,Type,speciality,location,startedPractice) =>{

    return new Promise((resolve, reject) => {
    
 

        const newDoctor = new doctor({
           registerObj: registerObj,
           Email:Email,
           Password:Password,
           userType:Type,
           userID:userID,
           Specialization:speciality,
           location:location,
           startedPractice:startedPractice,
          created_at: new Date(),
           });
      
           newDoctor.save()
                        
            .then(() => resolve({
                status: 201,
                message: "your profile has been created"
            }))

            .catch(err => {
                if (err.code == 11000) {

                    resolve({
                        status: 409,
                        message: 'User Already Registered !'
                    });

                } else {

                    reject({
                        status: 500,
                        message: 'Something Went Wrong!'
                    });
                }
            });
    })
}
