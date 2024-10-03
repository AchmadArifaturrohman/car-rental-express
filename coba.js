const text = "Hello World";
const dropHeight = 10; // Number of lines to drop
const runWidth = 100; // Number of spaces to run horizontally
let currentLine = 0;
let currentColumn = 0;
let direction = 1; // 1 for right, -1 for left

// Core Module
const os = require("os");
const fs = require("fs");

// Local Module
const luasSegitiga = require('./luasSegitiga');




console.log(os.platform());
console.log(os.type());
console.log(os.version());
console.log(os.freemem());
console.log(os.homedir());
console.log(os.hostname());
console.log(os.tmpdir());
console.log(os.userInfo());
console.log(os.networkInterfaces())


for (let i = 1; i <= 100; i++) {
    fs.writeFileSync("hello.txt", `ما هو الكاتب العربي؟ الكاتب العربي هو برنامج صمم لكي يساعد المصممين العرب في الكتابة بالبرامج التي لا تدعم اللغة العربية Luas Segitiga dengan alas ${i} dan tinggi ${i + 1} adalah ${luasSegitiga(i, i + 1)} cm\n`, { flag: 'a' });
}

for (let i = 1; i <= 100; i++) {
    console.log(fs.readFileSync("hello.txt", "utf-8"));
}
