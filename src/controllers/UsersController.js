const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require('../database/knex')

class UsersController {
    async get(req, res) {
        if (!req.user.isAdmin) {
            throw new AppError("Você não tem permissão para acessar esta rota.", 403);
        }

        const users = await knex('users').select('*');

        return res.json(users);
    }

    async create(req, res) {
        const { name, email, password } = req.body;

        const checkUserExists = await knex('users').where({ email }).first();

        if (checkUserExists) {
            throw new AppError("Este email já esta em uso.");
        }

        const hashedPassword = await hash(password, 8);

        await knex("users")
            .insert({ name, email, password: hashedPassword });

        res.status(201).json({ name, email, password });
    }

    async update(req, res) {
        const { name, email, password, old_password } = req.body;
        const id = req.user.id;

        const user = await knex("users")
            .select("*")
            .where("users.id", id)
            .first();

        if (!user) {
            throw new AppError("Usuário não encontrado.");
        }

        const emailHasChanged = email !== user.email;

        if (emailHasChanged) {
            const userWithUpdatedEmail = await knex("users")
                .select("*")
                .where("users.email", email)
                .first();

            if (userWithUpdatedEmail) {
                throw new AppError("Este email já está sendo utilizado.");
            }
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha.");
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError("Senha antiga está incorreta.");
            }

            user.password = await hash(password, 8);
        }

        await knex("users")
            .update({
                name: user.name,
                email: user.email,
                password: user.password,
                updated_at: knex.fn.now()
            })
            .where("users.id", id);

        res.json(user);
    }
}

module.exports = UsersController;