// [GET] /products
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: 'active',
        deleted: false
    }).sort({position: "desc"});
    console.log(products);

    const productNew = products.map(item =>{
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
        return item;
    })

    res.render("client/pages/products/index.pug", {
        pageTitle: "Trang danh sach san pham",
        products: productNew
    });
}

module.exports.detail = async (req, res) => {
    try {
        const find = {
          deleted: false,
          slug: req.params.slug,
          status: "active"
        };
      
        const product = await Product.findOne(find);
      
        res.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product
        });
      } catch (error) {
        res.redirect(`/products`);
      }
}