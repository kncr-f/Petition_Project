const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { compare, hash } = require("../bc");
const { requireLoggedInUser, requireLoggedOutUser, requireNoSignature, requireSignature } = require('../middleware');


// ******** register routers **********

router.get("/register", requireLoggedOutUser, (req, res) => {
    res.render("register", {
        layout: "main"
    })
});

router.post("/register", requireLoggedOutUser, (req, res) => {
    const { first, last, email, password } = req.body;


    if (first === "" || last === "" || email === "" || password === "") {
        res.render("error", {
            layout: "main",
        })
    }

    hash(password)
        .then((hashedPassword) => {

            db.addUser(first, last, email, hashedPassword)
                .then(({ rows }) => {

                    req.session.userId = rows[0].id;
                    res.redirect("/profile");

                })
                .catch((err) => {
                    console.log("error", err);
                    res.render("error", {
                        layout: "main",
                    })

                });

        })
        .catch((err) => {
            console.log('err with hashing issue', err)
        })
});





// ********* login routers ************

router.get("/login", requireLoggedOutUser, (req, res) => {

    res.render("login", {
        layout: "main"
    })

});


router.post("/login", requireLoggedOutUser, (req, res) => {
    const { email, password } = req.body;


    if (email === "" || password === "") {
        res.render("error", {
            layout: "main",
        })
    }

    db.getUser(email).then(({ rows }) => {

        compare(password, rows[0].password).then((match) => {

            if (match) {

                req.session.userId = rows[0].id;
                db.getSignature(req.session.userId).then((results) => {

                    if (results.rows.length) {
                        req.session.sigId = results.rows[0].id

                        res.redirect("/thanks");
                        return;

                    } else {
                        res.redirect("/petition");
                    }
                })

            }
            else {
                res.render("error", {
                    layout: "main",
                })
            }

        })
            .catch((err) => {
                console.log(err);
                res.render("error", {
                    layout: "main",
                })
            })

    })
        .catch((err) => {
            console.log(err);
            res.render("error", {
                layout: "main",
            })
        })

})


module.exports = router;