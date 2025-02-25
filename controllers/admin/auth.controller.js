var md5 = require('md5');
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {  
  // so sanh 2 token co giong nhau ko neu ng dung sua lai token thi redirect ve trang login
  const user = await Account.findOne({token: req.cookies.token});
  if(user){
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  }else{
    res.render("admin/pages/auth/login.pug", {
      pageTitle: "Trang đăng nhập"
    });
  }
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {  
  // const email = req.body.email;
  // const password = req.body.password;
  const {email, password} = req.body;

  const user = await Account.findOne({
    email: email,
    deleted: false
  })

  if(!user){
    req.flash("error", "Email không tồn tại")
    res.redirect("back");
    return; 
  }

  if(md5(password) != user.password){
    req.flash("error", "Sai mật khẩu!!")
    res.redirect("back");
    return; 
  }

  if(user.status == "inactive"){
    req.flash("error", "Tài khoản đã bị khóa!!")
    res.redirect("back");
    return; 
  }

  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

module.exports.logout = async (req, res) => {  
  //delete token in side cookie
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};