const express = require("express");
const router = express.Router();
const multer  = require('multer');

const upload = multer();

const controller = require("../../controllers/admin/products-restore.controller");
const validate = require("../../validates/admin/product.validate");

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");

router.get("/", controller.index);

module.exports = router;