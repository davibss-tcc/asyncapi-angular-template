const fs = require("fs");

function fileExists(path) {
    var result = false;
    result = fs.existsSync(path);
    return result;
}

export {
    fileExists
}