const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const filterStatusHelper = require("../../helpers/filter-status");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  // Bộ lọc
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination phân trang
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );

  //Sort 
  const sort = {};

  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue;
  }else{
    sort.position = "desc";
  }
  // End Sort

  // Pagination End
  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const product of products) {
    // lấy thông tin người tạo
    const user = await Account.findOne({ _id: product.createdBy.account_id});

    if(user){
      product.accountFullName = user.fullName
    }
    // Lấy thông tin người cập nhật gần nhất
    const updatedBy = product.updatedBy.slice(-1)[0];
    if(updatedBy){
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id
      });

      updatedBy.accountFullName = userUpdated.fullName;
    }
  }


  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id : là tham số được truyền trên routes xài res.param để lấy ra
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  await Product.updateOne({ _id: id }, {
     status: status,
     $push: {updatedBy: updatedBy}
    });
  req.flash('success', 'Cập nhật trạng thái thành công');

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { 
        status: "active",
        $push: {updatedBy: updatedBy}
       });
      req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { 
        status: "inactive",
        $push: {updatedBy: updatedBy}
       });
      req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công `);
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          // deletedAt: new Date(),
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
          }
        }
      );
      req.flash('success', `Đã xóa ${ids.length} sản phẩm thành công`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split(" - ");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { 
          position: position,
          $push: {updatedBy: updatedBy}
         });
      }
      req.flash('success', `Đã đổi vị trí ${ids.length} sản phẩm thành công`);

      break;
    default:
      break;
  }

  res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id}); xóa vĩnh viễn
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      // deletedAt: new Date(),
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      }
    }
  );
  req.flash('success', `Đã xóa sản phẩm thành công`);


  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find ={
    deleted: false
  }

  const category = await ProductCategory.find(find);

  const newCategory = createTreeHelper.tree(category);

  res.render("admin/pages/products/create.pug", {
    pageTitle: "Thêm sản phẩm mới",
    category: newCategory
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if(req.body.position == ""){
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  }else{
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy ={
    account_id: res.locals.user.id
  }

  
  const product = new Product(req.body); // Tạo mới sản phẩm 
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
  
    const category = await ProductCategory.find({
      deleted: false
    });
  
    const newCategory = createTreeHelper.tree(category);
  
    const product = await Product.findOne(find);
  
    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory
    });
  } catch (error) {
    // req.flash('warning', `Không tồn tại sản phẩm này`); update tính năng này
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if(req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }

    await Product.updateOne(
      { _id: req.params.id }, 
      {
        ...req.body, $push: {updatedBy: updatedBy}
      } 
    );
    req.flash('success', 'Cập nhật thành công');
  } catch (error) {
    req.flash('error', 'Cập nhật thất bại!!');
  } 

  res.redirect("back");
};

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
  
    const product = await Product.findOne(find);
  
    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};