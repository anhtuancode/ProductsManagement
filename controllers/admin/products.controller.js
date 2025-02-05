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


// [PATCH] /admin/products/change-status/:status/:id : là tham số được truyền trên routes xài res.param để lấy ra
module.exports.changeStatus = async (req,res) =>{
    // console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id}, { status: status});

    res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req,res) =>{
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active"  });
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { 
                deleted: true,
                deletedAt: new Date()
            });
            break;
        default:
            break;  
    }


    res.location(req.get("Referrer") || "/");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req,res) =>{
    const id = req.params.id;

    // await Product.deleteOne({ _id: id}); xóa vĩnh viễn
    await Product.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    });

    res.location(req.get("Referrer") || "/");
};