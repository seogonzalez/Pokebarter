
const mysql = require('mysql2/promise');


let connection;

async function connect() {
    connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1234",
        database: "pokebarter"
    });
}

async function close() {
    if (connection) {
        await connection.end();
    }
}

async function getUserByUsername(username) {
    const [user] = await connection.execute(
        'SELECT * FROM user WHERE username = ?', [username]
    );
    return user[0];
}

module.exports = { connect, close, getUserByUsername };