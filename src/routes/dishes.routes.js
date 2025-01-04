const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload');

const DishesController = require('../controllers/DishesController');
const DishImageController = require('../controllers/DishImageController');
const jwt = require('../middlewares/jwt');

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();
const dishImageController = new DishImageController();

dishesRoutes.get('/', jwt, dishesController.index);
dishesRoutes.get('/:id', jwt, dishesController.show);
dishesRoutes.post('/', jwt, dishesController.create);
dishesRoutes.put('/:id', jwt, dishesController.update);
dishesRoutes.delete('/:id', jwt, dishesController.delete);
dishesRoutes.patch('/image/:id', jwt, upload.single("image"), dishImageController.update);

module.exports = dishesRoutes;