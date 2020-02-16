let http = require("http");
let os = require("os");
let port = 1234;
let fs = require("fs");
let path = require("path");
var folder = path.join(".","serverData")

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
	var data = JSON.parse(fs.readFileSync(path.join(folder,"data.json"), "utf-8"));
	console.log(arr);
    var out = handle(arr, data);
    console.log(out);
	fs.writeFileSync(path.join(folder,"data.json"), JSON.stringify(data, null, 4), "utf8");
	res.write(JSON.stringify(out));
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
	if (obj.target == "user") {
		if (obj.action == "create") {
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
						password: obj.password
					});
				}
			} else {
				outputObj.success = false;
				outputObj.errorMessage = "Invalid username/password";
			}
		} else {
			outputObj.success = false;
			outputObj.errorMessage = "Cannot request user";
		}
	} else if (obj.target == "conversation") {
		if (verifyUser(obj.username, obj.password, jsonData)) {
			var allConversations = jsonData.conversations;

			if (obj.action == "request") {
				var outConversations = [];

				for (var i = 0; i < allConversations.length; i++) {
					var conversationObj = allConversations[i];
					var presentUser = false;
					for (var j = 0; j < conversationObj.authUsers.length; j++) {
						if (conversationObj.authUsers[j] == obj.username) {
							presentUser = true;
						}
					}
					if (presentUser) {
						outConversations.push(conversationObj);
					}
				}

				outputObj.data = outConversations;
			} else if (obj.action == "create") {
                obj.data = JSON.parse(obj.data);
				var alreadypresent = false;
				for (var i = 0; i < allConversations.length; i++) {
                    var conversationObj = allConversations[i];
                    if(conversationObj.title == obj.data.title)
                    {
                        alreadypresent = true;
                    }
				}
				if (alreadypresent) {
					outputObj.success = false;
					outputObj.errorMessage = "Invalid action";
				} else {
					obj.data.id = jsonData.conversationCounter + 1;
					jsonData.conversationCounter += 1;
					jsonData.conversations.push(obj.data);
				}
			} else {
				outputObj.success = false;
				outputObj.errorMessage = "Invalid action";
			}
		} else {
			outputObj.success = false;
			outputObj.errorMessage = "Invalid user credentials";
		}

		// var found = false;
		// var conversationObj = [];
		// for (var i = 0; i < jsonData.conversations.length; i++) {
		// 	var conversation = jsonData.conversations[i];
		// 	if (conversation.id == obj.id) {
		// 		found = true;
		// 		conversationObj = conversation;
		// 	}
		// }
		// if (found && obj.action == "request") {
		//     for(var i = 0; i < conversationObj.authUsers.length; i++)
		//     {
		//         var user = conversationObj.authUsers[i];
		//         if(user == obj.username && verifyUser(user,obj.password))
		//         {
		//             outputObj.data = conversationObj;
		//         }else{
		//             outputObj.success = false;
		//             outputObj.errorMessage = "Invalid user credentials";
		//         }
		//     }
		// } else if(found && obj.action{

		// 	outputObj.success = false;
		// 	outputObj.errorMessage = "Invalid conversation id";
		// }
	} else if (obj.target == "message") {
		if (verifyUser(obj.username, obj.password, jsonData)) {
			var groupId = obj.id;
			var flag = true;
			for (var i = 0; i < jsonData.conversations.length; i++) {
				if (
					jsonData.conversations[i].id == groupId &&
					auth(jsonData.conversations[i].authUsers, obj.username)
				) {
					flag = false;
					if (obj.action == "request") {
                        console.log("REQUEST MESSAGE");
						outputObj.data = [];
						for (var j = 0; j < jsonData.messages.length; j++) {
							if (""+jsonData.messages[j].authConversation == groupId+"") {
								outputObj.data.push(jsonData.messages[j]);
							}
                        }
					} else if (obj.action == "create") {
						var tempMsg = JSON.parse(obj.data);
						jsonData.messages.push(tempMsg);
					} else {
						outputObj.success = false;
						outputObj.errorMessage = "Invalid action";
					}
				}
			}
			if (flag) {
				outputObj.success = false;
				outputObj.errorMessage = "Invalid group credentials";
			}
		} else {
			outputObj.success = false;
			outputObj.errorMessage = "Invalid user credentials";
		}
	} else {
		outputObj.success = false;
		outputObj.errorMessage = "Invalid input query";
	}
    return outputObj;
}
function auth(arr, user) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == user) {
			return true;
		}
	}
	return false;
}
function verifyUser(user, passwd, jsonObject) {
	for (var i = 0; i < jsonObject.users.length; i++) {
		if (jsonObject.users[i].username == user) {
			if (jsonObject.users[i].password == passwd) {
				return true;
			} else {
				return false;
			}
		}
	}
	return false;
}
