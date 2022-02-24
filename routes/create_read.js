const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { requireLoggedInUser, requireLoggedOutUser, requireNoSignature, requireSignature } = require('../middleware');


// ********* petition routers **********
router.get("/petition", requireNoSignature, (req, res) => {

    if (req.session.sigId) {
        res.redirect("/thanks");
        return;
    }

    db.getSignature(req.session.sigId).then(({ rows }) => {
        //console.log('userSignatureCompare', rows)

    })



    res.render("petition", {
        layout: "main"
    })
});

router.post("/petition", requireNoSignature, (req, res) => {
    const { signature } = req.body;
    if (signature === "") {
        res.render("error", {
            layout: "main",
        })
    }

    db.addPetition(req.session.userId, signature)
        .then(({ rows }) => {
            //console.log('rows in addpetition', rows)

            req.session.sigId = rows[0].id;
            res.redirect("/thanks");

        })
        .catch((err) => {
            console.log("error", err);

        });

});

// ********* profile routers ***********

router.get("/profile", (req, res) => {

    res.render("profile", {
        layout: "main"
    })

})

router.post("/profile", (req, res) => {
    const { age, city, url } = req.body;
    let securedUrl;
    //url http https control
    if (url.startsWith("http://") || url.startsWith("https://")) {
        securedUrl = url;
    } else {
        securedUrl = "";
    }

    db.addProfileInfo(age, city, securedUrl, req.session.userId).then(({ rows }) => {

        res.redirect("/petition");

    })
        .catch((err) => {
            console.log("error", err);
            res.render("error", {
                layout: "main",
            })

        });

})

// ********* thanks get signatures routers ***********
router.get("/thanks", requireSignature, (req, res) => {

    let countRows;

    db.countSigners()
        .then(({ rows }) => {
            countRows = rows;

            console.log("req.session.sigId...", req.session.sigId)
            return db.getSignature(req.session.userId);

        })
        .then(({ rows }) => {
            console.log("rows.. in thanks", rows)

            res.render("thanks", {
                layout: "main",
                numberOfSigners: countRows[0].count,
                img: rows[0].signature

            })
        })
        .catch((err) => {
            console.log("error", err);

        });

});


// ********* singers && signers_same_city routers ***********
router.get("/signers", requireSignature, (req, res) => {
    console.log('req.session', req.session.userId)

    db.getProfileInfo()
        .then(({ rows }) => {
            console.log("signers route rows:", rows);
            res.render("signers", {
                layout: "main",
                AllSigners: rows

            })

        })
        .catch((err) => {
            console.log("error in db.getProfileInfo", err);

        });


});

router.get("/signers/:city", requireSignature, (req, res) => {

    db.getSameCitySigners(req.params.city)
        .then(({ rows }) => {
            console.log('rows', rows)
            return res.render("signers_same_city", {
                layout: "main",
                allSameCitySigners: rows

            });
        });



});

module.exports = router;