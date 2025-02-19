var md5 = require('md5');
const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async(req, res)=>{
    let find = {
        deleted: false
    };
    // select dùng để chọn ra các trường - là không lấy những trường đó hoặc xài password bth là lấy
    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
            deleted: false,
            _id: record.role_id
        })
        record.role = role
    }
    res.render("admin/pages/accounts/index",{
        pageTitle: "Danh sách tài khoản",
        records: records
    });
}

// [GET] /admin/accounts/create
module.exports.create = async(req, res)=>{
    const roles = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/accounts/create",{
        pageTitle: "Trang tạo tài khoản",
        roles: roles
    });
}

// [POST] /admin/accounts/create
module.exports.createPost = async(req, res)=>{
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    const phoneExist = await Account.findOne({
        phone: req.body.phone,
        deleted: false
    });

    if(emailExist){
        req.flash("error", `Email ${req.body.email} này đã tồn tại`);
        res.redirect("back");
    }else if(phoneExist){
        req.flash("error", `Số điện thoại này đã tồn tại`);
        res.redirect("back");
    }else{
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);   
        console.log(record);
        await record.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async(req, res)=>{
    let find = {
        _id: req.params.id,
        deleted: false
    }

    try {
        const data = await Account.findOne(find);

        const roles = await Role.find({
            deleted: false
        });

        res.render("admin/pages/accounts/edit",{
            pageTitle: "Trang chỉnh sửa tài khoản",
            roles: roles,
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async(req, res)=>{
    const id = req.params.id;

    const emailExist = await Account.findOne({
        _id: {$ne: id},
        email: req.body.email,
        deleted: false
    });

    if(emailExist){
        req.flash("error", `Email ${req.body.email} này đã tồn tại`);
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }else{
            delete req.body.password;
        }
        await Account.updateOne({_id: id}, req.body);
        console.log(req.flash("success", `Cập nhật tài khoản thành công`));
    }
    res.redirect("back");
}