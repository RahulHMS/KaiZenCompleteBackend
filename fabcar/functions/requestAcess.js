/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/28
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/

var users=require('../models/user')
var doc=require('../models/doctors')
exports.requestAcess=(docID,patientId)=>{
    return new Promise(async(resolve, reject) => {
        var doctordetails=await doc.find({userID:docID})
        console.log("doctor details==============>",doctordetails)
        var approeve={
            Doctor : doctordetails[0].registerObj.Name,
            DoctorID : docID,
            RequestStatus:"RequestInitialted"
        }
    
        users.findOneAndUpdate({userID:patientId},{ $push: { AccessRights: approeve }}, {new: true}).then(results=>{
            console.log(results)
            resolve({
                status:200,
                message:"request sent successfully,tell the patient to approve it"
            })
        })
        .catch(err=>{
           console.log("console=====================================>",err)
        })
        })
}