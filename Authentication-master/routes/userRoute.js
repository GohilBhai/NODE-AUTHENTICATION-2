const express = require("express");
const router = express();

router.set("view engine", "ejs");
router.set("views", "./views/users");

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//session mate se 
const session = require("express-session");
const config = require("../config/config.js");
router.use(session({
  resave: false, 
  saveUninitialized: true,
  secret:config.secretSession
}));
const auth = require("../middleware/auth");


const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../public/userImages"));
  },
  filename: (req, file, callback) => {
    const name = Date.now() + "-" + file.originalname;
    callback(null, name);
  },
});

const upload = multer({ storage: storage });

const userController = require("../controllers/userController.js");

router.get("/register",auth.isLogout, userController.loadRegister);
router.post("/register", upload.single("image"), userController.insertUser);
router.get("/varifymail", userController.varifymail);
router.get("/",auth.isLogout, userController.loadlogin);
router.get("/login",auth.isLogout, userController.loadlogin);
router.post("/login", userController.varifylogin);
router.get("/home",auth.isLogin, userController.loadhome);
router.get("/logout", auth.isLogin, userController.userLogout);
router.get("/forget", auth.isLogout, userController.forgetLoad);
router.post("/forget", userController.varifyEmail);
router.get("/forgetpassword", auth.isLogout, userController.forgetPasswordLoad);
router.post("/forgetpassword", userController.resetPassword);





module.exports = router;
