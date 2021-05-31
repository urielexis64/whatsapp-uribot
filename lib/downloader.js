const ytdl = require("ytdl-core");
const youtube = require("scrape-youtube").default;
const instagramGetUrl = require("instagram-url-direct");
const Porn = require("porn-lib");
const porn = new Porn();
const xvideos = porn.engine("xvideos");
const fs = require("fs");
const fetch = require("node-fetch");

/**
 * Get Facebook video from URL.
 * @param {string} url
 * @returns {Object}
 */
const fb = async (url) => {
	const response = await fetch(`http://scrap.terhambar.com/fb?link=${url}`);
	if (!response.ok) throw new Error(`Unexpected response ${response.statusText}`);
	const json = await response.json();
	if (json.status)
		return {
			capt: json.result.title,
			sd: json.result.linkVideo.sdQuality,
			hd: json.result.linkVideo.hdQuality,
		};
	return {
		capt: "*[ERROR] Video not found!*",
	};
};

/**
 * Get Instagram video/photo from URL.
 * @param {string} url
 * @returns {Object}
 */
const ig = (url) =>
	new Promise((resolve, reject) => {
		instagramGetUrl(url)
			.then((results) => {
				resolve(results.url_list);
			})
			.catch(reject);
	});

/**
 * Get Youtube audio from URL.
 * @param {string} url
 * @param {string} filter
 * @returns {Promise<Object>}
 */
const ytmp3 = (url, filter = "audioonly") =>
	new Promise(async (resolve, reject) => {
		const videoInfo = await ytdl.getInfo(url);
		const title = videoInfo.videoDetails.title.replace(/[/\\:*?"<>|]/g, "");
		ytdl(url, {filter})
			.pipe(
				fs.createWriteStream(
					`temp/${filter === "audioonly" ? "audio" : "video"}/${title}.${
						filter === "audioonly" ? "mp3" : "mp4"
					}`
				)
			)
			.on("finish", () => resolve(title))
			.on("error", reject);
	});

/**
 * Get Youtube video from URL.
 * @param {boolean} isUrl
 * @param {string} value
 * @param {string} type
 * @returns {Promise<Object>}
 */
const ytmp4 = (isUrl, value, type = "video") =>
	new Promise(async (resolve, reject) => {
		if (isUrl) {
			resolve(ytmp3(value, "videoandaudio"));
		}
		// if is a custom search (ex. funny cats)
		youtube.search(value).then((results) => {
			//if (results.videos[0].duration > 600) reject("*¡Video demasiado largo! Máx. 10 min.*");
			const title = results.videos[0].title.replace(/[/\\:*?"<>|]/g, "");
			ytdl(results.videos[0].link, {
				filter: type === "video" ? "videoandaudio" : "audio",
			})
				.pipe(
					fs.createWriteStream(
						`temp/${type}/${title}.${type === "video" ? "mp4" : "mp3"}`
					)
				)
				.on("finish", () => resolve(title))
				.on("error", reject);
		});
	});

/**
 * Get Youtube audio from search value.
 * @param {string} value
 * @returns {Promise<Object>}
 */
const play = (value) => ytmp4(false, value, "audio");

const playv2 = async (value) => {
	const response = await fetch(`https://videfikri.com/api/ytplayv2/?query=${value}`);
	const json = await response.json();
	if (json.result.status === "200") return {url: json.result.url, message: "ok"};
	return {message: "404 NOT FOUND"};
};

/**
 * Get XVideos video from keyword value.
 * @param {string} value
 * @returns {Promise<Object>}
 */
const xvid = (value) =>
	new Promise((resolve, reject) => {
		xvideos
			.search({keywords: [value], page: 0})
			.then((res) => {
				console.log(res);
				resolve(res.video_direct_url.low);
			})
			.catch(reject);
	});

module.exports = {
	fb,
	ig,
	ytmp3,
	ytmp4,
	play,
	playv2,
	xvid,
};
