const express = require("express");
const db = require("./database/db");
const app = express();
//const profileRoutes = require("./routes/profile_routes");
app.use(express.urlencoded({ extended: false }));
//Handlebars
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

const { compare, hash } = require("./bc");


app.use(express.static("./public"));

//cookieSession
const cookieSession = require('cookie-session');

app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true
}));



app.use('/', require('./routes/auth_routing'));
// app.use('/', require('./routes/create_read'));





app.get("/petition", (req, res) => {

    if (req.session.sigId) {
        res.redirect("/thanks");
        return;
    }

    db.getSignature(req.session.sigId).then(({ rows }) => {
        //console.log('userSignatureCompare', rows)
        res.render("petition", {
            layout: "main"
        })

    })

});


app.post("/petition", (req, res) => {
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

app.get("/thanks", (req, res) => {

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

app.get("/signers", (req, res) => {
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

app.get("/signers/:city", (req, res) => {

    db.getSameCitySigners(req.params.city)
        .then(({ rows }) => {
            console.log('rows', rows)
            return res.render("signers_same_city", {
                layout: "main",
                allSameCitySigners: rows

            });
        });



});



app.get("/edit_profile", (req, res) => {
    console.log('req.session.userId', req.session.userId)
    db.getUserDataForEdit(req.session.userId).then(({ rows }) => {
        //console.log('rows in editProfile', rows);
        res.render("edit_profile", {
            layout: "main",
            editUserData: rows
        })
    })

});

app.post("/edit_profile", (req, res) => {
    const { first, last, email, password, age, city, url } = req.body;
    console.log('req.body', req.body);
    if (password) {
        hash(password)
            .then((hashedPassword) => {
                let firstData;
                db.editUserDataWithPassword(first, last, email, hashedPassword, req.session.userId)
                    .then(({ rows }) => {
                        firstData = rows;
                        console.log("requieredData..", firstData)
                        // res.redirect("/thanks");
                        return db.editOptionalDatas(age, city, url, req.session.userId)
                    })
                    .then(({ rows }) => {
                        console.log("editOptionalDatas..", rows)
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
                console.log('db passed');
                console.log('rows in post_edit_profile withoutpassword', rows);
                // res.redirect("/thanks");
                // return
                return db.editOptionalDatas(age, city, url, req.session.userId)


            })
            .then(({ rows }) => {
                console.log("editOptionalDatas..", rows)
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


app.post("/thanks", (req, res) => {
    //const {user_id} = req.body;
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


app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});

app.listen(process.env.PORT || 8080, () => console.log("Server listening"));






