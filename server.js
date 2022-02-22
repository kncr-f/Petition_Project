const express = require("express");
const db = require("./database/db");

const app = express();
app.use(express.urlencoded({ extended: false }));



//Handlebars
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.static("./public"));

//cookieSession
const cookieSession = require('cookie-session');

app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true
}));


app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main"
    })
});

app.post("/register", (req, res) => {
    const { first, last, email, password } = req.body;
    const { compare, hash } = require("./bc");

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
                    res.redirect("/petition");

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

app.get("/login", (req, res) => {

    res.render("login", {
        layout: "main"
    })

});


app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const { compare, hash } = require("./bc");

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
                    console.log('results', results)
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


app.get("/petition", (req, res) => {

    if (req.session.sigId) {
        res.redirect("/thanks");
        return;
    }

    db.getSignature(req.session.sigId).then(({ rows }) => {
        console.log('userSignatureCompare', rows)

    })



    res.render("petition", {
        layout: "main"
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
            console.log('rows in addpetition', rows)

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

// app.get("/signers", (req, res) => {
//     db.getAllSigners().then(({ rows }) => {
//         res.render("signers", {
//             layout: "main",
//             AllSigners: rows
//         })
//     })
//         .catch((err) => {
//             console.log("error", err);

//         });


// })




app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});

app.listen(8080, () => console.log("Server listening"));






