const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    let find ={
        deleted: false,

    }

    const records = await Role.find(find);

    res.render("admin/pages/roles/index.pug",{
        pageTitle: "Nhóm quyền",
        records: records
    });
}

module.exports.create = async (req, res) => {

    res.render("admin/pages/roles/create.pug",{
        pageTitle: "Tạo nhóm quyền"
    });
}

module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}
