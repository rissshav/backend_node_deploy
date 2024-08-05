import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import crypto from 'crypto';
import { CRYPTO } from '../constants/user.constant'
import { findOne, getById } from '../helpers/db.helpers';

export const encrypt = (db_password: string) => {
    // console.log("==========algorithm and password=========",typeof algorithm,typeof password,algorithm,password)
    return new Promise((resolve, reject) => {
        var cipher = crypto.createCipheriv(CRYPTO.ALGO, CRYPTO.KEY, CRYPTO.IV)
        var crypted = cipher.update(db_password, 'utf8', 'hex')
        crypted += cipher.final('hex');
        resolve(crypted);
    })
}


export const decrypt = (db_password: string) => {
    var decipher = crypto.createDecipheriv(CRYPTO.ALGO, Buffer.from(CRYPTO.KEY), CRYPTO.IV);
    var crypt = decipher.update(db_password, 'hex', 'utf8') + decipher.final('utf8');
    // return  Buffer.concat([
    //     decipher.update(db_password),
    //     decipher.final()
    // ])
    return crypt
}

export const convertIdToObjectId = (id: string) => {
    return new Types.ObjectId(id);
}

export const signToken = async (id: string, extras ={}, expiresIn = '365d') => {
    return new Promise((res, rej) => {
        jwt.sign({id, ...extras}, process.env.SECRET as string, {
            expiresIn
        }, (err: any, encoded: any) => {
            if (err) {
                rej(err.message);
            } else {
                res(encoded);
            }
        })
    })
}

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET as string);
        return decoded;
    }
    catch(err) {
        return null;
    }
}
