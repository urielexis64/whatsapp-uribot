const {Client} = require("@open-wa/wa-automate");
const {decryptMedia} = require("@open-wa/wa-decrypt");
const html_to_pdf = require("html-pdf-node");
const convertapi = require("convertapi")("bnWtM4CFccvCXmmL");
const PDFMerger = require("pdf-merger-js");
const merger = new PDFMerger();
const Pageres = require("pageres");
const memeMaker = require("meme-maker");
const fs = require("fs");
const FormData = require("form-data");
const request = require("request");
const emoji_regex = require("emoji-regex");
const emoji = emoji_regex();
const axios = require("axios").default;
const moment = require("moment-timezone");
const get = require("got");
const fetch = require("node-fetch");
const color = require("../lib/color");
const gtts = require("node-gtts");
const ttsId = gtts("id");
const ttsEn = gtts("en");
const ttsJp = gtts("ja");
const ttsAr = gtts("ar");
const ttsEs = gtts("es");

const ocrtess = require("node-tesseract-ocr");

// ===================== SCRAPERS ===================== //
const Insta = require("scraper-instagram");
const InstaClient = new Insta();
const Scraper = require("images-scraper");
const ggl = new Scraper({puppeteer: {headless: true}, safe: false});
const google = require("google-it");
const tiktok = require("tiktok-scraper");
// ===================== END SCRAPERS ===================== //

// ======================== READ DATABASE ================================ //
const nsfw_ = JSON.parse(fs.readFileSync("./database/group/nsfw.json"));
const mute_ = JSON.parse(fs.readFileSync("./database/bot/mute.json"));
const welcome_ = JSON.parse(fs.readFileSync("./database/group/welcome.json"));
const stats_ = JSON.parse(fs.readFileSync("./database/bot/stats.json"));
let sugs_ = JSON.parse(fs.readFileSync("./database/bot/suggestions.json"));
// ======================== END READ DATABASE ============================ //

// ================================= UTILS =================================== //
const {en, es} = require("./text/lang");
moment.tz.setDefault("America/Mexico").locale("mx");
const {help, terms, info, donate, cmds} = require("../lib/help");
const {addFilter, isFiltered} = require("../lib/msgFilter");
const {fb, ig, ytmp3, ytmp4, play} = require("../lib/downloader");
const {cheemsify, random, songLyrics, translate} = require("../lib/functions");
const {isBinary, isUrl} = require("../tools");
const {ownerBot, prefix, newsapikey, authorStick, packStick} = JSON.parse(
	fs.readFileSync("./config.json")
);
let {uaOverride} = JSON.parse(fs.readFileSync("./config.json"));

const ocrConfig = {
	lang: "spa+eng",
	oem: 1,
	psm: 1,
};

const stickersMetadata = {
	author: authorStick,
	pack: packStick,
	keepScale: true,
};

const animatedStickersConfig = {
	crop: false,
	fps: 24,
};

const localeDateOptions = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
};

const availableLanguages = [
	"en-US",
	"en-GB",
	"de-DE",
	"fr-FR",
	"es-ES",
	"pt-BR",
	"it-IT",
	"nl-NL",
	"pl-PL",
	"ru-RU",
	"ja-JA",
	"zh-ZH",
];

const wait = (ms) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

const refreshStats = ({files, calls, groups, stickers}) => {
	if (calls) stats_.totalCalls++;
	if (files) stats_.filesSent++;
	if (groups) stats_.groups++;
	if (stickers) stats_.stickersCreated++;

	fs.writeFileSync("./database/bot/stats.json", JSON.stringify(stats_));
};
// =================================== END UTILS ===================================== //

let isSlept = false;

