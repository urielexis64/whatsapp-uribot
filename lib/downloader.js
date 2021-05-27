const ytdl = require("ytdl-core");
const youtube = require("scrape-youtube").default;
const instagramGetUrl = require("instagram-url-direct");
const Porn = require("porn-lib");
const porn = new Porn();
const xvideos = porn.engine("xvideos");
const fs = require("fs");

/**
 * Get Facebook video from URL.
 * @param {string} url
 * @returns {Object}
 */
const fb = async (url) => {
	const response = await fetch(`http://scrap.terhambar.com/fb?link=${url}`);
	if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
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
				resolve(results.url_list[0]);
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
		const title = videoInfo.videoDetails.title;
		ytdl(url, {filter})
			.pipe(fs.createWriteStream(`temp/audio/${title}.mp3`))
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
			if (results.videos[0].duration > 600) reject("*¡Video demasiado largo! Máx. 10 min.*");
			const title = results.videos[0].title;
			ytdl(results.videos[0].link, {
				filter: type === "video" ? "videoandaudio" : "audioonly",
				quality: type === "video" ? "highest" : "lowest",
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
	xvid,
};
