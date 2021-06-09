const ytdl = require("ytdl-core");
const youtube = require("scrape-youtube").default;
const ffmpeg = require("fluent-ffmpeg");
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
	try {
		const wwwUrl = url.replace("m.facebook", "www.facebook");
		const response = await fetch(`http://scrap.terhambar.com/fb?link=${wwwUrl}`);
		if (!response.ok) throw new Error(`Unexpected response ${response.statusText}`);
		const json = await response.json();
		if (json.status)
			return {
				capt: json.result.title,
				sd: json.result.linkVideo.sdQuality,
				hd: json.result.linkVideo.hdQuality,
			};
		return {
			error: true,
		};
	} catch (err) {
		return {
			error: true,
		};
	}
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
const ytmp3 = (url, filter = "audio") =>
	new Promise(async (resolve, reject) => {
		const videoInfo = await ytdl.getInfo(url);
		if (videoInfo.player_response.videoDetails.lengthSeconds > 600)
			return reject("*¡Video demasiado largo! Máx. 10 min.*");
		const title = videoInfo.videoDetails.title.replace(/[/\\:*?"<>|]/g, "");
		if (filter === "videoandaudio") {
			ytdl(url, {filter})
				.pipe(fs.createWriteStream(`temp/video/${title}.mp4`))
				.on("finish", () => resolve(title))
				.on("error", reject);
		} else {
			const stream = ytdl(url, {filter});
			ffmpeg(stream)
				.audioBitrate(128)
				.save(`temp/audio/${title}.mp3`)
				.on("end", () => resolve(title));
		}
	});

/**
 * Get Youtube video from URL.
 * @param {boolean} isUrl
 * @param {string} value
 * @param {string} filter
 * @returns {Promise<Object>}
 */
const ytmp4 = (isUrl, value, filter = "videoandaudio") =>
	new Promise(async (resolve, reject) => {
		if (isUrl) {
			resolve(ytmp3(value, "videoandaudio"));
		}
		// if is a custom search (ex. funny cats)
		youtube.search(value).then((results) => {
			if (results.videos[0].duration > 600)
				return reject("*¡Video demasiado largo! Máx. 10 min.*");
			const title = results.videos[0].title.replace(/[/\\:*?"<>|]/g, "");
			if (filter === "audio") {
				const stream = ytdl(results.videos[0].link, {filter});
				ffmpeg(stream)
					.audioBitrate(128)
					.save(`temp/audio/${title}.mp3`)
					.on("end", () => resolve(title))
					.on("error", reject);
			} else {
				ytdl(results.videos[0].link, {filter})
					.pipe(fs.createWriteStream(`temp/video/${title}.mp4`))
					.on("finish", () => resolve(title))
					.on("error", reject);
			}
		});
	});

/**
 * Get Youtube audio from search value.
 * @param {string} value
 * @returns {Promise<Object>}
 */
const play = (value) => ytmp4(false, value, "audio");

module.exports = {
	fb,
	ig,
	ytmp3,
	ytmp4,
	play,
};
