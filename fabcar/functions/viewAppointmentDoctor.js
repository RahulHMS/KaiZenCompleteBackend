const appointment=require("../models/appointments")
exports.viewAppointment=(userid,date)=>{
    return new Promise((reslove,reject)=>{
      
        appointment.find( { $and: [{DoctorID:userid}, {Date:date}] })
        .then(results=>{
            console.log(results)
         resolve({status:200,message:"appointment booked successfully"})
        })
        .catch(err=>{
         console.log(err)
        })
    })

}