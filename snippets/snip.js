
var url = ["hii","bye"]
var encoded = new Buffer(url).toString('base64');
var decoded = new Buffer(encoded, 'base64').toString('ascii')

console.log(encoded);
console.log(decoded);