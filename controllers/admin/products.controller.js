const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filter-status");
const searchHelper = require("../../helpers/search");
const search = require("../../helpers/search");
// [GET] /admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.status);

    // Bộ lọc
    const filterStatus = filterStatusHelper(req.query);
    
    let find ={
        deleted: false
    }

    if(req.query.status){
        find.status = req.query.status;
    }

    // Tìm kiếm
    const objectSearch = searchHelper(req.query);
    
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }

    const products = await Product.find(find);

    res.render("admin/pages/products/index.pug",{
        pageTitle: "Danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}
