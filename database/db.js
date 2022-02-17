const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:pstgres@localhost:5432/petition`);


module.exports.addPetition = (first, last, signature) => {
    return db.query(`
    INSERT INTO signatures (first, last, signature)
    VALUES ($1, $2, $3)
    RETURNING first, last, signature
    
    `, [first, last, signature]); //${city}, ${pop}, ${country} for avoiding vulnebirilities
} 

module.exports.getAllSigners = () => {
    return db.query(`SELECT * FROM signatures`);
}







// module.exports.getAllCities = () => {
//     return db.query(`SELECT * FROM cities`);
// }
// module.exports.addCity = (city, pop, country) => {
//     return db.query(`
//     INSERT INTO cities (city, population, country)
//     VALUES ($1, $2, $3)
//     RETURNING city, country
    
//     `, [city, pop, country]); //${city}, ${pop}, ${country} for avoiding vulnebirilities
// } 

