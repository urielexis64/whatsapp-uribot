const fs = require("fs");

exports.help = () => fs.readFileSync("database/info/help.txt", {encoding: "utf-8"});
exports.terms = () => fs.readFileSync("database/info/terms.txt", {encoding: "utf-8"});
exports.info = () => fs.readFileSync("database/info/info.txt", {encoding: "utf-8"});
exports.donate = () => fs.readFileSync("database/info/donate.txt", {encoding: "utf-8"});
exports.cmds = () => fs.readFileSync("database/info/commands.txt", {encoding: "utf-8"});
