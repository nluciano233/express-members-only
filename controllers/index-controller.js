exports.index = function (req, res) {
  res.render('index', 
    { 
      title: 'Primal', 
      stylesheetName: 'index.css' 
    });
};

exports.talkBoard_get = function (req, res) {
  res.render('talk-board',
  {
    title: 'talkboard',
    stylesheetName: 'index.css'
  });
};

exports.shop = function (req, res) {
  res.render('shop', 
  { 
    title: 'shop', 
    stylesheetName: 'index.css' 
  });
};

exports.signIn = function (req, res) {
  res.render('sign-in', 
  { 
    title: 'Sign In', 
    stylesheetName: 'index.css' 
  });
};

exports.signUp = function (req, res) {
  res.render('sign-up', 
  { 
    title: 'Sign Up', 
    stylesheetName: 'index.css' 
  });
};

exports.membership = function (req, res) {
  res.render('membership', 
  { 
    title: 'membership', 
    stylesheetName: 'index.css' 
  });
};

exports.cart = function (req, res) {
  res.render('cart', 
  { 
    title: 'Cart', 
    stylesheetName: 'index.css' 
  });
};