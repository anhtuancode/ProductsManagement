const systemConfig = require("../../config/system");
const productRoutes = require("./products.route");
const dashboardRoutes = require("./dashboard.route");
const productCategoryRoutes = require("./products-category.route");
const roleRoutes = require("./roles.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");
const productsRestoreRoutes = require("./products-restore.route")
// middleware
const authMiddleware = require("../../middleware/admin/auth.middleware");

module.exports = (app) =>{    
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRoutes);
    app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);
    app.use(PATH_ADMIN + "/products-category", authMiddleware.requireAuth,productCategoryRoutes);
    app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth,roleRoutes);
    app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth,accountRoutes);
    app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth,myAccountRoutes);
    app.use(PATH_ADMIN + "/products-restore", authMiddleware.requireAuth, productsRestoreRoutes);
    app.use(PATH_ADMIN + "/auth", authRoutes);
}