const { Router } = require('express');

const IngredientsController = require('../controllers/IngredientsController');
const jwt = require('../middlewares/jwt');

const ingredientsRoutes = Router();

const ingredientsController = new IngredientsController();

ingredientsRoutes.delete('/:id', jwt, ingredientsController.delete);

module.exports = ingredientsRoutes;