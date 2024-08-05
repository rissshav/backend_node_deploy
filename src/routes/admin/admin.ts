import express, { Request, Response } from 'express'
import AdminController from '../../controllers/admin.controller'
import { responseWithStatus } from '../../utils/response.util'
const router = express.Router()
import { authenticate } from '../../middlewares/auth.middleware'
import { multerDp } from '../../middlewares/multer.middleware'
import multer from 'multer'
const upload = multer();

router.post('/login',async(req:Request | any, res: Response) => {
    const {email, password} = req.body;
    const controller = new AdminController(req, res);
    const response = await controller.login({email, password});
    const { status } = response;
    return responseWithStatus(res, status, response)
})

// router.post('/adduser',multerDp.single('file'), authenticate, async(req:Request | any, res: Response) => {
//     const {userid, password} = req.body;
//     const controller = new AdminController(req, res);
//     const response = await controller.adduser(userid, password,req.file as Express.Multer.File);
//     const { status } = response;
//     return responseWithStatus(res, status, response)
// })

router.post('/adduser',authenticate,upload.none(), async(req:Request | any, res: Response) => {
    const body = Object.assign({}, req.body);
    console.log(body,"bodyyyy")
    
    // Parse the models field
    body.models = JSON.parse(body.models);
    const {userid, password, models} = body;
    console.log(req.body,"<")
    const controller = new AdminController(req, res);
    const response = await controller.adduser(userid, password,models);
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.post('/edituser',authenticate,upload.none(), async(req:Request | any, res: Response) => {
    const body = Object.assign({}, req.body);
    body.models = JSON.parse(body.models);
    const {userid, models} = body;
    console.log(req.body,"<")
    const controller = new AdminController(req, res);
    const response = await controller.edituser(userid, models);
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.post('/deluser',authenticate,async(req:Request | any, res: Response) => {
    const {userid} = req.body;
    const controller = new AdminController(req, res);
    const response = await controller.deleteuser({userid});
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.get('/finduserbyid',authenticate,async(req:Request | any, res: Response) => {
    const {userid} = req.query;
    const controller = new AdminController(req, res);
    const response = await controller.finduserbyid(userid);
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.post('/addmodel',multerDp.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "model", maxCount: 1 },
    { name: "audio", maxCount: 1 }]), authenticate, async(req:Request | any, res: Response) => {
    const {name, description} = req.body;
    const {thumbnail, model, audio} = req.files;
    const controller = new AdminController(req, res);
    const response = await controller.addmodel(name,thumbnail[0],model[0],audio[0],description);
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.get('/getusers', authenticate, async(req:Request | any, res: Response) => {
    const {page,limit, search } = req.query;
    const controller = new AdminController(req, res);
    const response = await controller.getUsers(page,limit, search );
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.get('/getmodelinfobyid', authenticate, async(req:Request | any, res: Response) => {
    const {id } = req.query;
    const controller = new AdminController(req, res);
    const response = await controller.getmodelinfobyid(id);
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.get('/getmodels', authenticate, async(req:Request | any, res: Response) => {
    const {page,limit, search } = req.query;
    const controller = new AdminController(req, res);
    const response = await controller.getallmodels(page,limit, search);
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.post('/changePassword', authenticate, async (req: Request | any, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const controller = new AdminController(req, res)
    const response = await controller.changePassword({ oldPassword, newPassword });
    const { status } = response;
    return responseWithStatus(res, status, response)
})

module.exports = router