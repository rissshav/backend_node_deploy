import express, { Request, Response } from 'express'
import AdminController from '../../controllers/admin.controller'
import { responseWithStatus } from '../../utils/response.util'
import UserController from '../../controllers/user.controller'
const router = express.Router()

router.post('/login', async(req:Request | any, res: Response) => {
    const {userid, password} = req.body;
    const controller = new UserController(req, res);
    const response = await controller.login({userid, password});
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.get('/models', async(req:Request | any, res: Response) => {
    const {userid} = req.query;
    const controller = new UserController(req, res);
    const response = await controller.getmodels(userid);
    const { status } = response;
    return responseWithStatus(res, status, response)
})

module.exports = router
