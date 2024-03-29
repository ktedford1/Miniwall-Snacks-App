// code source: CSM-030, Lab 4, Part 1: MiniFilm REST Verification and Authentication

const joi = require('joi')

const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(256),
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const snackpostValidation = (data) => {
    const schemaValidation = joi.object({
        title:joi.string().required().min(5).max(100),
        description:joi.string().required().min(5).max(1000)
    })
    return schemaValidation.validate(data)
}
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.snackpostValidation = snackpostValidation
