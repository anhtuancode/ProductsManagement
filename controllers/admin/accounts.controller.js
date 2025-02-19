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