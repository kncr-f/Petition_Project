const express = require("express");
const db = require("./database/db");

const app = express();
app.use(express.urlencoded({ extended: false }));

const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.static("./public"));


const cookieSession = require('cookie-session');

app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true
}));


app.get("/", (req, res) => {


    if (req.session.sigId) {
        res.redirect("/thanks");
        return;
    }

    res.render("petition", {
        layout: "main"
    })
});

app.post("/", (req, res) => {
    const { first, last, signature, id } = req.body;
    if (first === "" || last === "" || signature === "") {
        res.render("error", {
            layout: "main",
        })
    }

    db.addPetition(first, last, signature)
        .then(({ rows }) => {

            req.session.sigId = rows[0].id;

            res.redirect("/thanks");

        })
        .catch((err) => {
            console.log("error", err);

        });

});

app.get("/thanks", (req, res) => {

    let countRows;

    db.countSigners()
        .then(({ rows }) => {
            countRows = rows;

            return db.getSignature(req.session.sigId);

        })
        .then(({ rows }) => {
            res.render("thanks", {
                layout: "main",
                numberOfSigners: countRows[0].count,
                img: rows[0].signature

            })
        })

});
app.get("/signers", (req, res) => {
    db.getAllSigners().then(({ rows }) => {
        res.render("signers", {
            layout: "main",
            AllSigners: rows
        })
    })


})

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.listen(8080, () => console.log("Server listening"));


