const {Client} = require("@open-wa/wa-automate");
const html_to_pdf = require("html-pdf-node");
const convertapi = require("convertapi")("bnWtM4CFccvCXmmL");
const PDFMerger = require("pdf-merger-js");
const merger = new PDFMerger();
const {decryptMedia} = require("@open-wa/wa-decrypt");
const fs = require("fs");
const request = require("request");
const axios = require("axios");
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
const nsfw_ = JSON.parse(fs.readFileSync("database/group/nsfw.json"));
const mute_ = JSON.parse(fs.readFileSync("database/bot/mute.json"));
const welcome_ = JSON.parse(fs.readFileSync("database/group/welcome.json"));
const stats_ = JSON.parse(fs.readFileSync("database/bot/stats.json"));
// ======================== END READ DATABASE ============================ //

// ================================= UTILS =================================== //
const {en, es} = require("./text/lang");
moment.tz.setDefault("America/Mexico").locale("mx");
const {help, terms, info, donate, cmds} = require("../lib/help");
const {fb, ig, ytmp3, ytmp4, play, playv2, xvid} = require("../lib/downloader");
const {cheemsify, random, songLyrics, translate} = require("../lib/functions");
const {isBinary, isUrl} = require("../tools");

const ocrConfig = {
	lang: "spa+eng",
	oem: 1,
	psm: 1,
};

const stickersMetadata = {
	author: "🤖 UriBOT 🤖",
	pack: "UriBOT Stickers Pack",
	keepScale: true,
	discord: "urielalexis64#1678",
};

const animatedStickersConfig = {
	crop: false,
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
	if (calls) stats_.totalCalls += 1;
	if (files) stats_.filesSent += 1;
	if (groups) stats_.groups += 1;
	if (stickers) stats_.stickersCreated += 1;

	fs.writeFileSync("database/bot/stats.json", JSON.stringify(stats_));
};
// =================================== END UTILS ===================================== //

