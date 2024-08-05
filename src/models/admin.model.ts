import { Schema,model } from "mongoose";

const adminSchema = new Schema(
    {
        email:{type:String},
        password:{type:String},
        otp:{type:String}
    },{timestamps:true, versionKey:false}
)

export default model('admin',adminSchema)