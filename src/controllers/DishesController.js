const AppError = require('../utils/AppError');

const knex = require("../database/knex");
const DishImageController = require('./DishImageController');

class DishesController {
  async index(req, res) {
    const { dishName } = req.query;

    let dishesQuery = knex('dishes').select('*');

    if (dishName) {
      dishesQuery = dishesQuery.where('title', 'like', `%${dishName}%`);
    }

    const dishes = await dishesQuery;

    for (let i = 0; i < dishes.length; i++) {
      const ingredients = await knex('ingredients')
        .where({ dish_id: dishes[i].id })
        .select('*');

      dishes[i].ingredients = ingredients;
    }

    return res.json(dishes);
  }

  async show(req, res) {
    if (!req.params.id) {
      throw new AppError("ID do prato não informado", 400);
    }

    const dish = await knex('dishes')
      .where({ id: req.params.id })
      .first();

    if (!dish) {
      throw new AppError("Prato não encontrado", 404);
    }

    const ingredients = await knex('ingredients')
      .where({ dish_id: req.params.id })
      .select('*');

    return res.json({ ...dish, ingredients });
  }

  async create(req, res) {
    if (!req.user.isAdmin) {
      throw new AppError("Você não tem permissão para acessar esta rota.", 403);
    }

    const { title, description, category, price, ingredientes } = req.body;

    if(!title || !description  || !category || !price){
      throw new AppError("Necessário informar título, descrição, categoria e preço para adicionar um novo prato", 403);
    }

    const createdDish = await knex('dishes').insert({ title, description, category, price });

    if (ingredientes) {
      for (let i = 0; i < ingredientes.length; i++) {
        await knex('ingredients').insert({ name: ingredientes[i].name, dish_id: createdDish[0] });
      }
    }

    return res.status(201).json({ id: createdDish[0], message: "Prato criado com sucesso" });
  }

  async update(req, res) {
    if (!req.user.isAdmin) {
      throw new AppError("Você não tem permissão para acessar esta rota.", 403);
    }

    const { title, description, category, price, ingredientes } = req.body;

    if(!title || !description  || !category || !price){
      throw new AppError("Necessário informar título, descrição, categoria e preço para editar um prato", 403);
    }

    if (!req.params.id) {
      throw new AppError("ID do prato não informado", 400);
    }

    await knex('dishes')
      .where({ id: req.params.id })
      .update({ title, description, category, price });

    if (ingredientes) {
      await knex('ingredients')
        .where({ dish_id: req.params.id })
        .del();

      for (let i = 0; i < ingredientes.length; i++) {
        await knex('ingredients').insert({ name: ingredientes[i].name, dish_id: req.params.id });
      }
    }

    return res.status(200).json({ message: "Prato atualizado com sucesso" });
  }

  async delete(req, res) {
    if (!req.user.isAdmin) {
      throw new AppError("Você não tem permissão para acessar esta rota.", 403);
    }

    const dish_id = req.params.id;

    if (!dish_id) {
      throw new AppError("ID do prato não informado", 400);
    }

    const dishImageController = new DishImageController();
    await dishImageController.delete(dish_id);

    await knex('dishes')
      .where({ id: dish_id })
      .del();

    return res.status(200).json({ message: "Prato deletado com sucesso" });
  }
}

module.exports = DishesController;