import { Route, Controller, Tags, Post, Body, Get, UploadedFile, Security, Query, FormField, Put, Patch } from 'tsoa'
import { IResponse } from '../utils/interfaces.util';
import { Request, Response, query, request } from 'express'
import { findAll, findOne, getById, upsert } from '../helpers/db.helpers';
import { signToken, encrypt, decrypt } from '../utils/common.util';
import logger from '../configs/logger.configs'
import adminModel from '../models/admin.model';
import usermodel from '../models/user.model';
import { generatePhotoId } from '../services/utils';
import path from "path";
import { promises as fsp } from "fs";
import sharp from "sharp";
import { validateChangePassword } from '../validations/user.validations';
import usermodelModel from '../models/usermodel.model';
import { model } from 'mongoose';



@Tags('Admin')
@Route('api/admin')
export default class AdminController extends Controller {
    req: Request;
    res: Response;
    userId: string
    constructor(req: Request, res: Response) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : ''
    }

    /**
     * login
     */
    @Security('Bearer')
    @Post('/login')
    public async login(
        @Body() request:{email:string, password:string}
    ): Promise<IResponse>{
        try{
            const {email, password} =request;
            const admin = await findOne(adminModel,{email:email})
            if(!admin){
                throw new Error("Wrong credentials!")
            }
            const admin_pass = decrypt(admin.password)
            if(admin_pass != password){
                throw new Error("Wrong credentials!")
            }
            const token = await signToken(admin._id)
            return{
                data:{token},
                error:'',
                message:"logged in successfully!",
                status:200
            }
        }
        catch(err:any){
            logger.error(`${this.req.ip} ${err.message}`)
            return{
                data:null,
                error:err.message ? err.message : err,
                message:"",
                status:400
            }
        }
    }

    // /**
    //  * Post picture
    //  */
    // @Security('Bearer')
    // @Post('/adduser')
    // public async adduser(
    //     @FormField() userid:string,
    //     @FormField() password:string,
    //     @UploadedFile() file:Express.Multer.File): Promise<IResponse>{
    //     try{
    //         if(!userid || !password || !file){
    //             throw new Error("Incomplete details")
    //         }
    //         console.log(userid, password,"<<<<<<")
    //         const user = await findOne(usermodel, {userid:userid})
    //         if(user){
    //             throw new Error("User id already exists")
    //         }
    //         console.log("hello",user)

    //         const new_password =await encrypt(password);
    //         console.log(new_password,"new paasss")


    //         const newFileName = "pic" + file.filename;
    //         console.log(newFileName)
    //         const newFilePath = path.join(
    //           __dirname,
    //           "../",
    //           "../",
    //           "public/",
    //           "uploads",
    //           newFileName
    //         );
    
    //         const ab = await sharp(file?.path)
    //           .resize()
    //           .jpeg({ quality: 50 })
    //           .rotate()
    //           .toFile(newFilePath);
    //         console.log(file,file.path,ab,"<<<<")
    //         if (file?.path) {
    //             try {
    //                 await fsp.rm(file.path);
    //             } catch (deleteErr:any) {
    //                 console.error(`Failed to delete file ${file.path}: ${deleteErr.message}`);
    //                 // Handle or log the error as needed
    //             }
    //         } else {
    //             console.error("File path is invalid or file is not provided.");
    //         }
    //         // await fsp.rm(file?.path ?? "", { recursive: true });
            
    //         await upsert(usermodel,{userid,password:new_password,model:newFileName})
    //         return{
    //             data:{},
    //             error:'',
    //             message:"Information uploaded successfully!",
    //             status:200
    //         }
    //     }
    //     catch(err:any){
    //         logger.error(`${this.req.ip} ${err.message}`)
    //         return{
    //             data:null,
    //             error:err.message ? err.message : err,
    //             message:"",
    //             status:400
    //         }
    //     }
    // }

    /**
     * Post picture
     */
    @Security('Bearer')
    @Post('/adduser')
    public async adduser(
        @FormField() userid:string,
        @FormField() password:string,
        @FormField() models:any,
    ): Promise<IResponse>{
        try{
            // const {userid, password, models} = request;
            console.log(userid,password,models,"<<<<<<<<")
            if(!userid || !password || !models){
                throw new Error("Incomplete details")
            }
            const user = await findOne(usermodel, {userid:userid})
            if(user){
                throw new Error("User id already exists")
            }
            var final=[];
            for(let i = 0; i< models.length;i++){
                const modelinfo = await findOne(usermodelModel,{name:models[i]})
                final.push({id:modelinfo._id})
            }
            const new_password =await encrypt(password);
            await upsert(usermodel,{userid,password:new_password,models:final})
            
            return{
                data:{},
                error:'',
                message:"Information uploaded successfully!",
                status:200
            }
        }
        catch(err:any){
            logger.error(`${this.req.ip} ${err.message}`)
            return{
                data:null,
                error:err.message ? err.message : err,
                message:"",
                status:400
            }
        }
    }

    /**
     * Edit user
     */
    @Security('Bearer')
    @Post('/edituser')
    public async edituser(
        @FormField() userid:string,
        @FormField() models:any,
    ): Promise<IResponse>{
        try{
            // const {userid, password, models} = request;
            console.log(userid,models,"<<<<<<<<")
            if(!userid || !models){
                throw new Error("Incomplete details")
            }
            const user = await findOne(usermodel, {_id:userid})
            if(!user){
                throw new Error("User id does not exists")
            }
            var final=[];
            for(let i = 0; i< models.length;i++){
                const modelinfo = await findOne(usermodelModel,{name:models[i]})
                final.push({id:modelinfo._id})
            }
            await upsert(usermodel,{models:final}, userid)
            return{
                data:{},
                error:'',
                message:"Information updated successfully!",
                status:200
            }
        }
        catch(err:any){
            logger.error(`${this.req.ip} ${err.message}`)
            return{
                data:null,
                error:err.message ? err.message : err,
                message:"",
                status:400
            }
        }
    }

    /**
     * Get user
     */
    @Security('Bearer')
    @Get('/finduserbyid')
    public async finduserbyid(
        @Query() userid:string
    ): Promise<IResponse>{
        try{
            const user = await findOne(usermodel, {_id:userid})
            if(!user){
                throw new Error("User id not found.")
            }
            
            return{
                data:{user},
                error:'',
                message:"User fetched successfully!",
                status:200
            }
        }
        catch(err:any){
            logger.error(`${this.req.ip} ${err.message}`)
            return{
                data:null,
                error:err.message ? err.message : err,
                message:"",
                status:400
            }
        }
    }

    /**
     * Delete user
     */
    @Security('Bearer')
    @Post('/deluser')
    public async deleteuser(
        @Body() request:{userid:string}
    ): Promise<IResponse>{
        try{
            const {userid} = request;
            const user = await findOne(usermodel, {_id:userid})
            if(!user){
                throw new Error("User id not found.")
            }
            await usermodel.deleteOne({_id:userid})
            return{
                data:{},
                error:'',
                message:"User deleted successfully!",
                status:200
            }
        }
        catch(err:any){
            logger.error(`${this.req.ip} ${err.message}`)
            return{
                data:null,
                error:err.message ? err.message : err,
                message:"",
                status:400
            }
        }
    }

        /**
     * add model
     */
    @Security('Bearer')
    @Post('/addmodel')
    public async addmodel(
        @FormField() name:string,
        @UploadedFile() thumbnail:Express.Multer.File,
        @UploadedFile() model:Express.Multer.File,
        @UploadedFile() audio:Express.Multer.File,
        @FormField() description:string
        ): Promise<IResponse>{
        try{
            if(!name || !thumbnail || !model || !audio || !description){
                throw new Error("Incomplete details")
            }
            console.log("hey",model.filename,audio.filename,thumbnail.filename)
            const modeldetails = await findOne(usermodelModel, {name:name})
            if(modeldetails){
                throw new Error("Model with the same name already exists!")
            }
            
            // const newModelFileName = "pic" + model.filename;
            // console.log(newModelFileName)
            // const newFilePathModel = path.join(
            //   __dirname,
            //   "../",
            //   "../",
            //   "public/",
            //   "uploads",
            //   newModelFileName
            // );
    
            // const cd = await sharp(model?.path)
            //   .resize()
            //   .jpeg({ quality: 50 })
            //   .rotate()
            //   .toFile(newFilePathModel);

            // if (model?.path) {
            //     try {
            //         await fsp.rm(model.path);
            //     } catch (deleteErr:any) {
            //         console.error(`Failed to delete file ${model.path}: ${deleteErr.message}`);
            //         // Handle or log the error as needed
            //     }
            // } else {
            //     console.error("File path is invalid or file is not provided.");
            // }

            // const newThumbnailFileName = "pic" + thumbnail.filename;
            // console.log(newThumbnailFileName)
            // const newFilePath = path.join(
            //   __dirname,
            //   "../",
            //   "../",
            //   "public/",
            //   "uploads",
            //   newThumbnailFileName
            // );
    
            // const ab = await sharp(thumbnail?.path)
            //   .resize()
            //   .jpeg({ quality: 50 })
            //   .rotate()
            //   .toFile(newFilePath);

            // if (thumbnail?.path) {
            //     try {
            //         await fsp.rm(thumbnail.path);
            //     } catch (deleteErr:any) {
            //         console.error(`Failed to delete file ${thumbnail.path}: ${deleteErr.message}`);
            //         // Handle or log the error as needed
            //     }
            // } else {
            //     console.error("File path is invalid or file is not provided.");
            // }
            // await fsp.rm(file?.path ?? "", { recursive: true });
            
            await upsert(usermodelModel,{name,thumbnail:thumbnail.filename,model:model.filename,audio:audio.filename,description:description})
            return{
                data:{},
                error:'',
                message:"Information uploaded successfully!",
                status:200
            }
        }
        catch(err:any){
            logger.error(`${this.req.ip} ${err.message}`)
            return{
                data:null,
                error:err.message ? err.message : err,
                message:"",
                status:400
            }
        }
    }

    /**
     * getmodelinfobyid
     */
    @Security('Bearer')
    @Get('/getmodelinfobyid')
    public async getmodelinfobyid(
        @Query() id:string
        ): Promise<IResponse>{
        try{
            if(!id){
                throw new Error("Incomplete details")
            }
            const modeldetails = await findOne(usermodelModel, {_id:id})
            if(!modeldetails){
                throw new Error("Model not found!")
            }
            // }
            // await fsp.rm(file?.path ?? "", { recursive: true });
            return{
                data:{name:modeldetails?.name},
                error:'',
                message:"Information uploaded successfully!",
                status:200
            }
        }
        catch(err:any){
            logger.error(`${this.req.ip} ${err.message}`)
            return{
                data:null,
                error:err.message ? err.message : err,
                message:"",
                status:400
            }
        }
    }


    /**
     * Get pictures
     */
    @Security('Bearer')
    @Get('/getmodels')
    public async getallmodels(
        @Query() page=1,
        @Query() limit=10,
        @Query() search=""
    ): Promise<IResponse>{
        try{
            //const images=await findAll(galleryModel,{})
            // const models = await usermodelModel.find()
            const models = await usermodelModel.aggregate([
                {
                    $match:{
                        $or:[
                            {'name':{ $regex: new RegExp(search, "i") } }
                        ]
                    }
                }, 
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $skip: Number(page - 1) * Number(limit),
                },
                {
                    $limit: Number(limit),
                },
            ])
            const modelcount = await usermodelModel.find()
            const total = Math.ceil(Number(modelcount?.length) / Number(limit))
            return{
                data:{models,totalpages:total},
                error:'',
                message:"Users fetched successfully!",
                status:200
            }
        }
        catch(err:any){
            logger.error(`${this.req.ip} ${err.message}`)
            return{
                data:null,
                error:err.message ? err.message : err,
                message:"",
                status:400
            }
        }
    }

    /**
     * Get pictures
     */
    @Security('Bearer')
    @Get('/getusers')
    public async getUsers(
        @Query() page=1,
        @Query() limit=10,
        @Query() search=""
    ): Promise<IResponse>{
        try{
            //const images=await findAll(galleryModel,{})
            const images = await usermodel.aggregate([
                {
                    $match:{
                        $or:[
                            {'userid':{ $regex: new RegExp(search, "i") } }
                        ]
                    }
                }, 
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $skip: Number(page - 1) * Number(limit),
                },
                {
                    $limit: Number(limit),
                },
            ])

            const images_count = await usermodel.aggregate([
                {
                    $match:{
                        $or:[
                            {'userid':{ $regex: new RegExp(search, "i") } }
                        ]
                    }
                }
            ])

            return{
                data:{users:images, totalItems:images_count.length},
                error:'',
                message:"Users fetched successfully!",
                status:200
            }
        }
        catch(err:any){
            logger.error(`${this.req.ip} ${err.message}`)
            return{
                data:null,
                error:err.message ? err.message : err,
                message:"",
                status:400
            }
        }
    }

  /**
   * Change Password
   */

  @Security("Bearer")
  @Post("/changePassword")
  public async changePassword(
    @Body() request: { oldPassword: string; newPassword: string }
  ): Promise<IResponse> {
    try {
      const { newPassword, oldPassword } = request;
      const validatedChangePassword = validateChangePassword({
        newPassword,
      });
      if (validatedChangePassword.error) {
        throw new Error(validatedChangePassword.error.message);
      }
      const exists = await getById(adminModel, this.userId);
      if (!exists) {
        throw new Error("Invalid Admin");
      }
      const isValid = await decrypt(exists.password);
      console.log(isValid,"passss",oldPassword)
      if (isValid != oldPassword) {
        throw new Error("Old password is incorrect");
      }
      const hashed = await encrypt(newPassword);
      const updated = await upsert(
        adminModel,
        { password: hashed },
        this.userId
      );

      return {
        data: {},
        error: "",
        message: "Password changed successfully",
        status: 200,
      };
    } catch (err: any) {
      logger.error(`${this.req.ip} ${err.message}`);
      return {
        data: null,
        error: err.message ? err.message : err,
        message: "",
        status: 400,
      };
    }
  }
}