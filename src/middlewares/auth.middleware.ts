import { Request, Response, NextFunction } from 'express';
import { verifyToken} from '../utils/common.util'
import { responseWithStatus } from '../utils/response.util';
import { findOne, getById, upsert } from '../helpers/db.helpers';
import adminModel from '../models/admin.model';

export const authenticate= async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const decoded = await verifyToken(authHeader);
        if (decoded) {
            req.body.user = decoded;
            const now = await getById(adminModel,req.body.user.id)
            if(!now){
                return responseWithStatus(res, 400, {
                    data: null,
                    error: 'Unauthorized',
                    message: '',
                    status: 401
                })
            }
            next();
        } else {
            return responseWithStatus(res, 400, {
                data: null,
                error: 'Unauthorized',
                message: '',
                status: 401
            })
        }
    } else {
        return responseWithStatus(res, 400, {
            data: null,
            error: 'Unauthorized',
            message: '',
            status: 401
        })
    }
}