module.exports = uribot = async (client = new Client(), message) => {
	try {
		const {
			type,
			id,
			from,
			t,
			sender,
			isGroupMsg,
			chat,
			caption,
			isMedia,
			mimetype,
			quotedMsg,
			quotedMsgObj,
			mentionedJidList,
		} = message;
		let {body} = message;
		const {name, formattedTitle} = chat;
		let {pushname, verifiedName} = sender;
		pushname = pushname || verifiedName;
		const commands = caption || body || "";
		const command = commands.toLowerCase().split(" ")[0] || "";
		const args = commands.split(" ");
		if (
			!command.startsWith(prefix) ||
			command.startsWith(prefix + "9j") ||
			command === "" ||
			(mute_.includes(chat.id) && command !== "/unmute") ||
			isSlept
		)
			return;

		const msgs = (message) => {
			if (command.startsWith("/")) {
				if (message.length >= 10) {
					return `${message.substr(0, 15)}`;
				} else {
					return `${message}`;
				}
			}
		};

		//if (isFiltered(from)) return client.reply(chat.id, es.waitNextCall, id);
		//addFilter(from);
		refreshStats({calls: true});

		const time = moment(t * 1000).format("DD/MM HH:mm:ss");
		const botNumber = await client.getHostNumber();
		const blockNumber = await client.getBlockedIds();
		const groupId = isGroupMsg ? chat.groupMetadata.id : "";
		const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : "";
		const ownerNumber = [ownerBot];
		const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false;
		const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + "@c.us") : false;
		const isOwner = ownerNumber.includes(sender.id);
		const isBlocked = blockNumber.includes(sender.id);
		const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false;

		const isQuotedImage =
			(quotedMsg && quotedMsg?.type === "image") || quotedMsg?.mimetype?.startsWith("image");
		const isQuotedVideo = quotedMsg && quotedMsg.type === "video";
		const isQuotedSticker = quotedMsg && quotedMsg.type === "sticker";
		const isQuotedGif = quotedMsg && quotedMsg.mimetype === "image/gif";
		const isQuotedAudio = quotedMsg && quotedMsg.type === "audio";
		const isQuotedVoice = quotedMsg && quotedMsg.type === "ptt";
		const isQuotedPDF = quotedMsg && quotedMsg.mimetype === "application/pdf";
		const isQuotedDOCX =
			quotedMsg &&
			quotedMsg.mimetype ===
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
		const isImage = type === "image";
		const isVideo = type === "video";
		const isAudio = type === "audio";
		const isVoice = type === "ptt";
		const isGif = mimetype === "image/gif";

		uaOverride += botNumber;

		if (!isGroupMsg && command.startsWith(prefix))
			console.log(
				"\x1b[1;31m~\x1b[1;37m>",
				"[\x1b[1;32mEXEC\x1b[1;37m]",
				time,
				color(msgs(command)),
				0,
				"from",
				color(pushname)
			);
		if (isGroupMsg && command.startsWith(prefix))
			console.log(
				"\x1b[1;31m~\x1b[1;37m>",
				"[\x1b[1;32mEXEC\x1b[1;37m]",
				time,
				color(msgs(command)),
				"from",
				color(pushname),
				"in",
				color(formattedTitle)
			);
		if (isBlocked) return;
		switch (command) {
			// ========================================================== STICKERS SECTION ==========================================================
			case prefix + "sticker":
			case prefix + "stiker":
				const circle = args[1] === "circle";
				const crop = args[1] === "crop";
				if (isQuotedImage) {
					client.reply(chat.id, es.making("sticker"), id);
					const mediaData = await decryptMedia(quotedMsg, uaOverride);
					const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString(
						"base64"
					)}`;
					return await client.sendImageAsSticker(chat.id, imageBase64, {
						...stickersMetadata,
						circle,
						keepScale: !crop,
					});
				}
				if (isMedia && type === "image") {
					client.reply(chat.id, es.making("sticker"), id);
					const mediaData = await decryptMedia(message, uaOverride);
					const imageBase64 = `data:${mimetype};base64,${mediaData.toString("base64")}`;
					await client.sendImageAsSticker(chat.id, imageBase64, {
						...stickersMetadata,
						circle,
						keepScale: !crop,
					});
				} else if (quotedMsg && quotedMsg.type === "image") {
					client.reply(chat.id, es.making("sticker"), id);
					const mediaData = await decryptMedia(quotedMsg, uaOverride);
					const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString(
						"base64"
					)}`;
					await client.sendImageAsSticker(chat.id, imageBase64, {
						...stickersMetadata,
						circle,
					});
				} else if (args.length === 2) {
					client.reply(chat.id, es.making("sticker"), id);
					const url = args[1];
					if (url.match(isUrl)) {
						await client
							.sendStickerfromUrl(
								chat.id,
								url,
								{method: "get"},
								{...stickersMetadata, circle, keepScale: !crop}
							)
							.catch((err) => console.log("Caught exception: ", err));
					} else {
						client.reply(chat.id, es.invalidLink, id);
					}
				} else {
					client.reply(chat.id, es.wrongFormat, id);
				}
				refreshStats({stickers: true});
				break;
			case prefix + "stickergif":
			case prefix + "stikergif":
			case prefix + "sgif":
				if (
					(mimetype === "video/mp4" || mimetype === "image/gif") &&
					message.duration <= 5
				) {
					client.reply(chat.id, es.making("sticker animado"), id);
					const mediaData = await decryptMedia(message, uaOverride);
					const filename = `temp/sticker/sticker.${mimetype.split("/")[1]}`;
					try {
						await fs.writeFileSync(filename, mediaData);
						client
							.sendMp4AsSticker(
								chat.id,
								filename,
								animatedStickersConfig,
								stickersMetadata
							)
							.catch(console.log);
					} catch (error) {
						client.reply(
							chat.id,
							"El tamaño del video es muy extenso.\nMáximo peso para videos: *1.5 MB*",
							id
						);
					}
				} else if (
					quotedMsg &&
					quotedMsgObj.duration <= 5 &&
					quotedMsgObj.type === "video"
				) {
					client.reply(chat.id, es.making("sticker animado"), id);
					const mediaData = await decryptMedia(quotedMsgObj, uaOverride);
					const filename = `temp/sticker/sticker.${quotedMsgObj.mimetype.split("/")[1]}`;
					await fs.writeFileSync(filename, mediaData);
					client
						.sendMp4AsSticker(
							chat.id,
							filename,
							animatedStickersConfig,
							stickersMetadata
						)
						.catch(console.log);
				} else if (quotedMsgObj.duration > 5 || message.duration > 5)
					return client.reply(chat.id, es.maxVideoSeconds, id);
				else return client.reply(chat.id, es.wrongFormat, id);
				return refreshStats({stickers: true});
			case prefix + "findsticker":
				client.reply(chat.id, es.searching("sticker"), id);
				const res = await ggl.scrape(body.slice(13), 5);
				return await client
					.sendStickerfromUrl(chat.id, res[0].url, {method: "GET"}, stickersMetadata)
					.then((res) => {
						if (!res) return client.reply(chat.id, es.sticketNotFound, id);
						refreshStats({stickers: true});
					})
					.catch((err) => {
						client.reply(chat.id, es.generalError(err), id);
					});
			case prefix + "unsticker":
				if (quotedMsg) {
					try {
						const mediaData = await decryptMedia(quotedMsg, uaOverride);
						const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString(
							"base64"
						)}`;
						await client.sendFile(chat.id, imageBase64, "sticker", "", id);
						refreshStats({files: true});
					} catch (err) {
						await client.reply(chat.id, es.generalError(err), id);
					}
				} else {
					await client.reply(chat.id, es.wrongFormat, id);
				}
				break;
			// ========================================================== END STICKERS SECTION ==========================================================
			// ========================================================== DOWNLOADER SECTION ==========================================================
			case prefix + "ytmp3":
				client.reply(chat.id, es.downloading("audio"), id);
				const youtubeUrl = args[1];
				return ytmp3(youtubeUrl)
					.then((title) => {
						client.sendAudio(chat.id, `temp/audio/${title}.mp3`, id).then(() => {
							fs.unlinkSync(`temp/audio/${title}.mp3`);
							refreshStats({files: true});
						});
					})
					.catch((err) => client.reply(chat.id, es.generalError(err), id));
			case prefix + "ytmp4":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				client.reply(chat.id, es.downloading("video"), id);
				const isYtUrl = isUrl(args[1]);
				const value = isYtUrl ? args[1] : body.slice(7);
				return ytmp4(isYtUrl, value)
					.then(async (title) => {
						await client
							.sendFile(chat.id, `temp/video/${title}.mp4`, `${title}.mp4`, title, id)
							.then(() => {
								fs.unlinkSync(`temp/video/${title}.mp4`);
								refreshStats({files: true});
							})
							.catch((err) => client.reply(chat.id, es.generalError(err), id));
					})
					.catch((err) => client.reply(chat.id, `Ocurrió un error: ${err}`, id));
			case prefix + "play":
			case prefix + "p":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				client.reply(chat.id, es.downloading("audio"), id);
				return play(args[0] === "/p" ? body.slice(3) : body.slice(6))
					.then(async (title) => {
						await client
							.sendAudio(chat.id, `temp/audio/${title}.mp3`, id)
							.then(() => {
								fs.unlinkSync(`temp/audio/${title}.mp3`);
								refreshStats({files: true});
							})
							.catch((err) => client.reply(chat.id, es.generalError(err), id));
					})
					.catch((err) => client.reply(chat.id, es.generalError(err), id));
			case prefix + "fb":
				try {
					if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
					client.reply(chat.id, es.wait, id);
					return fb(args[1]).then((res) => {
						if (res.error)
							return client.reply(
								chat.id,
								es.generalError("No se puede extraer el video."),
								id
							);
						if (res.hd || res.sd)
							client.sendText(chat.id, "*Video encontrado. Descargando...*");
						if (res.hd) client.sendFileFromUrl(chat.id, `${res.hd}`, "", res.capt, id);
						else client.sendFileFromUrl(chat.id, `${res.sd}`, "", res.capt, id);
						refreshStats({files: true});
					});
				} catch (error) {
					client.reply(chat.id, es.generalError(error), id);
				}
				break;
			case prefix + "tiktok":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				if (!args[1].includes("tiktok.com"))
					return client.reply(chat.id, es.invalidLink, id);
				client.reply(chat.id, es.wait, id);
				try {
					const videoData = await tiktok.getVideoMeta(args[1]);
					await tiktok
						.video(args[1], {download: true, filepath: "temp/video", noWaterMark: true})
						.then(() => {
							client
								.sendFile(
									chat.id,
									`temp/video/${videoData.collector[0].id}.mp4`,
									"",
									videoData.collector[0].text,
									id
								)
								.then(() => {
									refreshStats({files: true});
									fs.unlinkSync(`temp/video/${videoData.collector[0].id}.mp4`);
								})
								.catch(console.log);
						})
						.catch((err) => client.reply(chat.id, es.generalError(err), id));
				} catch (err) {
					client.sendText(chat.id, es.generalError(err));
				}
				break;
			case prefix + "ph":
				/* const res = await ph.search(args[1], null, null);
					const phUrl = await ph.page(
						"https://www.pornhub.com/view_video.php?viewkey=ph60abfcb33bf93",
						["title", "pornstars", "download_urls"]
					);
					console.log(phUrl); */
				//client.sendFileFromUrl(chat.id, phUrl.download_urls["480"], "si");
				break;
			case prefix + "ig":
				if (!isUrl(args[1])) return client.reply(chat.id, es.wrongFormat, id);
				return ig(args[1])
					.then((posts) => {
						posts.forEach((post) => client.sendFileFromUrl(chat.id, post));
						refreshStats({files: true});
					})
					.catch((err) => client.reply(chat.id, err, id));
			case prefix + "reddit":
			case prefix + "redditw":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				const limitreddit = body.split(".")[1] || 1;
				if (limitreddit > 10) return client.reply(chat.id, es.maxCount(10), id);
				error = false;
				for (let index = 0; index < limitreddit; index++) {
					await axios
						.get(`https://meme-api.herokuapp.com/gimme/${args[1]}`)
						.then(async (r) => {
							const data = r.data;
							if (command.endsWith("w")) {
								client
									.sendFileFromUrl(chat.id, data.url, "", "", id)
									.then(refreshStats({files: true}))
									.catch((err) =>
										client.reply(chat.id, es.generalError(err), id)
									);
							} else {
								client
									.sendFileFromUrl(
										chat.id,
										data.url,
										"img",
										es.redditPost(data),
										id
									)
									.then(refreshStats({files: true}))
									.catch((err) =>
										client.reply(chat.id, es.generalError(err), id)
									);
							}

							await wait(900);
						})
						.catch((err) => {
							client.reply(chat.id, es.generalError(err.response.data.message), id);
							error = true;
						});
					if (error) break;
				}
				break;
			case prefix + "googleimg":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				client.reply(chat.id, es.searching("imágenes"), id);
				const limitImgs = body.split(".")[1];
				if (limitImgs > 5) return client.reply(chat.id, es.maxCount(5), id);
				const results = await ggl.scrape(body.slice(11), limitImgs || 1);
				return results.forEach((res) => {
					client
						.sendFileFromUrl(chat.id, res.url, "", res.title)
						.then(() => refreshStats({files: true}))
						.catch((err) => {
							client.reply(chat.id, es.generalError(err), id);
						});
				});
			// ========================================================== END DOWNLOADER SECTION ==========================================================
			// ========================================================== GROUPS SECTION ==========================================================
			case prefix + "mute":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				mute_.push(chat.id);
				fs.writeFileSync("./database/bot/mute.json", JSON.stringify(mute_));
				return client.reply(chat.id, es.muted, id);
			case prefix + "unmute":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				mute_.splice(chat.id, 1);
				fs.writeFileSync("./database/bot/mute.json", JSON.stringify(mute_));
				return client.reply(chat.id, es.unmuted, id);
			case prefix + "welcome":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				if (args[1].toLowerCase() === "enable") {
					welcome_.push(chat.id);
					fs.writeFileSync("./database/group/welcome.json", JSON.stringify(welcome_));
					client.reply(chat.id, es.welcomeEnabled, id);
				} else if (args[1].toLowerCase() === "disable") {
					welcome_.splice(chat.id, 1);
					fs.writeFileSync("./database/group/welcome.json", JSON.stringify(welcome_));
					client.reply(chat.id, es.welcomeDisabled, id);
				} else {
					client.reply(chat.id, es.wrongFormat, id);
				}
				break;
			case prefix + "linkgroup":
				if (!isBotGroupAdmins) return client.reply(chat.id, es.onlyBotAdmin, id);
				if (isGroupMsg) {
					const inviteLink = await client.getGroupInviteLink(groupId);
					return client.sendLinkWithAutoPreview(
						chat.id,
						inviteLink,
						`\nLink group *${name}*`
					);
				}
				return client.reply(chat.id, es.onlyGroups, id);
			case prefix + "adminlist":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				let mimin = "";
				for (let admon of groupAdmins) {
					mimin += `➸ @${admon.replace(/@c.us/g, "")}\n`;
				}
				await client.sendTextWithMentions(chat.id, mimin);
				break;
			case prefix + "ownergroup":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				const Owner_ = chat.groupMetadata.owner;
				await client.sendTextWithMentions(chat.id, `Joto del grupo: @${Owner_}`);
				break;
			case prefix + "mentionall":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				const groupMem = await client.getGroupMembers(groupId);
				let hehe = "╔══✪〘 Mention All 〙✪══\n";
				for (let i = 0; i < groupMem.length; i++) {
					hehe += "╠➥";
					hehe += ` @${groupMem[i].id.replace(/@c.us/g, "")}\n`;
				}
				hehe += "╚═〘 UriBOT 〙";
				await client.sendTextWithMentions(chat.id, hehe);
				break;
			case prefix + "kickall":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				const isGroupOwner = sender.id === chat.groupMetadata.owner;
				if (!isGroupOwner) return client.reply(chat.id, es.onlyGroupOwner, id);
				if (!isBotGroupAdmins) return client.reply(chat.id, es.onlyBotAdmin, id);
				const allMem = await client.getGroupMembers(groupId);
				for (let i = 0; i < allMem.length; i++) {
					if (groupAdmins.includes(allMem[i].id)) {
						console.log("Ups! Esta persona es admin.");
					} else {
						await client.removeParticipant(groupId, allMem[i].id);
					}
				}
				return client.reply(
					chat.id,
					"¡Listo! Ya expulsé a todos los miembros del grupo.",
					id
				);
			case prefix + "add":
				const orang = args[1];
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				if (!isBotGroupAdmins) return client.reply(chat.id, es.onlyBotAdmin, id);
				try {
					await client.addParticipant(chat.id, `${orang}@c.us`);
				} catch {
					client.reply(chat.id, es.addContactError, id);
				}
				break;
			case prefix + "kick":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				if (!isBotGroupAdmins) return client.reply(chat.id, es.onlyBotAdmin, id);
				if (mentionedJidList.length === 0) return client.reply(chat.id, es.wrongFormat, id);
				await client.sendText(chat.id, `Miembro expulsado: ${mentionedJidList.join("\n")}`);
				for (let i = 0; i < mentionedJidList.length; i++) {
					if (groupAdmins.includes(mentionedJidList[i]))
						return client.reply(chat.id, es.cantKickAdmin, id);
					await client.removeParticipant(groupId, mentionedJidList[i]);
				}
				break;
			case prefix + "leave":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				return client.sendText(chat.id, es.bye).then(client.leaveGroup(groupId));
			case prefix + "promote":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				if (!isBotGroupAdmins) return client.reply(chat.id, es.onlyBotAdmin, id);
				if (mentionedJidList.length === 0 || mentionedJidList.length > 1)
					return client.reply(chat.id, es.wrongFormat, id);
				if (groupAdmins.includes(mentionedJidList[0]))
					return client.reply(chat.id, es.isAlreadyAdmin, id);
				await client.promoteParticipant(groupId, mentionedJidList[0]);
				await client.sendTextWithMentions(
					chat.id,
					`Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`
				);
				break;
			case prefix + "demote":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				if (!isBotGroupAdmins) return client.reply(chat.id, es.onlyBotAdmin, id);
				if (mentionedJidList.length === 0 || mentionedJidList.length > 1)
					return client.reply(chat.id, es.wrongFormat, id);
				if (!groupAdmins.includes(mentionedJidList[0]))
					return client.reply(chat.id, es.onlyAdmins, id);
				await client.demoteParticipant(groupId, mentionedJidList[0]);
				await client.sendTextWithMentions(
					chat.id,
					`Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`
				);
				break;
			case prefix + "join":
				if (args.length < 2) return client.reply(chat.id, es.wrongFormat, id);
				const link = args[1];
				const key = args[2];
				const tGr = await client.getAllGroups();
				const minMem = 30;
				const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi);
				const check = await client.inviteInfo(link);
				if (!isLink) return client.reply(chat.id, "¡Y el link? 👊🤬", id);
				if (check.status === 200) {
					await client
						.joinGroupViaLink(link)
						.then(() => client.reply(chat.id, "¡Listo! Ya me uní. 😁", id));
				} else {
					client.reply(chat.id, es.invalidLink, id);
				}
				break;
			case prefix + "delete":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				if (!quotedMsg) return client.reply(chat.id, es.wrongFormat, id);
				if (!quotedMsgObj.fromMe) return client.reply(chat.id, es.wrongFormat, id);
				return client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
			// ========================================================== END GROUPS SECTION ==========================================================
			// ============================================================ OWNER SECTION ============================================================
			case prefix + "sleep":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				isSlept = true;
				return setTimeout(() => {
					isSlept = false;
				}, args[1]);
			case prefix + "getss":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				const sesPic = await client.getSnapshot();
				return client.sendFile(chat.id, sesPic, "session.png", "Screenshot", id);
			case prefix + "listblock":
				let hih = `Lista de números bloqueados\nTotal : ${blockNumber.length}\n`;
				for (let i of blockNumber) {
					hih += `➸ @${i.replace(/@c.us/g, "")}\n`;
				}
				return client.sendTextWithMentions(chat.id, hih, id);
			case prefix + "leaveall":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				const allChats = await client.getAllChatIds();
				const allGroups = await client.getAllGroups();
				for (let gclist of allGroups) {
					await client.sendText(
						gclist.contact.id,
						`Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`
					);
					await client.leaveGroup(gclist.contact.id);
				}
				return client.reply(chat.id, "Succes leave all group!", id);
			case prefix + "clearall":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				const allChatz = await client.getAllChats();
				for (let dchat of allChatz) {
					await client.deleteChat(dchat.id);
				}
				return client.reply(chat.id, "Succes clear all chat!", id);
			case prefix + "bc":
				if (!isOwner || true) return client.reply(from, es.onlyBotOwner, id);
				let msg = body.slice(4);
				const chatz = await client.getAllChatIds();
				for (let ids of chatz) {
					var cvk = await client.getChatById(ids);
					if (!cvk.isReadOnly)
						await client.sendText(ids, `[ UriBOT Broadcast ]\n\n${msg}`);
				}
				return client.reply(from, "Broadcast Success!", id);
			// ========================================================== END OWNER SECTION ==========================================================
			// ========================================================== NSFW SECTION ==========================================================
			case prefix + "nsfwmenu":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				return client.reply(chat.id, es.menuNsfw, id);
			case prefix + "nsfw":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				if (args[1].toLowerCase() === "enable") {
					nsfw_.push(chat.id);
					fs.writeFileSync("./database/group/NSFW.json", JSON.stringify(nsfw_));
					client.reply(chat.id, es.nsfwEnabled, id);
				} else if (args[1].toLowerCase() === "disable") {
					nsfw_.splice(chat.id, 1);
					fs.writeFileSync("./database/group/NSFW.json", JSON.stringify(nsfw_));
					client.reply(chat.id, es.nsfwDisabled, id);
				} else {
					client.reply(chat.id, es.wrongFormat, id);
				}
				break;
			case prefix + "randomloli":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const loli = await get.get(`http://api.nekos.fun:8080/api/lewd`).json();
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, loli.image, "Loli.jpg", "Loli!", id);
			case prefix + "randomfeet":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const feet = await get.get(`http://api.nekos.fun:8080/api/feet`).json();
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, feet.image, "Feet.jpg", "Feet!", id);
			case prefix + "randomcum":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const cum = await get.get(`http://api.nekos.fun:8080/api/cum`).json();
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, cum.image, "Cum.jpg", "Cum!", id);
			case prefix + "randombj":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const bj = await get.get(`http://api.nekos.fun:8080/api/blowjob`).json();
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, bj.image, "Blowjob.jpg", "Blowjob!", id);
			case prefix + "randomhentai":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const hentai = await random("hentai");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, hentai, `Hentai`, "Hentai!", id);
			case prefix + "randomass":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const ass = await random("ass");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, ass, `Ass`, "Ass!", id);
			case prefix + "randompussy":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const pussy = await random("pussy");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, pussy, `Pussy`, "Pussy!", id);
			case prefix + "randomanal":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const anal = await random("anal");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, anal, `Anal`, "Anal!", id);
			case prefix + "randomgonewild":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const gonewild = await random("gonewild");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, gonewild, `Gonewild`, "Gonewild!", id);
			case prefix + "random4k":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const _4k = await random("4k");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, _4k, `4k`, "4k!", id);
			case prefix + "randomboobs":
				if (isGroupMsg) if (!isNsfw) return client.reply(from, es.nsfwStatus, id);
				const boobs = await random("boobs");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, boobs, `Boobs`, "Boobs!", id);
			case prefix + "randomtentacle":
				if (isGroupMsg) if (!isNsfw) return client.reply(from, es.nsfwStatus, id);
				const tentacle = await random("tentacle");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, tentacle, `Tentacles`, "Tentacles!", id);
			// ========================================================== END NSFW SECTION ==========================================================
			// ========================================================== 🛠 UTILS/EDUCATIONAL SECTION 📚 ==========================================================
			case prefix + "link2pdf":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				let options = {format: "A4"};
				let file = {url: args[1]};
				return html_to_pdf
					.generatePdf(file, options)
					.then((pdfBuffer) => {
						fs.writeFile(`temp/archive/${sender.id}_link2pdf.pdf`, pdfBuffer, (err) => {
							if (!err) {
								client
									.sendFile(
										chat.id,
										`temp/archive/${sender.id}_link2pdf.pdf`,
										"by UriBOT",
										"*by UriBot*",
										id
									)
									.then(() => {
										refreshStats({files: true});
										fs.unlinkSync(`temp/archive/${sender.id}_link2pdf.pdf`);
									});
							}
						});
					})
					.catch((err) => client.reply(chat.id, es.generalError(err), id));
			case prefix + "link2ss":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				if (!isUrl(args[1])) return client.reply(chat.id, es.invalidLink, id);
				const ssPath = "temp/image";
				const ssFilename = `${sender.id}_ss`;
				return new Pageres({delay: 2, filename: ssFilename, crop: true})
					.src(args[1], ["1920x1080"])
					.dest(ssPath)
					.run()
					.then(async () => {
						await client
							.sendFile(chat.id, `${ssPath}/${ssFilename}.png`, "", "", id)
							.then(refreshStats({files: true}));
						await fs.unlinkSync(`${ssPath}/${ssFilename}.png`);
					})
					.catch((err) => client.reply(chat.id, es.generalError(err), id));

			case prefix + "doc2pdf":
			case prefix + "img2pdf":
				if (!isQuotedDOCX && !isQuotedImage)
					return client.reply(chat.id, es.invalidExtension, id);
				client.reply(chat.id, es.converting(isQuotedImage ? "image" : "doc", "pdf"), id);
				const mediaData = await decryptMedia(quotedMsg, uaOverride);
				const filename = `temp/archive/${sender.id}_converted.${
					isQuotedImage ? "jpg" : "doc"
				}`;
				await fs.writeFileSync(filename, mediaData);
				return convertapi
					.convert(
						"pdf",
						{
							File: `temp/archive/${sender.id}_converted.${
								isQuotedImage ? "jpg" : "doc"
							}`,
						},
						isQuotedImage ? "jpg" : "doc"
					)
					.then(async (result) => {
						await result.saveFiles(`temp/archive/${sender.id}_output.pdf`);
						client
							.sendFile(
								chat.id,
								`temp/archive/${sender.id}_output.pdf`,
								"by UriBot",
								"*by UriBot*",
								id
							)
							.then(() => {
								refreshStats({files: true});
								fs.unlinkSync(`temp/archive/${sender.id}_output.pdf`);
							});
					})
					.catch((err) => client.reply(chat.id, es.generalError(err), id));
			case prefix + "merge1":
				if (!isQuotedPDF) return client.reply(chat.id, es.wrongFormat, id);
				const mergeData1 = await decryptMedia(quotedMsg, uaOverride);
				const mergeFilename1 = `temp/archive/${sender.id}_merge1.pdf`;
				await fs.writeFileSync(mergeFilename1, mergeData1);
				return client.reply(chat.id, "*✅ Primera parte guardada.*", id);
			case prefix + "merge2":
				if (!isQuotedPDF) return client.reply(chat.id, es.wrongFormat, id);
				const mergeData2 = await decryptMedia(quotedMsg, uaOverride);
				const mergeFilename2 = `temp/archive/${sender.id}_merge2.pdf`;
				await fs.writeFileSync(mergeFilename2, mergeData2);
				return client.reply(
					chat.id,
					"*✅ Segunda parte guardada.* Ahora envíe el comando */mergepdfs* para combinarlos.",
					id
				);
			case prefix + "mergepdfs":
				const basePath = "temp/archive";
				const merge1Exists = fs.existsSync(`${basePath}/${sender.id}_merge1.pdf`);
				const merge2Exists = fs.existsSync(`${basePath}/${sender.id}_merge2.pdf`);
				if (!merge1Exists || !merge2Exists)
					return client.reply(chat.id, es.wrongFormat, id);
				merger.add(`${basePath}/${sender.id}_merge1.pdf`);
				merger.add(`${basePath}/${sender.id}_merge2.pdf`);
				await merger.save(`${basePath}/${sender.id}_merged.pdf`);
				return client
					.sendFile(
						chat.id,
						`${basePath}/${sender.id}_merged.pdf`,
						"Merged by UriBot",
						"",
						id
					)
					.then(() => {
						refreshStats({files: true});
						fs.unlinkSync(`${basePath}/${sender.id}_merge1.pdf`);
						fs.unlinkSync(`${basePath}/${sender.id}_merge2.pdf`);
						fs.unlinkSync(`${basePath}/${sender.id}_merged.pdf`);
					});
			case prefix + "brainly":
				if (args.length > 1) {
					const brainlySearch = require("../lib/brainly");
					let query = body.slice(9);
					let count = Number(query.split(".")[1]) || 2;
					if (count > 10) return client.reply(chat.id, es.maxCount(10), id);
					if (Number(query[query.length - 1])) {
						query;
					}
					client.reply(
						chat.id,
						`➸ *Pregunta* : ${
							query.split(".")[0]
						}\n\n➸ *Número de respuestas* : ${count}`,
						id
					);
					await brainlySearch(query.split(".")[0], count, function (res) {
						res.forEach((opt) => {
							if (opt.answer.answerImage.length == 0) {
								client.reply(
									chat.id,
									`➸ *Pregunta* : ${opt.questionTitle}\n\n➸ *Respuesta* : ${opt.answer.answerTitle}\n`,
									id
								);
							} else {
								client.reply(
									chat.id,
									`➸ *Pregunta* : ${opt.questionTitle}\n\n➸ *Respuesta* : ${
										opt.answer.answerTitle
									}\n\n➸ *Link* : ${opt.answer.answerImage.join("\n")}`,
									id
								);
							}
						});
					});
				} else {
					client.reply(chat.id, es.wrongFormat, id);
				}
				break;
			case prefix + "url2img":
				const _query = body.slice(9);
				if (!isUrl(_query)) return client.reply(chat.id, es.wrongFormat, id);
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				return client
					.sendFileFromUrl(chat.id, _query, `Image from ${_query}`, null, id)
					.then(() => refreshStats({files: true}));
			case prefix + "translate":
				if (args.length === 1 && !quotedMsg)
					return client.reply(chat.id, es.wrongFormat, id);
				client.reply(chat.id, es.translating, id);
				let targetLanguage = args[1];
				if (
					targetLanguage &&
					!availableLanguages.includes(targetLanguage) &&
					!isBinary(args[1])
				) {
					return client.reply(
						chat.id,
						es.invalidLanguage(targetLanguage, availableLanguages),
						id
					);
				} else {
					targetLanguage = targetLanguage ? targetLanguage : "es-ES";
				}
				if (quotedMsg) {
					const translatedText = await translate(quotedMsg.body, targetLanguage);
					return client.reply(chat.id, translatedText, id);
				}
				const translatedText = await translate(
					args[2] ? body.slice(17) : body.slice(11),
					targetLanguage
				);
				return client.reply(chat.id, translatedText, id);
			case prefix + "tts":
				if (args.length === 1 && !quotedMsg)
					return client.reply(chat.id, es.wrongFormat, id);
				let dataText = body.slice(8);
				if (quotedMsg && (quotedMsg.caption || quotedMsg.body)) {
					dataText = isMedia ? quotedMsg.caption : quotedMsg.body;
				} else if (quotedMsg) return client.reply(chat.id, es.wrongFormat, id);

				if (dataText === "") return client.reply(chat.id, es.wrongFormat, id);
				if (dataText.length > 500) return client.reply(chat.id, es.tooLongText, id);
				let dataBhs = body.slice(5, 7);
				if (dataBhs === "id") {
					ttsId.save("temp/audio/resId.mp3", dataText, function () {
						client.sendPtt(chat.id, "temp/audio/resId.mp3", id);
					});
				} else if (dataBhs === "en") {
					ttsEn.save("temp/audio/resEn.mp3", dataText, function () {
						client.sendPtt(chat.id, "temp/audio/resEn.mp3", id);
					});
				} else if (dataBhs === "jp") {
					ttsJp.save("temp/audio/resJp.mp3", dataText, function () {
						client.sendPtt(chat.id, "temp/audio/resJp.mp3", id);
					});
				} else if (dataBhs === "ar") {
					ttsAr.save("temp/audio/resAr.mp3", dataText, function () {
						client.sendPtt(chat.id, "temp/audio/resAr.mp3", id);
					});
				} else if (dataBhs === "es") {
					ttsEs.save("temp/audio/resEs.mp3", dataText, function () {
						client.sendPtt(chat.id, "temp/audio/resEs.mp3", id);
					});
				} else {
					client.reply(chat.id, es.languagesData, id);
				}
				refreshStats({files: true});
				break;
			case prefix + "google":
				const limitSearch = body.split(".")[1];
				if (limitSearch > 5) return client.reply(chat.id, es.maxCount(5), id);
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				client.reply(chat.id, es.searching("información"), id);
				const query = body.slice(8);
				return google({query, "no-display": true, limit: limitSearch || 1})
					.then(async (results) => {
						let txt = `*GOOGLE SEARCH*\n\n_*Search results for: ${query}*_`;
						for (let i = 0; i < results.length; i++) {
							txt += es.googleFormat(results[i]);
						}
						await client.reply(chat.id, txt, id);
					})
					.catch(async (err) => {
						await client.reply(chat.id, err, id);
					});
			case prefix + "math":
				return axios
					.get(`http://api.mathjs.org/v4/?expr=${body.slice(6).toLowerCase()}`)
					.then((res) => {
						client.reply(chat.id, `*Respuesta:* ${res.data}`, id);
					})
					.catch((err) => client.reply(chat.id, es.generalError(err), id));
			case prefix + "imgtotext":
			case prefix + "imgtotxt":
				if ((isMedia && isImage) || isQuotedImage || isQuotedSticker) {
					await client.reply(chat.id, es.wait, id);
					const encryptMedia = isQuotedImage || isQuotedSticker ? quotedMsg : message;
					const mediaData = await decryptMedia(encryptMedia, uaOverride);
					fs.writeFileSync(`temp/image/${sender.id}.jpg`, mediaData);
					ocrtess
						.recognize(`temp/image/${sender.id}.jpg`, ocrConfig)
						.then(async (text) => {
							await client.reply(chat.id, `${text.trim()}`, id);
							fs.unlinkSync(`temp/image/${sender.id}.jpg`);
						})
						.catch(async (err) => {
							await client.reply(chat.id, es.generalError(err), id);
						});
				} else {
					await client.reply(chat.id, es.wrongFormat, id);
				}
				break;
			case prefix + "randomnews":
				let numberOfNews = body.split(".")[1] || 1;
				if (numberOfNews > 5) return client.reply(chat.id, es.maxCount(5), id);
				return axios
					.get("https://newsapi.org/v2/top-headlines?country=mx&apiKey=" + newsapikey)
					.then(async (news) => {
						const randomNumbers = [];
						for (let i = 0; i < numberOfNews; i++) {
							const ran = Math.floor(Math.random() * (news.data.articles.length - 1));
							if (randomNumbers.includes(ran)) {
								i--;
								continue;
							}
							randomNumbers.push(ran);
							const currentNew = news.data.articles[ran];
							await client
								.sendFileFromUrl(
									chat.id,
									currentNew.urlToImage,
									"",
									es.newsFormat(currentNew),
									id
								)
								.then(refreshStats({files: true}))
								.catch((err) => client.reply(chat.id, es.generalError(err), id));
						}
					})
					.catch((err) => client.reply(chat.id, es.generalError(err), id));
			case prefix + "qr":
				if (args.length === 1 && !quotedMsg)
					return client.reply(chat.id, es.wrongFormat, id);
				else {
					const color = body.split("|")[1];
					let text;
					if (quotedMsg) text = quotedMsgObj.body || quotedMsgObj.caption;
					else
						text = body.slice(
							4,
							body.indexOf("|") === -1 ? body.length : body.indexOf("|")
						);
					text = text.replace(emoji, "");
					client.reply(chat.id, es.generatingQR, id);
					return client
						.sendFileFromUrl(
							chat.id,
							`http://api.qrserver.com/v1/create-qr-code/?data=${text}&ecc=H&margin=20&color=${
								color?.trim() ?? "000"
							}&size=300x300`,
							"",
							"",
							id
						)
						.catch((err) => client.reply(chat.id, es.generalError(err), id));
				}
			case prefix + "dqr":
				if (!isQuotedImage && type !== "image")
					return client.reply(chat.id, es.wrongFormat, id);
				else {
					client.reply(chat.id, es.decodingQR, id);
					const mediaData = await decryptMedia(quotedMsg || message, uaOverride);
					const filePath = `temp/image/${sender.id}.jpg`;
					await fs.writeFileSync(filePath, mediaData);

					const data = new FormData();
					data.append("file", await fs.createReadStream(filePath));

					const config = {
						method: "post",
						url: "https://api.qrserver.com/v1/read-qr-code/",
						headers: data.getHeaders(),
						data: data,
					};
					return axios(config)
						.then(async (res) => {
							const data = res.data[0];
							const content = data.symbol[0].data;
							if (content) await client.reply(chat.id, `*Contenido:* ${content}`, id);
							else await client.reply(chat.id, es.invalidQR, id);
							await fs.unlinkSync(filePath);
						})
						.catch((err) => client.reply(chat.id, es.generalError(err), id));
				}
			case prefix + "wiki":
				break;
			// ========================================================== 🛠 END UTILS/EDUCATIONAL SECTION 📚 ==========================================================
			// ===================================================================== HELP SECTION =====================================================================
			case prefix + "help":
				return client.sendText(chat.id, help());
			case prefix + "commands":
				return client.sendText(chat.id, cmds());
			case prefix + "info":
				return client.sendLinkWithAutoPreview(
					chat.id,
					"https://github.com/urielexis64/whatsapp-uribot",
					info()
				);
			case prefix + "terms":
				return client.reply(chat.id, terms(), id);
			case prefix + "donate":
				return client.reply(chat.id, donate(), id);
			case prefix + "changelog":
				return client.reply(chat.id, es.changelog, id);
			// ==================================================================== END HELP SECTION ====================================================================
			case prefix + "rp":
				if (!quotedMsg) return client.reply(chat.id, es.wrongFormat, id);
				return client.sendText(chat.id, quotedMsgObj.body);
			case prefix + "test":
				return client.reply(chat.id, es.online, id);
			case prefix + "clear":
				return client.clearChat(chat.id);
			case prefix + "write":
				return client.sendText(chat.id, `*${body.slice(6).trim()}*`);
			case prefix + "lyrics":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				client.reply(chat.id, es.searching("letra"), id);
				const lyrics = await songLyrics(body.slice(8));
				return client.reply(chat.id, lyrics, id);
			case prefix + "creator":
				return client.sendContact(chat.id, "5216672545434@c.us");
			case prefix + "cheems":
				if (args.length === 1 && !quotedMsg)
					return client.reply(chat.id, es.wrongFormat, id);
				if (quotedMsg) {
					return client.sendText(
						chat.id,
						cheemsify(quotedMsgObj.isMedia ? quotedMsgObj.caption : quotedMsgObj.body)
					);
				}
				const text = body.slice(7);
				return client.sendText(chat.id, cheemsify(text));
			case prefix + "igstalk":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				if (args.length === 3 && !args[2].includes("."))
					return client.reply(chat.id, es.wrongFormat, id);
				try {
					client.reply(chat.id, es.wait, id);
					const data = await InstaClient.getProfile(args[1]);
					let postsCount;
					if (!data.private && args.length === 3) {
						postsCount = args[2].slice(1);
						if (postsCount > 12) return client.reply(chat.id, es.maxCount(12), id);
						if (postsCount < 1) return client.reply(chat.id, es.minCount(1), id);
						if (!postsCount) postsCount = 3;
					} else postsCount = 0;
					await client.sendFileFromUrl(chat.id, data.pic, "", es.igProfile(data), id);
					if (postsCount > data.lastPosts.length) postsCount = data.lastPosts.length;
					for (let index = 0; index < postsCount; index++) {
						const currentPost = data.lastPosts[index];
						await client
							.sendFileFromUrl(
								chat.id,
								currentPost.thumbnail,
								"",
								`*Fecha:* ${new Date(
									currentPost.timestamp * 1000
								).toLocaleDateString(
									"es-Mx",
									localeDateOptions
								)}\n\n*Descripción:* ${
									currentPost.caption || "_No hay descripción_"
								}\n\n*Likes:* ${currentPost.likes}\n\n*Comentarios:* ${
									currentPost.comments
								}\n\n*Link:* https://www.instagram.com/p/${
									currentPost.shortcode
								}\n`,
								id
							)
							.then(() => refreshStats({files: true}))
							.catch((err) => client.reply(chat.id, es.generalError(err), id));
					}
				} catch (error) {
					client.reply(chat.id, es.generalError(error), id);
				}
				break;
			case prefix + "sug":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				if (message.length > 500) return client.reply(chat.id, es.tooLongText, id);
				sugs_.push({
					uid: sender.id.split("@")[0],
					username: pushname,
					date: new Date().toLocaleDateString("es-MX", localeDateOptions),
					desc: body.slice(5),
				});
				await fs.writeFileSync("./database/bot/suggestions.json", JSON.stringify(sugs_));
				return client.reply(chat.id, es.savedSuggestion, id);
			case prefix + "printsugs":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				return client.reply(chat.id, es.printSuggestions(sugs_), id);
			case prefix + "clearsugs":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				sugs_ = [];
				await fs.writeFileSync("./database/bot/suggestions.json", JSON.stringify(sugs_));
				return client.reply(chat.id, es.clearedSuggestions, id);
			case prefix + "stats":
				return client.sendText(chat.id, es.stats());
			case prefix + "randomquote":
				switch (args.length) {
					case 1:
						const quote = await axios.get("https://api.quotable.io/random");
						return client.reply(chat.id, es.quoteFormat(quote.data), id);
					case 2:
						return axios
							.get(`https://api.quotable.io/random?tags=${args[1]}`)
							.then((response) =>
								client.reply(chat.id, es.quoteFormat(response.data), id)
							)
							.catch((err) => {
								return client.reply(
									chat.id,
									`${es.generalError(err.response.data.statusMessage)}\n\n${
										es.availableQuoteTags
									}`,
									id
								);
							});
					default:
						return client.reply(chat.id, es.wrongFormat, id);
				}
			case prefix + "memecreator":
				if (
					args.length === 1 ||
					(!isQuotedImage && !isMedia) ||
					(isMedia && !message.caption.includes("|")) ||
					(isQuotedImage && !body.includes("|")) ||
					(isMedia && type !== "image")
				)
					return client.reply(chat.id, es.wrongFormat, id);
				let allText;
				if (!isMedia) {
					allText = body.slice(13).split("|");
				} else {
					allText = message.caption.slice(13).split("|");
				}
				let topText = allText[0];
				let bottomText = allText[1];
				if (isQuotedImage || (isMedia && type === "image")) {
					const mediaData = await decryptMedia(quotedMsg || message, uaOverride);
					await fs.writeFileSync(`temp/image/${sender.id}.jpg`, mediaData);
					let size =
						topText.length > bottomText.length
							? 90 - topText.length * 2
							: 90 - bottomText.length * 2;
					if (size < 40) size = 40;
					if (topText.length > 45) {
						const arr = topText.split(" ");
						arr.splice(arr.length / 2 - 1, 0, "\n");
						topText = arr.join(" ");
					}
					if (bottomText.length > 45) {
						const arr = bottomText.split(" ");
						arr.splice(arr.length / 2 - 1, 0, "\n");
						bottomText = arr.join(" ");
					}
					let options = {
						image: `temp/image/${sender.id}.jpg`,
						outfile: `temp/image/${sender.id}.png`,
						topText,
						bottomText,
						padding: 60,
						fontSize: size,
					};
					memeMaker(options, function (err) {
						if (err) return client.reply(chat.id, es.generalError(err), id);
						client
							.sendFile(chat.id, `temp/image/${sender.id}.png`, "", "", id)
							.then(() => {
								fs.unlinkSync(`temp/image/${sender.id}.png`);
								fs.unlinkSync(`temp/image/${sender.id}.jpg`);
								refreshStats({files: true});
							});
					});
				}
				break;
			default:
				client.reply(chat.id, es.invalidCommand, id);
		}
	} catch (err) {
		console.log(color("[ERROR]", "red"), err);
	}
};
