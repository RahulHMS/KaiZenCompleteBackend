/**
 * Web Service(for Health Managment System)
 * Created and Developed by Rahul M. Desai on 2018/10/22
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/



'use strict';


const jwt = require('jsonwebtoken');
var crypto = require('crypto');
var cors = require('cors');


const register = require('./functions/registerUser');
const registerDoctor=require('./functions/registerDoctor')
const updateProfile=require("./functions/updateProfile")
const login = require('./functions/login');
const loginDoctor=require('./functions/loginDoc')
const config = require('./config/config.json');
const readProduct=require('./functions/readProduct');
const range = require('./functions/range');
const requestAcess=require('./functions/requestAcess');
const approveRequest=require('./functions/approveAccess');
const timeTable=require('./functions/timeTable');
const bookAppointment=require('./functions/bookAppointment');
const viewAppointmentDoctor=require("./functions/viewAppointmentDoctor")
const viewAppointmentPatient=require("./functions/viewAppointmentPatient")
const getDoctors= require("./functions/getDoctors")


module.exports = router => {

//=============================Registration for Patient===========================================//
	router.get('/', (req, res) => res.end('Welcome to hms!'));

router.post('/registerPatient', cors(),function(req,res)
{

const registerObj = req.body.registerObj;
const Email = req.body.Email;
 const Password = req.body.Password;
const userID = crypto.createHash('sha256').update(Email).digest('base64'); // unique Id generation
console.log("rapidID",userID);
var Type = req.body.UserType;
console.log(Type);
if (!Email || !Password) {

            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {

            register.registerUser(registerObj,Email,Password,Type,userID)

            .then(result => {
                console.log(result)
                   res.status(result.status).json({
                        message: result.message
                      
                    });

                })
                .catch(err => res.status(err.status).json({message: err.message}).json({status: err.status}));
        }
    });
//====================================doc register=====================================================//
router.post('/registerDoctor', cors(),function(req,res)
{

const registerObj = req.body.registerObj;
const Email = req.body.Email;
 const Password = req.body.Password;
const userID = crypto.createHash('sha256').update(Email).digest('base64'); //uniqueId generation
console.log("rapidID",userID);
var Type = req.body.UserType;
var speciality=req.body.speciality
var location=req.body.location
var startedPractice=req.body.startedPractice;
console.log(Type);
if (!Email || !Password) {

            res.status(400).json({
                message: 'Invalid Request !'
            });

        } else {

            registerDoctor.register(registerObj,Email,Password,userID,Type,speciality,location,startedPractice)

            .then(result => {
                console.log(result)
                   res.status(result.status).json({
                        message: result.message
                      
                    });

                })
                .catch(err => res.status(err.status).json({message: err.message}).json({status: err.status}));
        }
    });

  //===========================login=========================================//
      router.post('/loginUser',  cors(),(req, res) => {

        const Email = req.body.Email;

        const Password = req.body.Password;


        if (!Email) {

            res.status(400).json({
                message: 'Invalid Request !'
            });


        } else {

            login.loginUser(Email, Password)

            .then(result => {
                   console.log(result)
                    const token = jwt.sign(result, config.secret, {
                        expiresIn: 60000000000
                    })

  
                    res.status(result.status).json({
                        message: result.message,
                        token: token
                       
                    });
                    
          
                })
                 .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
   
        });
//=========================login doctor========================================================================================//
router.post('/loginDoctor',  cors(),(req, res) => {

    const Email = req.body.Email;

    const Password = req.body.Password;


    if (!Email) {

        res.status(400).json({
            message: 'Invalid Request !'
        });


    } else {

        loginDoctor.loginUser (Email, Password)

        .then(result => {
               console.log(result)
                const token = jwt.sign(result, config.secret, {
                    expiresIn: 60000000000
                })


                res.status(result.status).json({
                    message: result.message,
                    token: token
                   
                });
                
      
            })
             .catch(err => res.status(err.status).json({
            message: err.message
        }));
    }

    });
  // //============================================update profile by doctor=================================================================//
     router.post("/updateprofile",cors(),(req,res)=>{
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
} 
      var DoctorId1=getAddress(req)    
var DoctorId=DoctorId1.users.userID
console.log(DoctorId)
var UserID=req.body.UserID
 var SessionId=makeid()
var date=req.body.date
 var Disease=req.body.Disease
var Medication=req.body.Medication
var FeesPaid=req.body.FeesPaid
var DocumentLink=req.body.DocumentLink
var documentType=req.body.documentType
var UploadDate =req.body.UploadDate
if(!UserID||!Disease){
    res.status(401).json({message:"missing fields"})
}
updateProfile.updateProfile(UserID,  SessionId,  date,  Disease,  Medication,  FeesPaid,  documentType,  DocumentLink,  UploadDate,DoctorId).then(results=>{
   res.status(results.status).json({message:results.message})


});
     });
    // //==================================================get patient list============================================================//
     router.post("/getpatient",cors(),(req,res)=>{
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
}       var UserID=getAddress(req)    
var patientID=req.body.patientID;
console.log(patientID)
var id=UserID.users.userID
readProduct.readProduct(id,patientID).then(results=>{
    res.status(results.status).json({"message":results.message})
}) 
     })
    //==============================================range==================================================================//
      router.get("/range",cors(),(req,res)=>{
         range.range().then(results=>{
             console.log(results)
             res.status(200).json({message:results.message})
         })  
     })
  //===================================================permission for doctor=========================================================//
  router.post("/requst_patient",cors(),(req,res)=>{
    if (!checkToken(req)) {
        console.log("invalid token")
        return res.status(401).json({
            message: "invalid token"
        })
}      
 var DoctorId=getAddress(req)  
 console.log(DoctorId)
var docID=DoctorId.users.userID;
var patientId=req.body.patientId;
if(!patientId){
    return res.status(401).json({message:"patientId empty"})
}
requestAcess.requestAcess(docID,patientId).then(results=>{
res.status(results.status).json({"message":results.message})
})
  })
//=======================Approve Access by Patient to doctor for Profile update========================================//
 router.post("/Approve_Request",cors(),(req,res)=>{
    if (!checkToken(req)) {
        console.log("invalid token")
        return res.status(401).json({
            message: "invalid token"
        })
    }

        var patientObj= getAddress(req)
        var status = req.body.status;
        var _id=patientObj.users._id;

approveRequest.approveRequest(status,_id).then(results=>{
    res.status(results.status).json({message:results.message})
})         
 })
 //===================================================doctor schedules the appointment=================================================================//
 router.post("/schedule",cors(),(req,res)=>{
     if(!checkToken(req)){
        console.log("invalid token")
        return res.status(401).json({
            message: "invalid token"
        })
    }  
     var DoctorObj=getAddress(req)
     var doctorId=DoctorObj.users.UserID
     console.log(doctorId)
     var mon=req.body.mon;
     var tues=req.body.tues;
     var wed=req.body.wed;
     var thurs=req.body.thurs;
     var fri=req.body.fri;
     var sat = req.body.sat;
     var sun=req.body.sun;
     if(!mon ||!tues||!wed||!thurs||!fri||!sat||!sun){
        return res.status(401).json({message:"please fill the timetable for everyday"}) 
     }
    timeTable.timeTable(mon,tues,wed,thurs,fri,sat,sun).then(results=>{
        console.log(results)
        res.status(results.status).json({message:results.message})
    })

 })
 //============================================book appoitment====================================================================//
 router.post("/bookAppointment",cors(),(req,res)=>{
    if(!checkToken(req)){
        console.log("invalid token")
        return res.status(401).json({
            message: "invalid token"
        })
    }  
    var useridq=getAddress(req)
    var userid=useridq.users.userID;
    var doctorId=req.body.DoctorId
    var date=req.body.date;
     bookAppointment.bookAppointment(userid,doctorId,date).then(results=>{
         console.log(results)
         res.status(results.status).json({message:results.message})
     })
 })
 //===============================================view appointments(doctors)======================================================================//
 router.post("/viewAppointmentsForDoctors",cors(),(req,res)=>{
    if(!checkToken(req)){
        console.log("invalid token")
        return res.status(401).json({
            message: "invalid token"
        })
    }
    var useridq=getAddress(req)
    var userid=useridq.users.userID;
    var date=req.body.date;
    viewAppointmentDoctor.viewAppointment(userid,date).then(results=>{
        console.log(results)
        res.status(results.status).json({message:results.status})
    })

 })
 //=================================================view appointment(patients)==========================================================================//
 router.post("/viewAppointmentsForPatients",cors(),(req,res)=>{
    if(!checkToken(req)){
        console.log("invalid token")
        return res.status(401).json({
            message: "invalid token"
        })
    }
    var useridq=getAddress(req)
    var userid=useridq.users.userID;
    var date=req.body.date;
    viewAppointmentPatient.viewAppointment(userid,date).then(results=>{
        console.log(results)
        res.status(results.status).json({message:results.status})
    })

 })
 //=============================================get doctor near me===============================================================//
 router.get("/getDoctors",cors(),(req,res)=>{
    getDoctors.getDoctors().then(results=>{
        res.status(res.status).json({Doctors:results.message})
    })
 })
 
   //===========================================utils======================================================================//     
   
    
         function checkToken(req) {

        const token = req.headers['x-access-token'];

        if (token) {

            try {

                var decoded = jwt.verify(token, config.secret);

                return true;


            } catch (err) {

                return false;
            }

        } else {

            return false;
        }
    }
     function getAddress(req) {

        const token = req.headers['x-access-token'];
   
        if (token) {
            try {

                var decoded = jwt.verify(token, config.secret);
                return decoded;


            } catch (err) {

                return false;
            }

        } else {

            return false;
        }
    }
        function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          
            for (var i = 0; i < 10; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          
            return text;
          }
    }

