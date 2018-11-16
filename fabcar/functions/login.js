/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/13
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/

'use strict';

const user = require('../models/user');

exports.loginUser = (Email, Password) =>

    new Promise((resolve, reject) => {



        user.find({
                "Email": Email
            })
            .then(users => {
            if(users.length==0){
                resolve({
                    status:409,
                    "message":"kindly register to kyzen network"
                })
            }
                const dbpin = users[0].Password;
                console.log(Password);
                console.log(dbpin);

                if (String(Password) === String(dbpin)) {

                    resolve({
                        status: 200,
                        users: users[0]
                    });

                } else {

                    reject({
                        status: 402,
                        message: ' email or password wrong!'
                    });
                }
            })


            .catch(err => reject({
                status: 500,
                message: 'internal server error!'
            }));


    });