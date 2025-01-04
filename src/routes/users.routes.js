const { Router } = require("express"); 
const multer = require("multer");
const uploadConfig = require("../configs/upload")

const UsersController = require("../controllers/UsersController")

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);

module.exports = usersRoutes;