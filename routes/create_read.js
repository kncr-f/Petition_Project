// const express = require("express");
// const router = express.Router();
// const db = require("../database/db");
// const { compare, hash } = require("../bc");

// router.get("/petition", (req, res) => {

//     if (req.session.sigId) {
//         res.redirect("/thanks");
//         return;
//     }

//     db.getSignature(req.session.sigId).then(({ rows }) => {
//         //console.log('userSignatureCompare', rows)

//     })



//     res.render("petition", {
//         layout: "main"
//     })
// });

// router.post("/petition", (req, res) => {
//     const { signature } = req.body;
//     if (signature === "") {
//         res.render("error", {
//             layout: "main",
//         })
//     }

//     db.addPetition(req.session.userId, signature)
//         .then(({ rows }) => {
//             //console.log('rows in addpetition', rows)

//             req.session.sigId = rows[0].id;
//             res.redirect("/thanks");

//         })
//         .catch((err) => {
//             console.log("error", err);

//         });

// });

// router.get("/thanks", (req, res) => {

//     let countRows;

//     db.countSigners()
//         .then(({ rows }) => {
//             countRows = rows;

//             console.log("req.session.sigId...", req.session.sigId)
//             return db.getSignature(req.session.userId);

//         })
//         .then(({ rows }) => {
//             console.log("rows.. in thanks", rows)

//             res.render("thanks", {
//                 layout: "main",
//                 numberOfSigners: countRows[0].count,
//                 img: rows[0].signature

//             })
//         })
//         .catch((err) => {
//             console.log("error", err);

//         });

// });

// router.get("/signers", (req, res) => {
//     console.log('req.session', req.session.userId)

//     db.getProfileInfo()
//         .then(({ rows }) => {
//             console.log("signers route rows:", rows);
//             res.render("signers", {
//                 layout: "main",
//                 AllSigners: rows

//             })

//         })
//         .catch((err) => {
//             console.log("error in db.getProfileInfo", err);

//         });


// });

// router.get("/signers/:city", (req, res) => {

//     db.getSameCitySigners(req.params.city)
//         .then(({ rows }) => {
//             console.log('rows', rows)
//             return res.render("signers_same_city", {
//                 layout: "main",
//                 allSameCitySigners: rows

//             });
//         });



// });