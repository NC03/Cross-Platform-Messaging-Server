let http = require("http");
let os = require("os");
let port = 1234;
let fs = require("fs");

var ifaces = os.networkInterfaces()["wlp58s0"];
for (var i = 0; i < ifaces.length; i++) {
	console.log(`Interface ${i + 1}: ${ifaces[i].address}`);
}
console.log(`Listening on port ${port}`);

http.createServer((req, res) => {
	var q = require("url").parse(req.url, true).query;
	var arr = [];
	for (a in q) {
		var obj = [];
		obj.push(a);
		obj.push(q[a]);
		arr.push(obj);
	}
	var data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
	console.log(arr);
	handle(arr, data);
	fs.writeFileSync("data.json", JSON.stringify(data, null, 4), "utf8");
	res.write("Hello World!");
	res.end();
}).listen(port);

function handle(keyValues, jsonData) {
	var outputObj = {
		success: true
	};
	var obj = {};
	for (var i = 0; i < keyValues.length; i++) {
		obj[keyValues[i][0]] = keyValues[i][1];
	}
	if (obj.action == "request") {
	} else if (obj.action == "create") {
		if (obj.target == "user") {
			if (obj.username != null && obj.password != null) {
				//Sent password must not be empty string
				var present = false;
				for (var j = 0; j < jsonData.users.length; j++) {
					console.log(jsonData.users[j]);
					if (jsonData.users[j].username == obj.username) {
						present = true;
					}
				}
				if (present) {
					outputObj.success = false;
					outputObj.errorMessage = `There is already user \"${obj.username}\"`;
				} else {
					jsonData.users.push({
						username: obj.username,
						saltedpassword: obj.password
					});
				}
			} else {
				outputObj.success = false;
				outputObj.errorMessage = "Invalid username/password";
			}
		} else if (obj.target == "conversation") {
		} else if (obj.target == "message") {
		}
	} else {
		outputObj.success = false;
		outputObj.errorMessage = "Invalid input query";
    }
    console.log(outputObj);
}
