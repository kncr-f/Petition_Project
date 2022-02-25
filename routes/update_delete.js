const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { requireLoggedInUser, requireLoggedOutUser, requireNoSignature, requireSignature } = require('../middleware');
const { compare, hash } = require("../bc");

router.get("/edit_profile", (req, res) => {
    //  console.log('req.session.userId', req.session.userId)
    db.getUserDataForEdit(req.session.userId).then(({ rows }) => {
        //console.log('rows in editProfile', rows);
        res.render("edit_profile", {
            layout: "main",
            editUserData: rows
        })
    })

});

router.post("/edit_profile", (req, res) => {
    const { first, last, email, password, age, city, url } = req.body;
    // console.log('req.body', req.body);
    if (password) {
        hash(password)
            .then((hashedPassword) => {
                let firstData;
                db.editUserDataWithPassword(first, last, email, hashedPassword, req.session.userId)
                    .then(({ rows }) => {
                        firstData = rows;
                        return db.editOptionalDatas(age, city, url, req.session.userId)
                    })
                    .then(({ rows }) => {

                        res.redirect("/thanks");
                    })
                    .catch((err) => {
                        console.log("error", err);
                        res.render("error", {
                            layout: "main",
                        })

                    });

            })
            .catch((err) => {
                console.log("error", err);
                res.render("error", {
                    layout: "main",
                })

            });

    }
    else {
        db.editUserDataWithoutPassword(first, last, email, req.session.userId)
            .then(({ rows }) => {

                return db.editOptionalDatas(age, city, url, req.session.userId)


            })
            .then(({ rows }) => {

                res.redirect("/thanks");
            })
            .catch((err) => {
                console.log("error", err);
                res.render("error", {
                    layout: "main",
                })

            });

    }

})


router.post("/thanks", requireSignature, (req, res) => {

    db.deleteSignature(req.session.userId)
        .then(({ rows }) => {

            req.session.sigId = null;
            res.redirect("/petition")
        })
        .catch((err) => {
            console.log("error", err);
            res.render("error", {
                layout: "main",
            })

        });
})

module.exports = router;