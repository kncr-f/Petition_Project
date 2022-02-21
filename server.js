const express = require("express");
const db = require("./database/db");

const app = express();
app.use(express.urlencoded({ extended: false }));


//bcrypt library
// const { compare, hash } = require("./bc");
// hash("alistairiscool89").then((hashedpassword) => {
//     console.log("hasedpassword", hashedpassword)
// })


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
            console.log('hashedPassword', hashedPassword);
            db.addUser(first, last, email, hashedPassword)
                .then(({ rows }) => {

                    console.log('adduser...', rows)
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

                if (req.session.sigId) {
                    res.redirect("/thanks");
                    return;
                }

                req.session.userId = rows[0].id;
                // db.getSignature(req.session.userId).then(({ rows }) => {
                //     console.log('rowsllll', rows)
                //})
                res.redirect("/petition")
                console.log('match', match);



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
            return db.getSignature(req.session.sigId);

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




// app.get("/thanks", (req, res) => {

//     let countRows;

//     db.countSigners()
//         .then(({ rows }) => {
//             countRows = rows;

//             return db.getSignature(req.session.sigId);

//         })
//         .then(({ rows }) => {
//             console.log('rows', rows)
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

/*

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main"
    })
});

app.post("/login", (req, res) => {
    const fakeHash = "$2a$10$OHsLo8x/zy9aXGI4IET.9etn2O3DlrKghdHwjuK6nPGCpaNyROWZ2";
    compare("alistairiscool89", fakeHash)
        .then((isMatch) => {
            console.log('does the pass match the one stored..', isMatch) //returns true
            // if this returns true set a cookie with the user's ID
            //something like req.session.userId
            //if this value is false, re-render the page with an appropriate message

        })
        .catch((err) => {
            console.log('err comparing password with stiored hash', err)
        })
})




app.get("/petition", (req, res) => {

    if (req.session.sigId) {
        res.redirect("/thanks");
        return;
    }

    res.render("petition", {
        layout: "main"
    })
});

app.post("/petition", (req, res) => {
    const { first, last, signature } = req.body;
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
        .catch((err) => {
            console.log("error", err);

        });

});

app.get("/signers", (req, res) => {
    db.getAllSigners().then(({ rows }) => {
        res.render("signers", {
            layout: "main",
            AllSigners: rows
        })
    })
        .catch((err) => {
            console.log("error", err);

        });


})

*/



