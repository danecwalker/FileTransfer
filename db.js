// const sqlite3 = require('sqlite3').verbose();

function GetFiles() {

    // open the database
    let db = new sqlite3.Database('./db/main.db');

    let sql = `SELECT * FROM files`;


    return new Promise((res, rej) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                rej(err);
            }
            res(rows);
        });

        db.close()
    });
}

function AddFile(fileId, filePath, fileExt) {
    // open the database
    let db = new sqlite3.Database('./db/main.db');

    let sql = `INSERT INTO files VALUES ("${fileId}", "${filePath}", "${fileExt}")`;

    db.run(sql, (res, err)=>{
        if (err) {
            throw err;
        }
    });

    // close the database connection
    db.close();
}

function RemoveFile(fileId) {
    let db = new sqlite3.Database('./db/main.db');

    let sql = `DELETE FROM files WHERE fileId = "${fileId}"`;

    db.run(sql, (res, err) => {
        if (err) {
            throw err;
        }
    });

    // close the database connection
    db.close();
}

module.exports = {
    GetFiles,
    AddFile,
    RemoveFile
}