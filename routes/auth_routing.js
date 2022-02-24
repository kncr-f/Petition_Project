const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { compare, hash } = require("../bc");


// ******** register routers **********

router.get("/register", (req, res) => {
    res.render("register", {
        layout: "main"
    })
});

router.post("/register", (req, res) => {
    const { first, last, email, password } = req.body;


    if (first === "" || last === "" || email === "" || password === "") {
        res.render("error", {
            layout: "main",
        })
    }

    hash(password)
        .then((hashedPassword) => {
            //console.log('hashedPassword', hashedPassword);
            db.addUser(first, last, email, hashedPassword)
                .then(({ rows }) => {
                    // console.log('adduser...', rows)
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

router.get("/login", (req, res) => {

    res.render("login", {
        layout: "main"
    })

});


router.post("/login", (req, res) => {
    const { email, password } = req.body;


    if (email === "" || password === "") {
        res.render("error", {
            layout: "main",
        })
    }

    db.getUser(email).then(({ rows }) => {
        console.log('rows.. in post login', rows)
        compare(password, rows[0].password).then((match) => {

            if (match) {
                //console.log('match', match);
                req.session.userId = rows[0].id;
                db.getSignature(req.session.userId).then((results) => {
                    //console.log('results', results)
                    if (results.rows.length) {
                        req.session.sigId = results.rows[0].id

                        res.redirect("/thanks");
                        return;

                    } else {
                        res.redirect("/petition");
                    }
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