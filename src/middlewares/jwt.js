const { verify } = require("jsonwebtoken")
const AppError = require("../utils/AppError")
const authConfig = require("../configs/auth")

function jwt(request, response, next) {
    const authHeader = request.headers.authorization;

    try {
        const [, token] = authHeader.split(" ");

        if (!token) {
            throw new AppError('JWT Token não informado', 401);
        }

        const { id, isAdmin } = verify(token, authConfig.jwt.secret);

        request.user = {
            id: Number(id),
            isAdmin
        }

        return next();
    }
    catch {
        throw new AppError('JWT Token inválido', 401);
    }
}

module.exports = jwt