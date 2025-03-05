const productRoutes = require("./product.route")
const homeRoutes = require("./home.route")
const categoryMiddleWare = require("../../middleware/client/category.middleware");
module.exports = (app) =>{
    app.use(categoryMiddleWare.category);
    app.use("/", homeRoutes);
    app.use("/products", productRoutes);
}