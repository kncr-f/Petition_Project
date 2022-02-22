//spiced-pg ==> the node-postgres package
const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:pstgres@localhost:5432/petition`);


module.exports.addUser = (first, last, email, password) => {
    return db.query(`
    INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING first, last, email, password, Id
    
    `, [first, last, email, password]);
}

module.exports.addPetition = (user_id, signature) => {
    return db.query(`
    INSERT INTO signatures (user_id, signature)
    VALUES ($1, $2)
    RETURNING user_id, signature, id
    
    `, [user_id, signature]);
}

module.exports.getUser = (email) => {
    return db.query(`SELECT password, id FROM users WHERE email = $1`, [email]);
}

module.exports.getSignature = (sigId) => {
    return db.query(`SELECT signature, id FROM signatures WHERE user_id = $1`, [sigId]);
}

module.exports.countSigners = () => {
    return db.query(`SELECT COUNT(*) FROM signatures`);
}

module.exports.getAllSigners = () => {
    return db.query(`SELECT * FROM users`);
}




