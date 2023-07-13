const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require('body-parser');
const { Parser } = require('driver-license-parser');

const app = express();

app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/upload", (req, res) => {
    try {
        const newpath = __dirname + "/files/";
        const file = req.files.file;
        const filename = file.name;

        console.log('newpath', newpath);
        file.mv(`${newpath}${filename}`, (err) => {
            if (err) {
                return res.status(500).send({ message: "File upload failed", code: 200 });
            }

            const dbr = require('barcode4nodejs');
            dbr.initLicense("DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==")
            dbr.decodeFileAsync(`${newpath}${filename}`, dbr.formats.OneD | dbr.formats.PDF417 | dbr.formats.QRCode | dbr.formats.DataMatrix | dbr.formats.Aztec, function (err, results) {
                if (err) {
                    return res.status(500).send({ message: "pdf417 failed", code: 200 });
                }

                let temp = []
                for (let i = 0; i < results.length; i++) {

                    let result = results[i];

                    const format = result?.format || '';
                    const value = result.value || '';
                    const data = format == 'PDF417' ? Parser(value) : value;
                    const time = result?.time || 0;

                    temp.push({
                        format: format,
                        data: data,
                        time: time
                    })
                }

                return res.status(200).send({
                    message: "File Uploaded",
                    code: 200,
                    data: temp
                });
            })

        });
    } catch (error) {
        console.log('file upload error', error)
    }
});

app.listen(5001, () => {
    console.log("Server running successfully on 5001");
});