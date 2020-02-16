let fs = require("fs");
let path = require("path");

var folder = path.join(".","serverData")

if(!fs.existsSync(folder))
{
    fs.mkdirSync(path.join(".","serverData"));
}
var data = {
    "users":[],
    "messages":[],
    "conversations":[],
    "conversationCounter":1
}
fs.writeFileSync(path.join(folder,"data.json"), JSON.stringify(data, null, 4), "utf8");
