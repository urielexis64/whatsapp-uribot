const fetch = require("node-fetch");
const {getBase64} = require("./fetcher");
const request = require("request");
const emoji = require("emoji-regex");
const fs = require("fs-extra");

const songLyrics = async (query) => {
	const response = await fetch(`http://scrap.terhambar.com/lirik?word=${query}`);
	if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
	const json = await response.json();
	if (json.status === true) return `Lyrics: ${lagu}\n\n${json.result.lirik}`;
	return `[Error] Lyrics not found.`;
};

const emojiStrip = (string) => {
	return string.replace(emoji, "");
};

const fb = async (url) => {
	const response = await fetch(`http://scrap.terhambar.com/fb?link=${url}`);
	if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
	const json = await response.json();
	if (json.status === true)
		return {
			capt: json.result.title,
			exts: ".mp4",
			url: json.result.linkVideo.sdQuality,
			urlHd: json.result.linkVideo.hdQuality,
		};
	return {
		capt: "*[ERROR] Video not found!*",
		exts: ".jpg",
		url: "https://help.rockcontent.com/hs-fs/hubfs/saedx-blog-featured-70.jpg?width=439&name=saedx-blog-featured-70.jpg",
	};
};

const ss = async (query) => {
	request(
		{
			url: "https://api.apiflash.com/v1/urltoimage",
			encoding: "binary",
			qs: {
				access_key: "2fc9726e595d40eebdf6792f0dd07380",
				url: query,
			},
		},
		(error, response, body) => {
			if (error) {
				console.log(error);
			} else {
				fs.writeFile("./media/img/screenshot.jpeg", body, "binary", (error) => {
					console.log(error);
				});
			}
		}
	);
};

const cheemsify = (text) => {
	return text.replace(/[aáeéiíoóuú]+[^aáeéiíoóuúmnñry]/gi, (value) => {
		const pre = value.slice(0, value.length - 1);
		const post = value[value.length - 1];
		return pre + "m" + post;
	});
};

const random = async (type) => {
	var url = "https://nekobot.xyz/api/image?type=";

	const image = await fetch(url + type);
	if (!image.ok) throw new Error(`unexpected response ${image.statusText}`);
	const result = await image.json();
	return result.message;
};

const sleep = async (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const changelog = `*CHANGELOG*\n\nv1.2.0\n25/05/2021\n*[CHANGED]* Command prefix changed from ! to /\n*[CHANGED]* randomCat (cat before)\n*[NEW]* randomDog\n*[NEW]* xvid [term]\n*[NEW]* test\n*[NEW]* changelog\n*[IMPROVED]* ytmp4 [term] or [link]\n*[NEW]* igStalk [username]\n*[OTHER]* Translated some command answers\n*[OTHER]* Fix some bugs`;

exports.songLyrics = songLyrics;
exports.fb = fb;
exports.random = random;
exports.cheemsify = cheemsify;
exports.emojiStrip = emojiStrip;
exports.sleep = sleep;
exports.ss = ss;
exports.changelog = changelog;
