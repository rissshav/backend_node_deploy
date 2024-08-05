// import { Schema,model } from "mongoose";

// const userSchema = new Schema(
//     {
//         userid:{type:String},
//         password:{type:String},
//         model:{type:String},
//     },{timestamps:true, versionKey:false}
// )

// export default model('users',userSchema)
import { Schema,model } from "mongoose";

const userSchema = new Schema(
    {
        userid:{type:String},
        password:{type:String},
        models:{type:Array},
    },{timestamps:true, versionKey:false}
)

export default model('users',userSchema)