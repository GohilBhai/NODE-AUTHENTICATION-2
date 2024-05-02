const model = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const config = require("../config/config.js");

//forget password mate se randomstring
const randomstring = require("randomstring");

const sendmail = async (name, email, userid) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    const mailOption = {
      from: config.emailUser,
      to: email,
      subject: "For Varification Mail",
      html:
        "<p>Hii," +
        name +
        ', Please Click Here To <a href="http://127.0.0.1:5000/varifymail?id=' +
        userid +
        '">Varify</a> Your Mail</p>',
    };

    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email Has Been Sent Successfully...", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const varifymail = async (req, res) => {
  try {
    const updateInfo = await model.updateOne(
      { _id: req.query.id },
      { $set: { varify: 1 } }
    );
    console.log(updateInfo);
    res.render("varifymail");
  } catch (error) {
    console.log(error.message);
  }
};

const securepassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

const insertUser = async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const user = new model({
      name: req.body.name,
      email: req.body.email,
      password: spassword, //req.body.password
      mobile: req.body.mobile,
      image: req.file.filename,
      admin: 0,
    });
    const userData = await user.save();
    if (userData) {
      sendmail(req.body.name, req.body.email, userData._id);
      res.render("registration", {
        message: "Registration Has Been Success, Please Varify Your Mail.",
      });
    } else {
      res.render("registration", {
        message: "Registration Has Been Failed...",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//login mate se....
const loadlogin = (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const varifylogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await model.findOne({ email: email });

    if (userData) {
      const matchpassword = await bcrypt.compare(password, userData.password);
      if (matchpassword) {
        if (userData.varify === 0) {
          res.render("login", { message: "Please Varify Your Mail" });
        } else {
          req.session.userid = userData._id;
          res.redirect("/home");
        }
      } else {
        res.render("login", { message: "Email and Password are Incorrect" });
      }
    } else {
      res.render("login", { message: "Email and Password are Incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadhome = (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

//forgetLoad forget password code start

const forgetLoad = async(req,res)=>{
  try {
   await res.render("forget");
  } catch (error) {
    console.log(error.message);
  }
}

const varifyEmail = async(req,res)=>{
  try {
    const email = req.body.email;
    const userData = await model.findOne({email:email});
    if(userData){
      if(userData.varify === 0){
          res.render("forget", { message: "please varify your mail" });
      }else{
          const RandomString = randomstring.generate();
          const updatedData=  await model.updateOne(
            { email: email },
            { $set: { token: RandomString } }
          );
          sendResetPasswordMail(userData.name, userData.email,RandomString);
          res.render("forget", { message: "lease check your mail to reset password" });
        }

    }else{
      res.render("forget",{message:"User Email is Incorrect"});
    }
  } catch (error) {
    console.log(error.message);
  }
}

//for reset passworrd mail
const sendResetPasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    const mailOption = {
      from: config.emailUser,
      to: email,
      subject: "For Reset Password",
      html:
        "<p>Hii," +
        name +
        ', Please Click Here To <a href="http://127.0.0.1:5000/forgetpassword?token=' +
        token +
        '">Reset</a> Your Password</p>',
    };

    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email Has Been Sent Successfully...", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const forgetPasswordLoad = async(req,res)=>{
  try {
    const token = req.query.token;
    const tokenData = await model.findOne({token:token});
    if(tokenData){
         res.render("forgetpassword",{userid:tokenData._id});
    }else{
      res.render("404",{message:"Token is Invalid"});
    }
  } catch (error) {
    console.log(error.message);
  }
}

const resetPassword =async(req,res)=>{
  try {
    const password = req.body.password;
    const userid = req.body.userid;
    
    const spassword = await securepassword(password);
    await model.findByIdAndUpdate({_id:userid},{$set:{password:spassword, token:""}});
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
}


module.exports = {
  loadRegister,
  insertUser,
  varifymail,
  sendmail,
  loadlogin,
  varifylogin,
  loadhome,
  userLogout,
  forgetLoad,
  varifyEmail,
  sendResetPasswordMail,
  forgetPasswordLoad,
  resetPassword,
};
