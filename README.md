# Notes

In package.json `sass` script is set up to monitor the whole directory and generate separate files for each file inside `src/stylesheets`.

# Instructions

Members can write posts on the mainboard. 
Everyone can read posts.
Only members can write posts.
Only members can see who the author of other posts is.
Members will see discounted prices inside the shop, with a crossed line over the current price, the new price, and a label saying MEMBERS DISCOUNT.

When users sign up they should not be automatically given memebrship status. Add a page where members can "join the club" by entering a secret passcode. If they enter the passcode correctly then update their membership status.

When a user is logged in, only then he can see the "create a new message" form. Outsiders cannot see this form.

Add an optional field to the user model that has `admin === true` that has the ability to delete messages. For this you need to add a way for a user to become and admin (for example you can add a checkbox on the sign up page, no need to be anything fancy).

By this point, anyone who comes to the site should be able to see a list of all messages, with the author's names hidden. Users should be able to sign-up and create messages, but ONLY users that are members should be able to see the author and date of each message. Finally, you should have an Admin user that is able to see everything and also has the ability to delete messages.

There will be no admin panel to add products because that's out of the scope of this project.

# Routes
Index: 
* get /
* get /talk-board
* get /shop
* get /sign-in
* get /sign-up
* get /membership
* get /cart
* post /sign-in
* post /sign-up
* post /log-out

Product:
* get /product/:product_id/:product_name




# Using Include and Mixins
Using only `include` will not allow you to use variables.
Using `include` and then using a mixin from the page you included will allow you to use variables that you can pass inside the mixin. (This was originally intended to be used to pass stylesheets but I opted to pass them with the controller.)

# How navbar works
Navbar has to be transparent on the main page, but it has to have a background image on the rest of the website. 

~~It can be included using a mixin with a variable. If you pass a "deactivaiton" variable inside the mixin, then the header background will not show. If you don't pass anything inside the mixin then the header background will be present.~~

Since you will only need this behavior inside the homepage, you can add a style tag that will set the background image of the header to null only inside the homepage.

# Sessions
[Source to learn about sessions](https://www.youtube.com/watch?v=F-sFp_AvHc8).

When a client makes an http request to the server:
1. Session middleware is going to initialize the session.
2. The session ID will be assigned to a cookie.
3. The cookies is going to be put inside `set_cookie` http header.
4. By doing this the cookie is going to be saved in the client browser.
5. The browser is going to receive it, set the cookie, and every time the client refreshes the page the cookie will be part of that request.
6. The server recognizes the cookie present in the request and is going to provide the data from the session attached to that cookie.

# Handling the password
It is probably a good idea to send an already hashed password in the POST request in the user signup and login. This is because HTTPS is indeed secure, but it is not bulletproof, and it is never a good idea to send a password in plain-text.

[Source](https://stackoverflow.com/questions/3391242/should-i-hash-the-password-before-sending-it-to-the-server-side)

Despite this, one of the comments says that trying to login with `gmail` sends the password in plain sight in the post request. 

This website will send the password in plain text, but I'm not sure if this is a good idea for a real website.

# Check-Utils
Check-utils is a js file that checks if the user is an `admin` or if it is a `member`. It is added inside app.js as middleware, so you can add the values to `locals` and access them inside your pugjs templates.
It is really easy to use:
```javascript
// in config/check-utils.js
// check if currentUser is_member and return true, else return false
exports.isMember = function (locals) {
  if (locals?.currentUser?.is_member === true) {
    return true;
  };
  return false;
};

// check if user is admin
exports.isAdmin = function (locals) {
  if (locals?.currentUser?.is_admin === true) {
    return true;
  };
  return false;
}
```
The `?` used in the object names is called "Optional chaining". [More on optional chaining in this DMN article.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)


```javascript
// in app.js
const checkUtils = require(./config/check-utils);

app.use(function(req, res, next) {
  let checkMember = checkUtils.isMember(res.locals);
  res.locals.checkMember = checkMember;
  let checkAdmin = checkUtils.isAdmin(res.locals);
  res.locals.checkAdmin = checkAdmin;
  next();
});
```

Now inside your pugjs template you can add `if` statements that will show content based on boolean values inside your locals.
Example in pugjs:
```pug
// in home.pug
if locals.checkMember
  p user is a member
if locals.checkAdmin
  p user is an admin
```

This system was made because if the user was not logged in and you checked for `locals.currentUser.is_member` the server was giving an error because you cant check the value (in this case `is_member`) of an undefined object (in this case `currentUser` since the user was not logged in).

# Notes
The controller must pass the name of the `stylesheet` that the `view` will use.

# Resources used for this project
[The Odin Project Assignment](https://www.theodinproject.com/lessons/nodejs-members-only).

[The Odin Project Authentication Basics](https://www.theodinproject.com/lessons/nodejs-authentication-basics).

[Passport Documentation](https://www.passportjs.org/tutorials/password/).

Notes on what [saveUninitialized](https://github.com/expressjs/session/issues/273) from passportjs documentation is used for.

[Passportjs session and initialize resource 1](https://stackoverflow.com/questions/46644366/what-is-passport-initialize-nodejs-express).

[Passportjs session and initialize resource 2](https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do/28994045#28994045).


[This video](https://www.youtube.com/watch?v=F-sFp_AvHc8) in particular was really helpful to get a good understanding of the big picture of how things work.
