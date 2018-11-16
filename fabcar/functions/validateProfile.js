/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/28
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/

'use strict';
const bcSdk=require("../sdk/invoke")

exports.validateProfile = (status,userId) =>

    new Promise((resolve, reject) => {

             bcSdk.validateProfile(status,userId).then(bcresult=>{
                 console.log("bcresult===================================>",bcresult)
                 
                 if(bcresult.status==200){
                 resolve({
                    status: 201,
                    message: 'patient profile validated...patient enrolled to KAIZEN blockchain network'
                })
            }
            else{
                return reject({
                    status:406,
                    message:"tx propossal was bad"
                })
            }
             })


            .catch(err => {
                  

                    reject({
                        status: 500,
                        message: err
                    });
                
            });
    });
    