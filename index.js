const express = require("express");
const {connection} = require("./Config/db")
const {AuthModel}  = require("./models/User.model")

var jwt = require('jsonwebtoken');

const app =  express();
app.use(express.json())

app.get("/", (req, res) => {
    res.send("welcome")
})

app.post("/signup", async(req, res) => {
    //console.log(req.body)
    let {email, password, age} = req.body;
    let new_password =  "abc"+ password + "mno"
    // const user = new AuthModel(req.body)
    const user = new AuthModel({email, password: new_password, age})
    try {
        await user.save();
        res.send("sinup success")
    }
    catch {
      console.log("error in signup")
    }
   
})

// app.post("/login", async(req, res)=>{
//    // console.log(req.body)
//    const isValid = await AuthModel.findOne(req.body)
//    console.log(isValid)
//    if(isValid){
//     res.send({"msg":"login successful", "token": 1245})
//    }else{
//     res.send("login failed")
//    }    
// })

app.post("/login", async(req, res) => {
    let {email, password} = req.body;
    let new_password = "abc" + password + "mno"
    // const isValid = await AuthModel.findOne(req.body)
    const isValid = await AuthModel.findOne({email, password:new_password})
    console.log(isValid) 
    if(isValid) {
        //var token = jwt.sign({foo: "bar"}, "secret")
        var token =  jwt.sign({age: isValid.age}, "secret")  //name, age, password it can be anything from data
       //var token =  jwt.sign({password: isValid.password}, "secret")
        console.log(token)
        res.send({"msg":"login successful", "token": token})
    } else {
        res.send("login failed")
    }    
})

// app.get("/dashboard", (req, res)=>{
//    // console.log(req.headers.authorization)
//     // // if(Number(req.query.token)=== 1245){
//     // //     res.send("imp data is here, dashboard")
//     // // }
//     // // else{
//     //      res.send("plz login")
//     // // }
// })


// app.get("/dashboard", (req, res)=>{
//      console.log(req.headers.authorization)
//      if(Number(req.headers.authorization.split(" ")[1])=== 1245){
//          res.send("imp data is here, dashboard")
//      }
//      else{
//           res.send("plz login")
//      }
//  })

app.get("/dashboard", (req, res)=>{
    console.log(req.headers.authorization)
    const token  =  req.headers.authorization.split(" ")[1]
    jwt.verify(token, "secret", function(err, decoded){
        if(err) {
            res.send("plz login")
        }
        else{
            //res.send("imp dashboard data")
            //res.send("welcome to dashboard ")
            res.send("welcome to dashboard " + decoded.age)
        }
    })
   
})


app.listen(8080, async() => {
    try {
        await connection;
        console.log("connected to db")
    }
    catch(err) {
        console.log("not connected to db", err)
    }
    console.log("listening port 8080")
} )