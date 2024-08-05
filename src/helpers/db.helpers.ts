import { Model } from 'mongoose'
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import { Parser } from 'json2csv'

export const getById = async (model: Model<any>, id: string, project: any = null) => {
    const data = await model.findById(id, project, {lean: { virtuals: true }});
    return data;
}

export const findOne = async (model: Model<any>, query: object, project: any = null) => {
    const data = await model.findOne(query, project, {lean: { virtuals: true }});
    return data;
}

export const findAll = async (model: Model<any>, query: object, project: any = null) => {
    const data = await model.find(query, project, {lean: { virtuals: true }});
    return data;
}

// insert or update
export const upsert = async(model: Model<any>, data: any, id?: string) => {
    let dataRes = null;
    if(id) {
        // update
        delete data.id;
        dataRes = await model.findByIdAndUpdate(id, {...data}, {new: true})
    } else {
        dataRes = await model.create(data);
    }
    return dataRes;
}