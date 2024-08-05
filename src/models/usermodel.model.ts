import { Schema,model } from "mongoose";

const modelSchema = new Schema(
    {
        name:{type:String},
        thumbnail:{type:String},
        model:{type:String},
        audio:{type:String},
        description:{type:String},
    },{timestamps:true, versionKey:false}
)

export default model('usermodel',modelSchema)