const { body, validationResult } = require('express-validator');

const User = require('../models/user');
const Product = require('../models/product');
const Flavor = require('../models/flavor');

exports.home = function (req, res) {
  res.render('home', 
    { 
      title: 'Primal'
    });
};

// SHOP -----------------------------------------
exports.shop = function (req, res, next) {

  Product.find({})
    .exec((err, products) => {
      if (err) {
        return next(err);
      };

      // success
      res.render('shop', {
        title: 'shop',
        products: products,
      });
    })
};

exports.cart = function (req, res) {
  res.render('cart', 
  { 
    title: 'Cart'
  });
};

exports.cart_post = function(req, res, next) {
  console.log(req.body);
}

exports.product_detail = function (req, res, next) {
  Product.findById(req.params.id)
    .populate({path: 'flavor'})
    .exec(function(err, product) {
      if (err) {
        return next(err);
      };
      if (product == null) {
        // no results
        let err = new Error('Product not found');
        err.status = 404;
        return next(err);
      };
      const checkOption = ((product) => {
        // this functions checks if the option passed into the parameter url exists, and if it does not, it returns an error.
        let options = [];
        for (let i = 0; i < product.option.length; i++) {
          options.push(product.option[i].quantity);
        };
        if (options.includes(req.params.option)) {
          return;
        };
        // product options doesn't include option passed into url parameter, return error
        let err = new Error('Option not found');
        err.status = 404;
        return ['error', next(err)];
      })(product);
      if (checkOption) {
        // this stops the execution of the product_detail function so the res.render doesnt execute, this way you don't get the "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client" error.
        return;
      };

      const passPrice = (()=>{
        // pass into the template the price of the product based on what parameters is passed into the url for the :option
        let pricing = {price:0, members_price: 0};
        for (let option in product.option) {
          if (product.option[option].quantity === req.params.option) {
            pricing.price = product.option[option].cost.price;
            pricing.members_price = product.option[option].cost.members_price;
          };
        };
        if (pricing.price === 0 || pricing.members_price === 0) {
          // if the price doesnt change from 0 then there was an error in calculating it
          let err = new Error('Error in calculating price');
          err.status = 500 // internal server error
          return next(err);
        };
        // console.log(pricing);
        // success
        return pricing;
      })();

      // success
      res.render('product_detail', {
        title: product.name,
        product: product,
        selected_product: req.params.option,
        pricing: passPrice,
      });
    });
};
// SHOP -----------------------------------------

// MEMBERSHIP ----------------------------------
exports.membership = function (req, res) {
  res.render('membership', 
  { 
    title: 'membership'
  });
};

exports.membership_join = [
    // validate and sanitize
    body('passcode')
    .not().isEmpty().withMessage("Passcode can't be empty")
    .trim()
    .escape(),

    // process request after validation
    (req, res, next) => {
      // check for errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render('membership', {
          title: 'membership',
          err: errors.array(),
        });
        return;
      }

      // no errors found
      if (req.body.passcode === 'Primal') {
        // good passcode, give user membership
        User.findByIdAndUpdate(
          req.session.passport.user, 
          {is_member: true}, 
          (err, user) => {
          if (err) {
            return next(err);
          };
    
          res.redirect('/membership')
        });
        return;
      }
      
      // wrongs passcode, render with errors
      res.render('membership', {
        title: 'membership',
        err: [{msg: 'Wrong passcode'}]
      });
    }
];

exports.membership_delete = function (req, res, next) {
  // check if user exists
  User.findByIdAndUpdate(req.session.passport.user, {
    is_member: false,
  }, (err, user) => {
    if (err) {
      return next(err);
    };

    res.redirect('/membership');
  });
}
// MEMBERSHIP ----------------------------------
