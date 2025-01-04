const knex = require('../database/knex')
const AppError = require("../utils/AppError")
const { compare } = require("bcryptjs")
const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")

class SessionsController{
    async create(req, res){
        const { email, password } = req.body

        if(!email || !password){
            throw new AppError("Necessário informar E-mail e senha para efetuar login", 401)
        }

        const user = await knex("users").where({ email }).first()

        if(!user){
            throw new AppError("E-mail e/ou senha incorreta", 401)
        }

        const passwordMatched = await compare(password, user.password);

        if(!passwordMatched){
            throw new AppError("E-mail e/ou senha incorreta", 401)
        }

        const { secret, expiresIn } = authConfig.jwt
        const token = sign({ id: user.id, isAdmin: user.isAdmin }, secret, {
            expiresIn
        });
        
        return res.json({ user, token })
    }
}

module.exports = SessionsController