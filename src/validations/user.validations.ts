import joi from '@hapi/joi';

const validateChangePasswordSchema = joi.object({
    newPassword: joi.string().min(4).max(20).required(),
})

export const validateChangePassword = (user: any) => {
    return validateChangePasswordSchema.validate(user)
}
