const mongoose =  require("mongoose")

const authSchema = new mongoose.Schema({
    email : String,
    password : String,
    age : Number
})
const AuthModel = mongoose.model("user", authSchema)

module.exports = { AuthModel }