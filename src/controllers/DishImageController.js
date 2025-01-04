const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class DishImageController {
  async update(req, res) {
    if (!req.user.isAdmin) {
      throw new AppError("Você não tem permissão para acessar esta rota.", 403);
    }

    const dish_id = req.params.id;
    const imageFileName = req.file.filename;

    if (!dish_id) {
      throw new AppError("ID do prato não informado", 400);
    }

    const diskStorage = new DiskStorage();

    const dish = await knex("dishes").where({ id: dish_id }).first();

    if (dish.image) {
      await diskStorage.deleteFile(dish.image);
    }

    const filename = await diskStorage.saveFile(imageFileName);
    dish.image = filename;

    await knex("dishes").update(dish).where({ id: dish_id });

    return res.json(dish);
  }

  async delete(dish_id) {
    const diskStorage = new DiskStorage();
    const dish = await knex("dishes").where({ id: dish_id }).first();

    if (dish.image) {
      await diskStorage.deleteFile(dish.image);
    }

    await knex("dishes").update({ image: null }).where({ id: dish_id });

    return { message: "Imagem deletada com sucesso" };
  }
}

module.exports = DishImageController;