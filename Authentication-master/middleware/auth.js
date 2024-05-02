const isLogin = async (req, res, next) => {
  try {
    if (req.session.userid) {
      next(); // Move next() inside the if block
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.userid) {
      res.redirect("/home");
    } else {
      next(); // Move next() inside the else block
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  isLogin,
  isLogout,
};
