//spiced-pg ==> the node-postgres package
const spicedPg = require("spiced-pg");
const db = spicedPg(process.env.DATABASE_URL ||
    `postgres:postgres:pstgres@localhost:5432/petition`);


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

module.exports.addProfileInfo = (age, city, url, user_id) => {
    return db.query(`
    INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1,$2,$3,$4)
    `, [age || null, city || null, url || null, user_id])
}

module.exports.getProfileInfo = () => {
    return db.query(`SELECT users.first AS first_name, 
                            users.last AS last_name, 
                            user_profiles.age, 
                            user_profiles.city, 
                            user_profiles.url
                            FROM users 
                            LEFT JOIN user_profiles
                            ON users.id = user_profiles.user_id
                            JOIN signatures
                            ON signatures.user_id = user_profiles.user_id`)

}

module.exports.getSameCitySigners = (city) => {
    return db.query(`SELECT users.first AS first_name, 
                            users.last AS last_name, 
                            user_profiles.age, 
                            user_profiles.city, 
                            user_profiles.url
                            FROM users 
                            FULL OUTER JOIN user_profiles 
                            ON users.id = user_profiles.user_id
                            WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
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

module.exports.getUserDataForEdit = (user_id) => {
    return db.query(`SELECT users.first AS first_name, 
                            users.last AS last_name,
                            users.email, 
                            user_profiles.age, 
                            user_profiles.city, 
                            user_profiles.url
                            FROM users 
                            LEFT JOIN user_profiles
                            ON users.id = user_profiles.user_id
                            WHERE user_id = $1`, [user_id]
    )
}

module.exports.editUserDataWithPassword = (first, last, email, password, id) => {
    return db.query(`
    UPDATE users
    SET first = $1, last = $2, email= $3, password = $4
    WHERE id = $5
    `,
        [first, last, email, password, id]
    );
}

module.exports.editUserDataWithoutPassword = (first, last, email, id) => {
    return db.query(`
    UPDATE users 
    SET  first = $1, last = $2, email= $3
    WHERE id = $4
    `, [first, last, email, id]);
}

module.exports.editOptionalDatas = (age, city, url, user_id) => {
    return db.query(`
    INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1,$2,$3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, city = $2, url = $3
  
    `, [age || null, city || null, url || null, user_id])
}


module.exports.deleteSignature = (id) => {
    return db.query(`
    DELETE FROM signatures WHERE user_id = $1
    `, [id]);
}
// UPDATE table_name
//  SET column1 = value1, column2 = value2, ...
//  WHERE condition; 