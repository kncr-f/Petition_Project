const express = require("express");
const db = require("./database/db");

const app = express();
app.use(express.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.static("./public"));

app.get("/", (req, res) => {

    if (req.cookies.petitionSuccess) {
        res.redirect("/thanks");
        return;
    }

    res.render("petition", {
        layout: "main"
    })
});

app.post("/", (req, res) => {
    console.log(req.body.first);
    // console.log(req.body)
    db.addPetition(req.body.first, req.body.last, req.body.signature)
        .then(({ rows }) => {
            console.log("rows: ", rows);
            res.cookie("petitionSuccess", true);
            res.redirect("/thanks");
        })
        .catch((err) => {
            console.log("error", err)
        });

});

app.get("/thanks", (req, res) => {

    res.render("thanks", {
        layout: "main"
    })
});
app.get("/signers", (req, res) => {
    db.getAllSigners().then(({ rows }) => {
        res.render("signers", {
            layout: "main",
            rows
        })
    })


})

app.listen(8080, () => console.log("Server listening"));



// db.query returm promise, use then to catch the value
// db.query(`SELECT * FROM cities`)
//     .then(({ rows }) => {
//         console.log("rows: ", rows)
//     })
//     .catch((err) => {
//         console.log("error", err)
//     });