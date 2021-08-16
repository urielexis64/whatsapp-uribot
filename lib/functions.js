const fetch = require("node-fetch");
//const {getBase64} = require("./fetcher");
const strto2 = require("str-to-2");
const request = require("request");
const emoji = require("emoji-regex");
const fs = require("fs-extra");
const {translate: trans} = require("deepl-scraper");
const {isBinary} = require("../tools");
const jimp = require("jimp");

const songLyrics = async (query) => {
	const response = await fetch(`http://scrap.terhambar.com/lirik?word=${query}`);
	if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
	const json = await response.json();
	if (json.status) return `Lyrics: *${query}*\n\n${json.result.lirik}`;
	return `*[ERROR]* Lyrics not found.`;
};

const emojiStrip = (string) => {
	return string.replace(emoji, "");
};

const translate = async (query, target = "es-ES") => {
	if (isBinary(query)) {
		return await toBinary(query);
	}
	const result = await trans(query, "auto", target)
		.then((res) => {
			if (target.substring(0, 2) === res.source.lang) {
				return query;
			}
			return res.target.translation;
		})
		.catch(console.log);
	return result;
};

const toBinary = async (binaryText) => {
	let toRtext = await strto2.toR(binaryText);
	return toRtext;
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

const invert = async (senderId, image) => {
	const imagePath = `img/${senderId}_invert.png`;
	const newImage = await jimp.read(image);
	await newImage.invert().writeAsync(imagePath);
	return imagePath;
};

const blur = async (senderId, image) => {
	const imagePath = `img/${senderId}_blur.png`;
	const newImage = await jimp.read(image);
	await newImage.blur((r = 8)).writeAsync(imagePath);
	return imagePath;
};
const pixelate = async (senderId, image) => {
	const imagePath = `img/${senderId}_pixelate.png`;
	const newImage = await jimp.read(image);
	await newImage.pixelate(50).writeAsync(imagePath);
	return imagePath;
};

const scaleToFit = async (senderId, image) => {
	const imagePath = `img/${senderId}_scaleToFit.png`;
	const newImage = await jimp.read(image);
	await newImage.scaleToFit(1280, 720, jimp.RESIZE_BICUBIC).writeAsync(imagePath);
	return imagePath;
};

const convolution = async (senderId, image) => {
	const imagePath = `img/${senderId}_convolution.png`;
	const newImage = await jimp.read(image);
	await newImage
		.convolution([
			[-1, 1, 1],
			[0, -1, 1],
			[0, 0, -1],
		])
		.writeAsync(imagePath);
	return imagePath;
};

exports.songLyrics = songLyrics;
exports.translate = translate;
exports.random = random;
exports.cheemsify = cheemsify;
exports.emojiStrip = emojiStrip;
exports.ss = ss;
exports.invert = invert;
exports.blur = blur;
exports.pixelate = pixelate;
exports.scaleToFit = scaleToFit;
exports.convolution = convolution;