let isSlept = false;
let error = false;
let thereIsMerge1 = false;
let thereIsMerge2 = false;

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
			!command.startsWith("/") ||
			command.startsWith("/9j") ||
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

		refreshStats({calls: true});

		const time = moment(t * 1000).format("DD/MM HH:mm:ss");
		const botNumber = await client.getHostNumber();
		const blockNumber = await client.getBlockedIds();
		const groupId = isGroupMsg ? chat.groupMetadata.id : "";
		const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : "";
		const ownerNumber = ["5216672545434@c.us"];
		const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false;
		const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + "@c.us") : false;
		const isOwner = ownerNumber.includes(sender.id);
		const isBlocked = blockNumber.includes(sender.id);
		const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false;

		const isQuotedImage = quotedMsg && quotedMsg.type === "image";
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

		const uaOverride =
			"WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36" +
			botNumber;
		if (!isGroupMsg && command.startsWith("/"))
			console.log(
				"\x1b[1;31m~\x1b[1;37m>",
				"[\x1b[1;32mEXEC\x1b[1;37m]",
				time,
				color(msgs(command)),
				0,
				"from",
				color(pushname)
			);
		if (isGroupMsg && command.startsWith("/"))
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
			case "/sticker":
			case "/stiker":
				const circle = args[1] === "circle";
				if (isMedia && type === "image") {
					client.reply(chat.id, es.making("sticker"), id);
					const mediaData = await decryptMedia(message, uaOverride);
					const imageBase64 = `data:${mimetype};base64,${mediaData.toString("base64")}`;
					await client.sendImageAsSticker(chat.id, imageBase64, {
						...stickersMetadata,
						circle,
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
								{...stickersMetadata, circle}
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
			case "/stickergif":
			case "/stikergif":
			case "/sgif":
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
				} else client.reply(chat.id, "[❗] El video/GIF debe durar máximo 5 segundos.", id);
				refreshStats({stickers: true});
				break;
			case "/findsticker":
				client.reply(chat.id, es.searching("sticker"), id);
				const res = await ggl.scrape(body.slice(13), 5);
				await client
					.sendStickerfromUrl(chat.id, res[0].url, {method: "GET"}, stickersMetadata)
					.then((res) => {
						if (!res)
							return client.reply(
								chat.id,
								es.generalError("Sticker no encontrado. Prueba con algo distinto."),
								id
							);
						refreshStats({stickers: true});
					})
					.catch((err) => {
						client.reply(chat.id, es.generalError(err), id);
					});
				break;
			case "/unsticker":
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
			case "/ytmp3":
				client.reply(chat.id, es.downloading("audio"), id);
				const youtubeUrl = args[1];
				return ytmp3(youtubeUrl)
					.then((title) => {
						client.sendAudio(chat.id, `temp/audio/${title}.mp3`, id).then(async () => {
							await fs.unlinkSync(`temp/audio/${title}.mp3`);
							refreshStats({files: true});
						});
					})
					.catch((err) => client.reply(chat.id, `Ocurrió un error: ${err}`, id));
			case "/ytmp4":
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
			case "/play":
			case "/p":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				client.reply(chat.id, es.downloading("audio"), id);
				return play(args[0] === "/p" ? body.slice(2) : body.slice(5))
					.then(async (title) => {
						await client
							.sendFile(
								chat.id,
								`temp/audio/${title}.mp3`,
								title,
								title,
								id,
								null,
								true,
								false,
								true
							)
							.then(() => {
								fs.unlinkSync(`temp/audio/${title}.mp3`);
								refreshStats({files: true});
							})
							.catch((err) => client.reply(chat.id, es.generalError(err), id));
					})
					.catch((err) => client.reply(chat.id, es.generalError(err), id));
			case "/playv2":
			case "/pv2":
				return client.reply(chat.id, "*Comando fuera de servicio...*", id);
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				client.reply(chat.id, es.downloading("audio"), id);
				return playv2(args[0] === "/pv2" ? body.slice(5) : body.slice(8)).then((res) => {
					if (res.url) {
						return client.sendAudio(chat.id, res.url, id);
					}
					client.reply(chat.id, es.generalError(res.message), id);
				});
			case "/xvid":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				const keyword = args[1];
				return xvid(keyword).then((videoUrl) =>
					client.sendFileFromUrl(chat.id, videoUrl, keyword, keyword, id)
				);
			case "/fb":
				try {
					if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
					client.reply(chat.id, es.wait, id);
					return fb(args[1]).then((res) => {
						if (res.urlHd)
							client
								.sendFileFromUrl(chat.id, `${res.urlHd}`, "video.mp4", res.capt, id)
								.catch((err) =>
									client.reply(
										chat.id,
										es.generalError("No se puede extraer el video"),
										id
									)
								);
						else
							client
								.sendFileFromUrl(chat.id, `${res.url}`, "video.mp4", res.capt, id)
								.catch((err) =>
									client.reply(
										chat.id,
										es.generalError("No se puede extraer el video"),
										id
									)
								);
						refreshStats({files: true});
					});
				} catch (error) {
					client.reply(chat.id, es.generalError(error), id);
				}
				break;
			case "/tiktok":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				if (!args[1].includes("tiktok.com"))
					return client.reply(chat.id, es.invalidLink, id);
				client.reply(chat.id, es.wait, id);
				try {
					const videoData = await tiktok.getVideoMeta(args[1]);
					await tiktok.video(args[1], {
						download: true,
						filepath: __dirname + "\\tiktok",
					});
					await fs.renameSync(
						`tiktok/${videoData.collector[0].id}.mp4`,
						`tiktok/tiktok.mp4`
					);
					client.sendFile(chat.id, `tiktok\\tiktok.mp4`, `tiktok\\tiktok.mp4`, null, id);
				} catch (error) {
					client.sendText(chat.id, `ERROR: *${error}*`);
				}
				refreshStats({files: true});
				break;
			case "/ph":
				/* const res = await ph.search(args[1], null, null);
					const phUrl = await ph.page(
						"https://www.pornhub.com/view_video.php?viewkey=ph60abfcb33bf93",
						["title", "pornstars", "download_urls"]
					);
					console.log(phUrl); */
				//client.sendFileFromUrl(chat.id, phUrl.download_urls["480"], "si");
				break;
			case "/ig":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				return ig(args[1])
					.then((posts) => {
						posts.forEach((post) => client.sendFileFromUrl(chat.id, post));
						refreshStats({files: true});
					})
					.catch((err) => client.reply(chat.id, err, id));
			case "/reddit":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				const limitreddit = body.split(".")[1] || 1;
				if (limitreddit > 5) return client.reply(chat.id, es.maxCount(5), id);
				error = false;
				for (let index = 0; index < limitreddit; index++) {
					await axios
						.get(`https://meme-api.herokuapp.com/gimme/${args[1]}`)
						.then(async (r) => {
							const data = r.data;
							await client
								.sendFileFromUrl(chat.id, data.url, "img", es.redditPost(data), id)
								.then(refreshStats({files: true}))
								.catch((err) => client.reply(chat.id, es.generalError(err), id));
							await wait(800);
						})
						.catch((err) => {
							client.reply(chat.id, es.generalError(err.response.data.message), id);
							error = true;
						});
					if (error) break;
				}
				break;
			case "/googleimg":
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
			case "/mute":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				mute_.push(chat.id);
				fs.writeFileSync("database/bot/mute.json", JSON.stringify(mute_));
				return client.reply(chat.id, es.muted, id);
			case "/unmute":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				mute_.splice(chat.id, 1);
				fs.writeFileSync("database/bot/mute.json", JSON.stringify(mute_));
				return client.reply(chat.id, es.unmuted, id);
			case "/welcome":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				if (args[1].toLowerCase() === "enable") {
					welcome_.push(chat.id);
					fs.writeFileSync("database/group/welcome.json", JSON.stringify(welcome_));
					client.reply(chat.id, es.welcomeEnabled, id);
				} else if (args[1].toLowerCase() === "disable") {
					welcome_.splice(chat.id, 1);
					fs.writeFileSync("database/group/welcome.json", JSON.stringify(welcome_));
					client.reply(chat.id, es.welcomeDisabled, id);
				} else {
					client.reply(chat.id, es.wrongFormat, id);
				}
				break;
			case "/linkgroup":
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
			case "/adminlist":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				let mimin = "";
				for (let admon of groupAdmins) {
					mimin += `➸ @${admon.replace(/@c.us/g, "")}\n`;
				}
				await client.sendTextWithMentions(chat.id, mimin);
				break;
			case "/ownergroup":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				const Owner_ = chat.groupMetadata.owner;
				await client.sendTextWithMentions(chat.id, `Joto del grupo: @${Owner_}`);
				break;
			case "/mentionall":
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
			case "/kickall":
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
			case "/add":
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
			case "/kick":
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
			case "/leave":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				return client.sendText(chat.id, es.bye).then(client.leaveGroup(groupId));
			case "/promote":
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
			case "/demote":
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
			case "/join":
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
			case "/delete":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				if (!quotedMsg) return client.reply(chat.id, es.wrongFormat, id);
				if (!quotedMsgObj.fromMe) return client.reply(chat.id, es.wrongFormat, id);
				return client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
			// ========================================================== END GROUPS SECTION ==========================================================
			// ============================================================ OWNER SECTION ============================================================
			case "/sleep":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				isSlept = true;
				return setTimeout(() => {
					isSlept = false;
				}, args[1]);
			case "/getss":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				const sesPic = await client.getSnapshot();
				return client.sendFile(chat.id, sesPic, "session.png", "Screenshot", id);
			case "/listblock":
				let hih = `Lista de números bloqueados\nTotal : ${blockNumber.length}\n`;
				for (let i of blockNumber) {
					hih += `➸ @${i.replace(/@c.us/g, "")}\n`;
				}
				return client.sendTextWithMentions(chat.id, hih, id);
			case "/leaveall":
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
			case "/clearall":
				if (!isOwner) return client.reply(chat.id, es.onlyBotOwner, id);
				const allChatz = await client.getAllChats();
				for (let dchat of allChatz) {
					await client.deleteChat(dchat.id);
				}
				return client.reply(chat.id, "Succes clear all chat!", id);
			case "/bc":
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
			case "/nsfwmenu":
				return client.reply(chat.id, es.menuNsfw, id);
			case "/nsfw":
				if (!isGroupMsg) return client.reply(chat.id, es.onlyGroups, id);
				if (!isGroupAdmins) return client.reply(chat.id, es.onlyAdmins, id);
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				if (args[1].toLowerCase() === "enable") {
					nsfw_.push(chat.id);
					fs.writeFileSync("database/group/NSFW.json", JSON.stringify(nsfw_));
					client.reply(chat.id, es.nsfwEnabled, id);
				} else if (args[1].toLowerCase() === "disable") {
					nsfw_.splice(chat.id, 1);
					fs.writeFileSync("database/group/NSFW.json", JSON.stringify(nsfw_));
					client.reply(chat.id, es.nsfwDisabled, id);
				} else {
					client.reply(chat.id, es.wrongFormat, id);
				}
				break;
			case "/randomloli":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const loli = await get.get(`http://api.nekos.fun:8080/api/lewd`).json();
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, loli.image, "Loli.jpg", "Loli!", id);
			case "/randomfeet":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const feet = await get.get(`http://api.nekos.fun:8080/api/feet`).json();
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, feet.image, "Feet.jpg", "Feet!", id);
			case "/randomcum":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const cum = await get.get(`http://api.nekos.fun:8080/api/cum`).json();
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, cum.image, "Cum.jpg", "Cum!", id);
			case "/randombj":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const bj = await get.get(`http://api.nekos.fun:8080/api/blowjob`).json();
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, bj.image, "Blowjob.jpg", "Blowjob!", id);
			case "/randomhentai":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const hentai = await random("hentai");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, hentai, `Hentai`, "Hentai!", id);
			case "/randomass":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const ass = await random("ass");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, ass, `Ass`, "Ass!", id);
			case "/randompussy":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const pussy = await random("pussy");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, pussy, `Pussy`, "Pussy!", id);
			case "/randomanal":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const anal = await random("anal");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, anal, `Anal`, "Anal!", id);
			case "/randomgonewild":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const gonewild = await random("gonewild");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, gonewild, `Gonewild`, "Gonewild!", id);
			case "/random4k":
				if (isGroupMsg) if (!isNsfw) return client.reply(chat.id, es.nsfwStatus, id);
				const _4k = await random("4k");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, _4k, `4k`, "4k!", id);
			case "/randomboobs":
				if (isGroupMsg) if (!isNsfw) return client.reply(from, es.nsfwStatus, id);
				const boobs = await random("boobs");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, boobs, `Boobs`, "Boobs!", id);
			case "/randomtentacle":
				if (isGroupMsg) if (!isNsfw) return client.reply(from, es.nsfwStatus, id);
				const tentacle = await random("tentacle");
				refreshStats({files: true});
				return client.sendFileFromUrl(chat.id, tentacle, `Tentacles`, "Tentacles!", id);
			// ========================================================== END NSFW SECTION ==========================================================
			// ========================================================== 🛠 UTILS/EDUCATIONAL SECTION 📚 ==========================================================
			case "/link2pdf":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				let options = {format: "A4"};
				let file = {url: args[1]};
				return html_to_pdf
					.generatePdf(file, options)
					.then((pdfBuffer) => {
						fs.writeFile(`temp/archive/${chat.id}_link2pdf.pdf`, pdfBuffer, (err) => {
							if (!err) {
								client
									.sendFile(
										chat.id,
										`temp/archive/${chat.id}_link2pdf.pdf`,
										"by UriBOT",
										"*by UriBot*",
										id
									)
									.then(() => {
										refreshStats({files: true});
										fs.unlinkSync(`temp/archive/${chat.id}_link2pdf.pdf`);
									});
							}
						});
					})
					.catch((err) => client.reply(chat.id, es.generalError(err), id));
			case "/doc2pdf":
			case "/img2pdf":
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
			case "/merge1":
				if (!isQuotedPDF) return client.reply(chat.id, es.wrongFormat, id);
				const mergeData1 = await decryptMedia(quotedMsg, uaOverride);
				const mergeFilename1 = `temp/archive/${sender.id}_merge1.pdf`;
				await fs.writeFileSync(mergeFilename1, mergeData1);
				return client.reply(chat.id, "*✅ Primera parte guardada.*", id);
			case "/merge2":
				if (!isQuotedPDF) return client.reply(chat.id, es.wrongFormat, id);
				const mergeData2 = await decryptMedia(quotedMsg, uaOverride);
				const mergeFilename2 = `temp/archive/${sender.id}_merge2.pdf`;
				await fs.writeFileSync(mergeFilename2, mergeData2);
				return client.reply(
					chat.id,
					"*✅ Segunda parte guardada.* Ahora envíe el comando */mergepdfs* para combinarlos.",
					id
				);
			case "/mergepdfs":
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
			case "/brainly":
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
			case "/url2img":
				const _query = body.slice(9);
				if (!isUrl(_query)) return client.reply(chat.id, es.wrongFormat, id);
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				return client
					.sendFileFromUrl(chat.id, _query, `Image from ${_query}`, null, id)
					.then(() => refreshStats({files: true}));
			case "/translate":
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
			case "/tts":
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
			case "/google":
				const limitSearch = body.split(".")[1];
				if (limitSearch > 5) return client.reply(chat.id, es.maxCount(5), id);
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				client.reply(chat.id, es.searching("información"), id);
				const query = body.slice(8);
				return google({query, "no-display": true, limit: limitSearch || 1})
					.then(async (results) => {
						let txt = `*GOOGLE SEARCH*\n\n_*Search results for: ${query}*_`;
						for (let i = 0; i < results.length; i++) {
							txt += `\n\n*Title*: ${results[i].title}\n*Desc*: ${results[i].snippet}\n*Link*: ${results[i].link}\n\n`;
						}
						await client.reply(chat.id, txt, id);
					})
					.catch(async (err) => {
						await client.reply(chat.id, err, id);
					});
			case "/math":
				return axios
					.get(`http://api.mathjs.org/v4/?expr=${body.slice(6).toLowerCase()}`)
					.then((res) => {
						client.reply(chat.id, `*Respuesta:* ${res.data}`, id);
					})
					.catch((err) => client.reply(chat.id, es.generalError(err), id));
			case "/imagetotext":
			case "/imgtotext":
			case "/imgtotxt":
			case "/totxt":
			case "/totext":
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
			case "/wiki":
				break;
			// ========================================================== 🛠 END UTILS/EDUCATIONAL SECTION 📚 ==========================================================
			// ===================================================================== HELP SECTION =====================================================================
			case "/help":
				return client.sendText(chat.id, help());
			case "/commands":
				return client.sendText(chat.id, cmds());
			case "/info":
				return client.sendLinkWithAutoPreview(
					chat.id,
					"https://github.com/urielexis64/whatsapp-uribot",
					info()
				);
			case "/terms":
				return client.reply(chat.id, terms(), id);
			case "/donate":
				return client.reply(chat.id, donate(), id);
			case "/changelog":
				return client.reply(chat.id, es.changelog, id);
			// ==================================================================== END HELP SECTION ====================================================================
			case "/rp":
				if (!quotedMsg) return client.reply(chat.id, es.wrongFormat, id);
				return client.sendText(chat.id, quotedMsgObj.body);
			case "/test":
				return client.reply(chat.id, es.online, id);
			case "/clear":
				return client.clearChat(chat.id);
			case "/write":
				return client.sendText(chat.id, `*${body.slice(6)}*`);
			case "/lyrics":
				if (args.length === 1) return client.reply(chat.id, es.wrongFormat, id);
				client.reply(chat.id, es.searching("letra"), id);
				const lyrics = await songLyrics(body.slice(8));
				return client.reply(chat.id, lyrics, id);
			case "/creator":
				return client.sendContact(chat.id, "5216672545434@c.us");
			case "/cheems":
				if (args.length === 1 && !quotedMsg) return client.reply(from);
				if (quotedMsg) {
					return client.reply(
						chat.id,
						cheemsify(quotedMsgObj.isMedia ? quotedMsgObj.caption : quotedMsgObj.body),
						id
					);
				}
				const text = body.slice(7);
				return client.reply(chat.id, cheemsify(text), id);
			case "/igstalk":
				try {
					client.reply(chat.id, es.wait, id);
					const data = await InstaClient.getProfile(args[1]);
					client.sendFileFromUrl(chat.id, data.pic, "", es.igProfile(data), id);
				} catch (error) {
					client.reply(chat.id, es.generalError(error), id);
				}
				break;
			case "/stats":
				return client.sendText(chat.id, es.stats());
			default:
				client.reply(chat.id, es.invalidCommand, id);
		}
	} catch (err) {
		console.log(color("[ERROR]", "red"), err);
	}
};
