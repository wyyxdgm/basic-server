var fs = require("fs");

function error(res, msg, code) {
    if (typeof msg == "object")
        msg = JSON.stringify(msg, undefined);
    if (code)
        res.send({
            success: false,
            msg: msg,
            code: code
        });
    else
        res.send({
            success: false,
            msg: msg
        });
}

function success(res, data, code) {
    if (code)
        res.send({
            success: true,
            data: data,
            code: code
        });
    else
        res.send({
            success: true,
            data: data
        });
}

function sendFile(res, file) {
    if (!fs.existsSync(file))
        res.status(404).send({
            msg: "not found"
        });
    else
        fs.createReadStream(file).pipe(res);
}

function sendImage(res, file) {
    sendFile(res, file);
}

// function sendClientEncrypt(res, json) {
//     if (json) {
//         return res.send(libEncrypt.cejson2str(json));
//     }
//     return res.send(json);
// }

function sendErr(res, msg, code) {
    if (typeof msg == "object")
        msg = JSON.stringify(msg, undefined);
    if (code)
        res.send({
            error: msg,
            errorCode: code
        });
    else
        res.send({
            error: msg
        });
}

function sendJson(res, json) {
    res.send(json);
}

module.exports.sendErr = sendErr;
module.exports.sendJson = sendJson
module.exports.error = error;
module.exports.success = success
module.exports.sendFile = sendFile;
module.exports.sendImage = sendImage;
