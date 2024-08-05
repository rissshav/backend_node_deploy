import { findAll } from "../helpers/db.helpers"
import galleryModel from "../models/user.model"

export const generatePhotoId =async ()=>{
    const all=await findAll(galleryModel,{})
    console.log(all,all.length,"all.length")
    const item_number=Number(all.length) + 1;
    let final;
    if(Number(item_number) <= 44){
        let first="F";
        let middle;
        let end;
        if(Number(item_number) <= 22){
            middle ="A"
            end= item_number.toString()
        }
        else if(Number(item_number) > 22 && Number(item_number) <= 25){
            middle="B";
            end= (Number(item_number) - 22).toString() 
        }
        else{
            middle="C";
            end=(Number(item_number) - 25).toString()
        }
        final= first + middle + end;
    }
    else if(Number(item_number) > 44 && Number(item_number) <= 75){
        let first="G";
        let middle;
        let end;
        if(Number(item_number) > 44 && Number(item_number) <= 61){
            middle ="A"
            end= (Number(item_number) - 44).toString()
        }
        else if(Number(item_number) > 61 && Number(item_number) <= 64){
            middle="B";
            end= (Number(item_number) - 61).toString() 
        }
        else{
            middle="C";
            end=(Number(item_number) - 64).toString()
        }
        final= first + middle + end;
    }
    return final

}