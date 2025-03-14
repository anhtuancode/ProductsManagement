const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filter-status");
const searchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/createTree");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {  
  let find ={
    deleted: false
  }

  if (req.query.status) {
    find.status = req.query.status;
  }
  
  // Bộ lọc
  const filterStatus = filterStatusHelper(req.query);

  // Tìm kiếm
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {  
  let find = {
    deleted:false,
  };
  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords
  });
};

// [POST] /admin/products-category/createPost
module.exports.createPost = async (req, res) => {
  if(req.body.position == ""){
    const countProducts = await ProductCategory.countDocuments();
    req.body.position = countProducts + 1;
  }else{
    req.body.position = parseInt(req.body.position);
  }
  
  const record = new ProductCategory(req.body); // Tạo mới sản phẩm 
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {  
  try {
    const id = req.params.id;

    const find = {
      _id: id,
      deleted: false
    };
    const data = await ProductCategory.findOne(find);
  
    const records = await ProductCategory.find({
      deleted:false
    });
  
    const newRecords = createTreeHelper.tree(records);
    res.render("admin/pages/products-category/edit.pug", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords
    }); 
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
};


// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {  
  const id = req.params.id;
  
  req.body.position = parseInt(req.body.position);

  await ProductCategory.updateOne({_id:id},req.body)

  res.redirect("back");
};

module.exports.detail = async (req, res) => {  
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
  
    const record = await ProductCategory.findOne(find);
  
    res.render("admin/pages/products-category/detail.pug", {
      pageTitle: record.title,
      record: record
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};