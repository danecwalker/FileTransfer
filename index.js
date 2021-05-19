const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require('multer');
const QRCode = require('qrcode');
const DB = require('./db');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './store')
    },
    filename: function (req, file, cb) {
        var h = crypto.createHash('md5');
        h.update(file.originalname);
        var id = h.digest('hex');
        var parts = file.originalname.split('.');
        var ext = parts[parts.length-1];
        DB.AddFile(id, `./store/${id}.${ext}`, ext)
        cb(null, `${id}.${ext}`);
    }
})

var upload = multer({
    storage: storage
}).single('file');



const app = express();


// middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: false
})); // this is to handle URL encoded data

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')


// enable static files pointing to the folder "public"
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/download/:filed", (req, res) => {
    const {
        filed
    } = req.params;

    DB.GetFiles().then((files) => {

        var candidates = files.filter(file => file.fileId === filed)
        console.log(candidates)
        if (candidates.length > 0) {
            const {fileId, filePath, fileExt} = candidates[0];
            res.render('download', {
                fileId,
                filePath,
                fileExt
            })
        } else {
            res.render('notE')
        }
    })
})

app.post("/download/:fileP", (req, res) => {
    const {
        fileP
    } = req.params;

    DB.GetFiles().then((files) => {

        var candidates = files.filter(file => file.fileId === fileP).map(file => file.filePath)
        if (candidates.length > 0) {
            res.download(candidates[0], (err) => {
                if (err) throw err;

                fs.unlink(candidates[0], (err) => {
                    if (err) throw err;

                    DB.RemoveFile(fileP);
                })
            })
        } else {
            res.render('notE')
        }
    })
})

app.get("/success/:fileId", (req, res) => {
    const {
        fileId
    } = req.params;

    const {
        qrcode
    } = req.query;

    DB.GetFiles().then((files) => {

        var candidates = files.filter(file => file.fileId === fileId).map(file => (
            file.fileId
        ))

        if(candidates.length > 0) {

            if (qrcode === 'true') {
                QRCode.toDataURL(`http://${req.headers.host}/download/${candidates[0]}`, function (err, url) {
                    res.render('qrCode', {code:url})
                })
            } else {
                res.render('options', {
                    file: `http://${req.headers.host}/download/${candidates[0]}`
                })
            }
        } else {
            res.render('notE')
        }
    })
})

app.post("/upload", upload, async (req,res) => {
    var files = await DB.GetFiles();

    res.json({
        fileId: files[files.length-1].fileId
    })
})


// set port from environment variable, or 8080
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));