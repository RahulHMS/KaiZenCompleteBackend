/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/23
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/
'use strict';
var bcSdk =require("../sdk/query")
var user=require("../models/user")
exports.readProduct=(key,patientID)=>{
  console.log(key,patientID)
      return new Promise(async(resolve, reject) => {
        if(!patientID){
       
          bcSdk.readProduct(key)
          .then(results =>{
              console.log(results)
           resolve({ "status":results.status, "message": results })
           }).catch(err=>{
               console.log(err)
               reject({status:500,message:err})
           })
        
          }else{

          let dec= await user.find({userID:patientID})
                if (dec[0].AccessRights.length>0){
            var len=dec[0].AccessRights.length
            console.log("doctor is right========================>",dec[0].AccessRights[len-1].DoctorID== key)
                if(dec[0].AccessRights[len-1].DoctorID == key){     
                 bcSdk.readProduct(patientID)
               .then(results =>{
                   console.log(results)
    resolve({ "status":results.status, "message": results })
    }).catch(err=>{
        console.log(err)
        reject({status:500,message:err})
    })
                  }else{
                    resolve({status:200,message:"request not raised by this doctor"})
                        }
                 }else{
                       resolve({status:402,
                       message:"doesnt have any requests raised"
                      })
                      }
       }   
  })

      
}


