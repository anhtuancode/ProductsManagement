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

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        let find ={
            _id: id,
            deleted: false
        };

        const data = await Role.findOne(find);

        console.log(data);

        res.render("admin/pages/roles/edit.pug",{
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.updateOne({_id: id}, req.body);

        req.flash("success", "Cập nhật thành công")
    } catch (error) {
        req.flash("error", "Cập nhật thất bại")
    }
    
    res.redirect("back");
}
