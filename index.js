let http = require("http");
let url = require("url");

console.log(http.METHODS);
console.log(http.STATUS_CODES);

http.createServer((req, res) => {
	var q = require("url").parse(req.url, true).query;
	console.log(q);
	res.write("Hello World!");
	res.end();
}).listen(1234);

// http.createServer(function(req, res) {
// 	const { method, url } = req;
// 	const { headers } = req;
// 	const userAgent = headers["user-agent"];
// 	console.log(method);
// 	console.log(url);
// 	console.log(headers);
// 	console.log(userAgent);
// 	// console.log(postHTML);
// 	// console.log(req);
// 	res.writeHead(200, { "Content-Type": "text/html" });
// 	res.write("Hello World!");
// 	res.write(req.url);
// var q = url.parse(req.url, true).query;
// 	// var txt = q.year + " " + q.month;
// 	// res.end(txt);
// 	res.end();
// }).listen(8080);

// http.createServer(function (req, res) {
//     var body = "";
//     req.on('data', function (chunk) {
//       body += chunk;
//     });
//     req.on('end', function () {
//       console.log('POSTed: ' + body);
//       res.writeHead(200);
//       res.end(postHTML);
//     });
//   }).listen(8081);
