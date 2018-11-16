const appointment=require("../models/appointments")
exports.timeTable=(userid,doctorId,date)=>{
    return new Promise((reslove,reject)=>{
        const appointment=new appointment({
            Date: date,
            DoctorID:doctorId,
            PatientID:userid
        })
        appointment.save()
        .then(results=>{
         resolve({status:200,message:"appointment booked successfully"})
        })
        .catch(err=>{
         console.log(err)
        })
    })

}