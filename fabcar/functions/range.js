/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/28
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/
bcSdk= require("../sdk/query")
exports.range=()=>{
    return new Promise((resolve, reject) => {
bcSdk.range()
.then(results =>{
 console.log("results======================>",results.message[0].Record.Owner) 

resolve({ "status":results.status, "message": results.message })
}).catch(err=>{
    console.log(err)
})
 
})


}