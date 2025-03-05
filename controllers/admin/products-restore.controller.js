const Product = require("../../models/product.model");

// [GET] /admin/products-restore
module.exports.index = async (req, res) => {  
    let find ={
      deleted: true
    }

    const records = await Product.find(find);
  
    res.render("admin/pages/products-restore/index.pug", {
      pageTitle: "Khôi phục sản phẩm",
      records: records
    });
  };