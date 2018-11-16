const schedule=require("../models/schedule")
exports.timeTable=(doctorid,mon,tues,wed,thurs,fri,sat,sun,location)=>{
    return new Promise((reslove,reject)=>{
        const schedule=new schedule({
            userID:doctorid,
            Monday:mon,
            tuesday:tues,
            wednesday:wed,
            thursday:thurs,
            friday:fri,
            saturday:sat,
            sunday:sun,
            location:location
        })
        schedule.save()
        .then(results=>{
         resolve({status:200,message:"schedule created successfully"})
        })
        .catch(err=>{
         console.log(err)
        })
    })

}