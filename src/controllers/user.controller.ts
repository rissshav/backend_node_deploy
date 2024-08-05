import { Route, Controller, Tags, Post, Body, Get, UploadedFile, Security, Query, FormField, Put, Patch } from 'tsoa'
import { IResponse } from '../utils/interfaces.util';
import { Request, Response, query, request } from 'express'
import { findAll, findOne, getById, upsert } from '../helpers/db.helpers';
import { signToken, encrypt, decrypt } from '../utils/common.util';
import logger from '../configs/logger.configs'
import adminModel from '../models/admin.model';
import galleryModel from '../models/user.model';
import { generatePhotoId } from '../services/utils';
import userModel from '../models/user.model';



@Tags('User')
@Route('api/user')
export default class UserController extends Controller {
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
     * Login user
     */
    @Security('Bearer')
    @Post('/login')
    public async login(@Body() request:{ userid: string, password:string}): Promise<IResponse>{
        try{
            const {userid, password} = request;
            if(!userid || !password){
                throw new Error("Missing credentials!")
            }
            const user = await findOne(userModel,{userid:userid})
            if(!user){
                throw new Error("Wrong credentials!")
            }
            console.log(user,"user>>")
            const userpassword = decrypt(user.password)
            if(userpassword !== password){
                throw new Error("Password seems to be incorrect!")
            }
            return{
                data:{},
                error:'',
                message:"Logged in successfully!",
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
     * Get models
     */
    @Security('Bearer')
    @Get('/models')
    public async getmodels(
        @Query() userid:string): Promise<IResponse>{
        try{
            if(!userid){
                throw new Error("Missing user id!")
            }
            const user = await findOne(userModel,{userid:userid})
            if(!user){
                throw new Error("Wrong user id!")
            }
            const models = await userModel.aggregate([
                {
                    $match:{userid:userid}
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "models.id",
                        foreignField: "_id",
                        as: "modelDetails"
                      }
                },
                {
                    $project:{
                        '_id':0,
                        'modelDetails':1
                    }
                }
            ])
            return{
                data:{models:models[0]?.modelDetails},
                error:'',
                message:"Fetched info successfully!",
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
}