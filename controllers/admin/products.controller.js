const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filter-status");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
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

    // Pagination phân trang
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems:4
        },
        req.query,
        countProducts
    )


    // Pagination End
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.render("admin/pages/products/index.pug",{
        pageTitle: "Danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}
