const doctors=require("../models/doctors")
exports.getDoctors=()=>{
    return new Promise((reslove,reject)=>{
      
        doctors.find({})
        .then(results=>{
            console.log(results)
            reslove({status:200,message:results})
        })
        .catch(err=>{
         console.log(err)
         reject (err)
        })
    })

}