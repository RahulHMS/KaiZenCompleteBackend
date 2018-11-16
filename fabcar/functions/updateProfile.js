/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/28
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/

'use strict';
const user=require("../models/user")
const bcSdk=require("../sdk/invoke")

exports.updateProfile = (UserID, SessionId,  date,  Disease,  Medication,  FeesPaid,  documentType,  DocumentLink,  UploadDate,DoctorId) =>
  
{
   return new Promise(async(resolve, reject) => {
  let dec= await user.find({userID:UserID})
  console.log("console of array==================>",dec[0].AccessRights.length)
if (dec[0].AccessRights.length>0){

      var len=dec[0].AccessRights.length
      console.log("doctor is right========================>",dec[0].AccessRights[len-1].DoctorID== DoctorId)
      if(dec[0].AccessRights[len-1].DoctorID== DoctorId){     
     var Profile={UserID:UserID,
                SessionId:SessionId,
                Date:date,
                Disease:Disease,
                Medication:Medication,
                FeesPaid:FeesPaid,
                DocumentLink:DocumentLink,
                DocumentType:documentType,
                UploadDate:UploadDate
}
 
              
           let bcresult=await  bcSdk.UpdateProfile(Profile)
                 console.log("bcresult===================================>",bcresult)
                 try{
                 if(bcresult.status==200){
                 resolve({
                    status: 201,
                    message: 'patient profile updated.'
                })
            }
            else{
                return reject({
                    status:406,
                    message:"tx propossal was bad"
                })
            }
        }

            catch(err) {
                  

                    reject({
                        status: 500,
                        message: err
                    });
                
            };
}
}
else{
    resolve({status:401,
    message:"you are not authorized to update the profile...no request raised yet"})
}
    })
}