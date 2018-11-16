/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/13
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/

var user=require('../models/user')
exports.approveRequest=(status,_id)=>{
console.log(_id,status)
return new Promise((resolve,reject)=>{


user.findById({_id:_id})
.then(results=>{
    if(!results){
        resolve({status:404,
        message:"invalid patient credentials"})
    }
    console.log("results========================>",results)
   let  last=results.AccessRights.length
   if(last==0){
       resolve({status:402,
    message:"no request has been raised to approve"})
   }
   console.log("length of array================>",last)
    results.AccessRights[last-1].RequestStatus=status
    user.findByIdAndUpdate({_id:_id},{$set:{AccessRights:results.AccessRights}},{new:true}).then(finResult=>{
        resolve({status:200,message:"request has been approved please ask doctor to view and update the profile"})
        
    })

}).catch(err=>{
    console.log("errooorrr==============================>",err)
})
})
}
