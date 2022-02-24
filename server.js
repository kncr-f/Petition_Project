const express = require("express");
const db = require("./database/db");
const app = express();
//const profileRoutes = require("./routes/profile_routes");
const { requireLoggedInUser, requireLoggedOutUser, requireNoSignature, requireSignature } = require('./middleware');

app.use(express.urlencoded({ extended: false }));
//Handlebars
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//const { compare, hash } = require("./bc");


app.use(express.static("./public"));

//cookieSession
const cookieSession = require('cookie-session');

app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true
}));

app.use(requireLoggedInUser);
app.use('/', require('./routes/auth_routing'));
app.use('/', require('./routes/create_read'));
app.use('/', require('./routes/update_delete'));

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});

app.listen(process.env.PORT || 8080, () => console.log("Server listening"));






