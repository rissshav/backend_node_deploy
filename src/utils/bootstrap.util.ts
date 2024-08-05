import { findOne, upsert } from '../helpers/db.helpers';
import adminModel from '../models/admin.model';
import { encrypt} from './common.util';

export const bootstrapAdmin = async function (cb: Function) {
  const adminPassword = await encrypt("admin_pass@123");
  const adminData = {
    password: adminPassword,
    email: 'admin@yopmail.com',
  };
  const adminDoc = await findOne(adminModel, { email: adminData.email });
  if (!adminDoc) {
    await upsert(adminModel, adminData)
  }
  cb();
};