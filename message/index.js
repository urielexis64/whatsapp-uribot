const tiktok = require("tiktok-scraper");
const html_to_pdf = require("html-pdf-node");
const {decryptMedia} = require("@open-wa/wa-decrypt");
const fs = require("fs");
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

const {cheemsify, random, changelog, songLyrics, translate, sleep} = require("../lib/functions");
const {help, terms, info, donate, readme} = require("../lib/help");
const nsfw_ = JSON.parse(fs.readFileSync("database/group/nsfw.json"));
const welcome = JSON.parse(fs.readFileSync("database/group/welcome.json"));
const Insta = require("scraper-instagram");
const InstaClient = new Insta();

moment.tz.setDefault("America/Mexico").locale("mx");

const {fb, ig, ytmp3, ytmp4, play, xvid} = require("../lib/downloader");
const {Client} = require("@open-wa/wa-automate");

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

		if (!command.startsWith("/") || command.startsWith("/9j") || command === "") return;

		const msgs = (message) => {
			if (command.startsWith("/")) {
				if (message.length >= 10) {
					return `${message.substr(0, 15)}`;
				} else {
					return `${message}`;
				}
			}
		};

		const stickersMetadata = {
			author: "🤖 UriBOT 🤖",
			pack: "UriBOT Stickers Pack",
			keepScale: true,
			discord: "urielalexis64#1678",
		};

		const mess = {
			wait: "[ESPERA] Solicitud en curso ⏳ Espere un momento...",
			error: {
				St: "[❗] Envíe la imagen con el título *!Sticker* o cita alguna imagen del chat con el mismo texto.",
				Yt3: "[❗] Ocurrió un error, no se puede convertir a mp3.",
				Yt4: "[❗] Ocurrió un error, tal vez el error fue causado por el sistema.",
				Ig: "[❗] Ocurrió un error, tal vez porque la cuenta es privada.",
				Ki: "[❗] ¡El bot no puede expulsar a un administrador.!",
				Ad: "[❗] No se pudo agregar el contacto, tal vez porque es privado.",
				Iv: "[❗] Enlace inválido.",
			},
		};
		const time = moment(t * 1000).format("DD/MM HH:mm:ss");
		const botNumber = await client.getHostNumber();
		const blockNumber = await client.getBlockedIds();
		const groupId = isGroupMsg ? chat.groupMetadata.id : "";
		const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : "";
		const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false;
		const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + "@c.us") : false;
		const ownerNumber = ["526672545434@us.c", "526672545434"];
		const isOwner = ownerNumber.includes(sender.id);
		const isBlocked = blockNumber.includes(sender.id);
		const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false;
		const uaOverride =
			"WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36" +
			botNumber;
		const isUrl = new RegExp(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi
		);
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
			case "/test":
				return client.reply(chat.id, "*En línea. ✅*", id);
			case "/clear":
				client.clearChat(chat.id);
				break;
			case "/xvid":
				if (args.length === 1)
					return client.reply(chat.id, "Uso correcto: */xvid [término de búsqueda]*");

				const keyword = args[1];
				return xvid(keyword).then((videoUrl) =>
					client.sendFileFromUrl(chat.id, videoUrl, keyword, keyword, id)
				);
			case "/sticker":
			case "/stiker":
				if (isMedia && type === "image") {
					const mediaData = await decryptMedia(message, uaOverride);
					const imageBase64 = `data:${mimetype};base64,${mediaData.toString("base64")}`;
					await client.sendImageAsSticker(chat.id, imageBase64, stickersMetadata);
				} else if (quotedMsg && quotedMsg.type === "image") {
					const mediaData = await decryptMedia(quotedMsg, uaOverride);
					const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString(
						"base64"
					)}`;
					await client.sendImageAsSticker(chat.id, imageBase64, stickersMetadata);
				} else if (args.length === 2) {
					const url = args[1];
					if (url.match(isUrl)) {
						await client
							.sendStickerfromUrl(chat.id, url, {method: "get"}, stickersMetadata)
							.catch((err) => console.log("Caught exception: ", err));
					} else {
						client.reply(chat.id, mess.error.Iv, id);
					}
				} else {
					client.reply(chat.id, mess.error.St, id);
				}
				break;
			case "/stickergif":
			case "/stikergif":
			case "/sgif":
				if (isMedia) {
					if (
						(mimetype === "video/mp4" && message.duration <= 10) ||
						(mimetype === "image/gif" && message.duration <= 10)
					) {
						const mediaData = await decryptMedia(message, uaOverride);
						client.reply(from, "[ESPERA] Esto puede tardar varios minutos...", id);
						const filename = `./media/aswu.${mimetype.split("/")[1]}`;
						try {
							await fs.writeFileSync(filename, mediaData);
							client.sendMp4AsSticker(
								chat.id,
								filename,
								{
									crop: false,
									fps: 30,
									endTime: "00:00:09.0",
								},
								stickersMetadata
							);
						} catch (error) {
							client.reply(
								chat.id,
								"El tamaño del video es muy extenso.\nMáximo peso para videos: *1.5 MB*",
								id
							);
						}
					} else
						client.reply(
							chat.id,
							"[❗] El video/GIF debe durar menos de 10 segundos.",
							id
						);
				}
				break;
			case "/tts":
				if (args.length === 1) {
					return client.reply(
						chat.id,
						"Enviar comando */tts [es, en, jp, ar, id] [texto]*\nPor ejemplo */tts es Hola, soy UriBot, mucho gusto.*",
						id
					);
				}
				const dataText = body.slice(8);
				if (dataText === "") return client.reply(chat.id, "Te faltó el texto.", id);
				if (dataText.length > 500)
					return client.reply(chat.id, "¡El texto es demasiado largo!", id);
				let dataBhs = body.slice(5, 7);
				if (dataBhs === "id") {
					ttsId.save("./media/tts/resId.mp3", dataText, function () {
						client.sendPtt(chat.id, "./media/tts/resId.mp3", id);
					});
				} else if (dataBhs === "en") {
					ttsEn.save("./media/tts/resEn.mp3", dataText, function () {
						client.sendPtt(chat.id, "./media/tts/resEn.mp3", id);
					});
				} else if (dataBhs === "jp") {
					ttsJp.save("./media/tts/resJp.mp3", dataText, function () {
						client.sendPtt(chat.id, "./media/tts/resJp.mp3", id);
					});
				} else if (dataBhs === "ar") {
					ttsAr.save("./media/tts/resAr.mp3", dataText, function () {
						client.sendPtt(chat.id, "./media/tts/resAr.mp3", id);
					});
				} else if (dataBhs === "es") {
					ttsEs.save("./media/tts/resEs.mp3", dataText, function () {
						client.sendPtt(chat.id, "./media/tts/resEs.mp3", id);
					});
				} else {
					client.reply(
						chat.id,
						"Ingrese los datos del idioma: [es] para español, [en] para inglés, [jp] para japonés, [ar] para árabe y [id] para indonesio. ",
						id
					);
				}
				break;
			case "/ytmp3":
				client.reply(chat.id, "[ESPERA] Estoy descargando el audio. Sé paciente.", id);
				const youtubeUrl = args[1];
				return ytmp3(youtubeUrl)
					.then((title) =>
						client.sendFile(chat.id, `temp/audio/${title}.mp3`, title, title, id)
					)
					.catch((err) => client.reply(chat.id, `Ocurrió un error: ${err}`, id));
			case "/ytmp4":
				if (args.length === 1)
					return client.reply(chat.id, "El uso correcto es: */ytmp4 [youtubeLink]*", id);
				client.reply(chat.id, "[ESPERA] Estoy descargando el video. Sé paciente.", id);

				const isYtUrl = args[1].match(isUrl);
				const value = isYtUrl ? args[1] : body.slice(7);
				return ytmp4(isYtUrl, value)
					.then((title) =>
						client.sendFile(
							chat.id,
							`temp/video/${title}.mp4`,
							`${title}.mp4`,
							title,
							id
						)
					)
					.catch((err) => client.reply(chat.id, `Ocurrió un error: ${err}`, id));
			case "/play":
			case "/p":
				client.reply(chat.id, "*[ESPERA]* Estoy descargando el audio. Sé paciente. 😉", id);
				return play(args[0] === "/p" ? body.slice(2) : body.slice(5))
					.then((title) =>
						client.sendFile(
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
					)
					.catch((err) => client.reply(chat.id, err, id));
			case "/lyrics":
				if (args.length === 1)
					return client.reply(
						chat.id,
						"Uso correcto: */lyrics [songLyric]*\nEj. /lyrics lalala",
						id
					);
				client.reply(chat.id, "*Buscando letra...*", id);
				return client.reply(chat.id, await songLyrics(body.slice(8)), id);
			case "/ph":
				/* const res = await ph.search(args[1], null, null);
				const phUrl = await ph.page(
					"https://www.pornhub.com/view_video.php?viewkey=ph60abfcb33bf93",
					["title", "pornstars", "download_urls"]
				);
				console.log(phUrl); */
				//client.sendFileFromUrl(chat.id, phUrl.download_urls["480"], "si");
				break;
			case "/write":
				return client.sendText(chat.id, `*${body.slice(6)}*`);
			case "/translate":
				if (args.length === 1 && !quotedMsg)
					return client.reply(
						chat.id,
						"Uso correcto:\n*/translate [targetLanguage] [text]*\n\nEj.\n/translate es-ES hello, im new here\n// output: hola, soy nuevo aquí",
						id
					);

				let targetLanguage = args[1];
				if (targetLanguage && !availableLanguages.includes(targetLanguage)) {
					return client.reply(
						chat.id,
						`Idioma *${targetLanguage}* inválido.\n\nIdiomas válidos:\n${availableLanguages
							.map((lan) => `*• ${lan}*`)
							.join("\n")}`,
						id
					);
				} else {
					targetLanguage = targetLanguage ? targetLanguage : "es-ES";
				}

				if (quotedMsg) {
					const translatedText = await translate(quotedMsgObj.body, targetLanguage);
					return client.reply(chat.id, translatedText, id);
				}
				const translatedText = await translate(
					args[2] ? body.slice(17) : body.slice(11),
					targetLanguage
				);
				return client.reply(chat.id, translatedText, id);
			case "/wiki":
				break;
			case "/fb":
				try {
					if (args.length === 1) {
						return client.reply(chat.id, "Uso correcto */fb [linkFb]*", id);
					} else {
						client.reply(chat.id, mess.wait, id);
						fb(args[1]).then((res) => {
							if (res.urlHd)
								return client.sendFileFromUrl(
									chat.id,
									`${res.urlHd}`,
									"video.mp4",
									res.capt,
									id
								);
							else
								return client.sendFileFromUrl(
									chat.id,
									`${res.url}`,
									"video.mp4",
									res.capt,
									id
								);
						});
					}
				} catch (error) {
					console.log(error);
				}
				break;
			case "/tiktok":
				if (args.length === 1)
					return client.reply(
						chat.id,
						"El uso correcto es: */tiktok [link]* \nEjemplo: /tiktok https://vm.tiktok.com/ZSJ5yT7Gp/",
						id
					);
				if (!args[1].includes("tiktok.com"))
					return client.reply(chat.id, mess.error.Iv, id);
				client.reply(chat.id, mess.wait, id);
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

				break;
			case "/creator":
				client.sendContact(chat.id, "5216672545434@c.us");
				break;
			case "/igstalk":
				try {
					client.reply(chat.id, mess.wait, id);
					const {name, bio, followers, following, posts, pic} =
						await InstaClient.getProfile(args[1]);

					client.sendFileFromUrl(
						from,
						pic,
						"",
						`*Nombre:* ${name}\n\n*Biografía:*\n${bio}\n\n*Seguidores:*\n${followers}\n\n*Siguiendo:*\n${following}\n\n*Posts:*\n${posts}`,
						id
					);
				} catch (error) {
					client.reply(chat.id, `*Error: ${error}*`, id);
				}

				break;
			case "/ig":
				if (args.length === 1)
					return client.reply(
						chat.id,
						"Uso correcto:\n*/ig [igLink]*\n\nEj.\n/ig https://www.instagram.com/p/CK2xvVYheZl/",
						id
					);
				return ig(args[1])
					.then((url) => client.sendFileFromUrl(chat.id, url, "", "", id))
					.catch((err) => client.reply(chat.id, err, id));
			case "/reddit":
				return axios
					.get(`https://meme-api.herokuapp.com/gimme/${args[1]}`)
					.then((res) => {
						const data = res.data;
						client.sendFileFromUrl(
							chat.id,
							data.url,
							"img",
							`*Title:* ${data.title}*\n*PostLink:* ${data.postLink}\n*Subreddit:* ${data.subreddit}\n*Up Votes:* ${data.ups}\n*Original Image:* ${data.url}`,
							id
						);
					})
					.catch((err) => {
						client.reply(chat.id, err.response.data.message, id);
					});
			case "/nsfw":
				if (!isGroupMsg)
					return client.reply(
						chat.id,
						"Este comando solo está disponible en grupos.",
						id
					);
				if (!isGroupAdmins)
					return client.reply(chat.id, "Solo los admins pueden usar este comando.", id);
				if (args.length === 1)
					return client.reply(
						chat.id,
						"El uso correcto es ```!nsfw enable``` o ```!nsfw disable```",
						id
					);
				if (args[1].toLowerCase() === "enable") {
					nsfw_.push(chat.id);
					fs.writeFileSync("./lib/NSFW.json", JSON.stringify(nsfw_));
					client.reply(
						chat.id,
						"¡El comando NSWF se activó con éxito en este grupo!\nEnvía *!nsfwMenu * para ver qué opciones tengo para ti. 😉",
						id
					);
				} else if (args[1].toLowerCase() === "disable") {
					nsfw_.splice(chat.id, 1);
					fs.writeFileSync("./lib/NSFW.json", JSON.stringify(nsfw_));
					client.reply(
						chat.id,
						"*¡El comando NSFW se desactivó con éxito en este grupo!*",
						id
					);
				} else {
					client.reply(
						chat.id,
						"El uso correcto es */nsfw enable* o */nsfw disable*",
						id
					);
				}
				break;
			case "/welcome":
				if (!isGroupMsg)
					return client.reply(chat.id, "*Ese comando solo es permitido en grupos.*", id);
				if (!isGroupAdmins)
					return client.reply(
						chat.id,
						"*Tienes que ser admin para ejecutar ese comando.*",
						id
					);
				if (args.length === 1)
					return client.reply(
						chat.id,
						"El uso correcto es */welcome enable* o */welcome disable*",
						id
					);
				if (args[1].toLowerCase() === "enable") {
					welcome.push(chat.id);
					fs.writeFileSync("database/group/welcome.json", JSON.stringify(welcome));
					client.reply(chat.id, "Muy bien, ya activé el modo *Bienvenida*", id);
				} else if (args[1].toLowerCase() === "disable") {
					welcome.splice(chat.id, 1);
					fs.writeFileSync("database/group/welcome.json", JSON.stringify(welcome));
					client.reply(chat.id, "Muy bien, ya desactivé el modo *Bienvenida*", id);
				} else {
					client.reply(
						chat.id,
						"El uso correcto es */nsfw enable* o */nsfw disable*",
						id
					);
				}
				break;
			case "/nsfwmenu":
				client.reply(
					chat.id,
					"*Comandos NSFW disponibles*\n\n1. !randomHentai 👧 \n2. !randomBoobs 🍈🍈\n3. !randomPussy 🥟\n4. !randomAss 🍑\n5. !random4k 📺\n6. !randomTentacle 🦑",
					id
				);
				break;
			case "/wait":
				if ((isMedia && type === "image") || (quotedMsg && quotedMsg.type === "image")) {
					if (isMedia) {
						var mediaData = await decryptMedia(message, uaOverride);
					} else {
						var mediaData = await decryptMedia(quotedMsg, uaOverride);
					}
					const imgBS4 = `data:${mimetype};base64,${mediaData.toString("base64")}`;
					client.reply(chat.id, "Searching....", id);
					fetch("https://trace.moe/api/search", {
						method: "POST",
						body: JSON.stringify({image: imgBS4}),
						headers: {"Content-Type": "application/json"},
					})
						.then((respon) => respon.json())
						.then((resolt) => {
							if (resolt.docs && resolt.docs.length <= 0) {
								client.reply(from, "Maaf, saya tidak tau ini anime apa", id);
							}
							const {
								is_adult,
								title,
								title_chinese,
								title_romaji,
								title_english,
								episode,
								similarity,
								filename,
								at,
								tokenthumb,
								anilist_id,
							} = resolt.docs[0];
							teks = "";
							if (similarity < 0.92) {
								teks = "*Saya memiliki keyakinan rendah dalam hal ini* :\n\n";
							}
							teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`;
							teks += `➸ *Ecchi* : ${is_adult}\n`;
							teks += `➸ *Eps* : ${episode.toString()}\n`;
							teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`;
							var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(
								filename
							)}?t=${at}&token=${tokenthumb}`;
							client
								.sendFileFromUrl(chat.id, video, "nimek.mp4", teks, id)
								.catch(() => {
									client.reply(chat.id, teks, id);
								});
						})
						.catch(() => {
							client.reply(chat.id, "Error !", id);
						});
				} else {
					client.sendFile(
						chat.id,
						"./media/img/tutod.jpg",
						"Tutor.jpg",
						"Neh contoh mhank!",
						id
					);
				}
				break;
			case "/linkgroup":
				if (!isBotGroupAdmins)
					return client.reply(
						chat.id,
						"Este comando solo se puede usar cuando el bot se convierte en administrador.",
						id
					);
				if (isGroupMsg) {
					const inviteLink = await client.getGroupInviteLink(groupId);
					client.sendLinkWithAutoPreview(chat.id, inviteLink, `\nLink group *${name}*`);
				} else {
					client.reply(chat.id, "*¡Este comando solo se puede usar en grupos!*", id);
				}
				break;
			case "/bc":
				/* if (!isOwner) return client.reply(from, "Perintah ini hanya untuk Owner bot!", id);
				let msg = body.slice(4);
				const chatz = await client.getAllChatIds();
				for (let ids of chatz) {
					var cvk = await client.getChatById(ids);
					if (!cvk.isReadOnly)
						await client.sendText(ids, `[ Shinomiya Kaguya BOT Broadcast ]\n\n${msg}`);
				}
				client.reply(from, "Broadcast Success!", id); */
				break;
			case "/adminlist":
				if (!isGroupMsg)
					return client.reply(chat.id, "¡Este comando solo se puede usar en grupos!", id);
				let mimin = "";
				for (let admon of groupAdmins) {
					mimin += `➸ @${admon.replace(/@c.us/g, "")}\n`;
				}
				await client.sendTextWithMentions(chat.id, mimin);
				break;
			case "/ownergroup":
				if (!isGroupMsg)
					return client.reply(chat.id, "¡Este comando solo se puede usar en grupos!", id);
				const Owner_ = chat.groupMetadata.owner;
				await client.sendTextWithMentions(chat.id, `Propietario del grupo: @${Owner_}`);
				break;
			case "/mentionall":
				if (!isGroupMsg)
					return client.reply(chat.id, "¡Este comando solo se puede usar en grupos!", id);
				if (!isGroupAdmins)
					return client.reply(
						chat.id,
						"Este comando solo puede ser utilizado por administradores del grupo.",
						id
					);
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
				if (!isGroupMsg)
					return client.reply(chat.id, "¡Este comando solo se puede usar en grupos!", id);
				const isGroupOwner = sender.id === chat.groupMetadata.owner;
				if (!isGroupOwner)
					return client.reply(
						chat.id,
						"Este comando solo puede ser utilizado por el propietario del grupo.",
						id
					);
				if (!isBotGroupAdmins)
					return client.reply(
						chat.id,
						"Este comando solo se puede usar cuando el bot se convierte en administrador.",
						id
					);
				const allMem = await client.getGroupMembers(groupId);
				for (let i = 0; i < allMem.length; i++) {
					if (groupAdmins.includes(allMem[i].id)) {
						console.log("Ups! Esta persona es admin.");
					} else {
						await client.removeParticipant(groupId, allMem[i].id);
					}
				}
				client.reply(chat.id, "¡Listo! Ya expulsé a todos los miembros del grupo.", id);
				break;
			case "/leaveall":
				if (!isOwner)
					return client.reply(
						chat.id,
						"*Este comando es solo para el propietario del bot.*",
						id
					);
				const allChats = await client.getAllChatIds();
				const allGroups = await client.getAllGroups();
				for (let gclist of allGroups) {
					await client.sendText(
						gclist.contact.id,
						`Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`
					);
					await client.leaveGroup(gclist.contact.id);
				}
				client.reply(chat.id, "Succes leave all group!", id);
				break;
			case "/clearall":
				if (!isOwner)
					return client.reply(
						chat.id,
						"*Este comando es solo para el propietario del bot.*",
						id
					);
				const allChatz = await client.getAllChats();
				for (let dchat of allChatz) {
					await client.deleteChat(dchat.id);
				}
				client.reply(chat.id, "Succes clear all chat!", id);
				break;
			case "/add":
				const orang = args[1];
				if (!isGroupMsg)
					return client.reply(
						chat.id,
						"*Esta función solo se puede utilizar en grupos.*",
						id
					);
				if (args.length === 1)
					return client.reply(
						chat.id,
						"Para utilizar esta función, envíe el comando */add 521xxxxx*",
						id
					);
				if (!isGroupAdmins)
					return client.reply(
						chat.id,
						"*Este comando solo puede ser utilizado por administradores de grupo.*",
						id
					);
				if (!isBotGroupAdmins)
					return client.reply(
						chat.id,
						"*Este comando solo se puede usar cuando el bot se convierte en administrador.*",
						id
					);
				try {
					await client.addParticipant(chat.id, `${orang}@c.us`);
				} catch {
					client.reply(chat.id, mess.error.Ad, id);
				}
				break;
			case "/kick":
				if (!isGroupMsg)
					return client.reply(
						chat.id,
						"*Esta función solo se puede utilizar en grupos.*",
						id
					);
				if (!isGroupAdmins)
					return client.reply(
						chat.id,
						"*Este comando solo puede ser utilizado por administradores del grupo.*",
						id
					);
				if (!isBotGroupAdmins)
					return client.reply(
						chat.id,
						"*Este comando solo se puede usar cuando el bot se convierte en administrador.*",
						id
					);
				if (mentionedJidList.length === 0)
					return client.reply(
						chat.id,
						"Para usar este comando, envíe *!kick* @tagmember",
						id
					);
				await client.sendText(
					chat.id,
					`Miembro expulsado:\n${mentionedJidList.join("\n")}`
				);
				for (let i = 0; i < mentionedJidList.length; i++) {
					if (groupAdmins.includes(mentionedJidList[i]))
						return client.reply(chat.id, mess.error.Ki, id);
					await client.removeParticipant(groupId, mentionedJidList[i]);
				}
				break;
			case "/leave":
				if (!isOwner)
					return client.reply(
						chat.id,
						"*Este comando es solo para el propietario del bot.*",
						id
					);
				if (!isGroupMsg)
					return client.reply(
						chat.id,
						"*Este comando solo se puede usar en grupos.*",
						id
					);
				if (!isGroupAdmins)
					return client.reply(
						chat.id,
						"*Este comando solo puede ser utilizado por administradores del grupo.",
						id
					);
				await client
					.sendText(chat.id, "*Ahí nos vidrios. 👋*")
					.then(() => client.leaveGroup(groupId));
				break;
			case "/promote":
				if (!isGroupMsg)
					return client.reply(
						chat.id,
						"*Esta función solo se puede utilizar en grupos.*",
						id
					);
				if (!isGroupAdmins)
					return client.reply(
						chat.id,
						"*Este comando solo puede ser utilizado por administradores del grupo.",
						id
					);
				if (!isBotGroupAdmins)
					return client.reply(
						chat.id,
						"*Esta función solo se puede usar cuando el bot es un administrador.*",
						id
					);
				if (mentionedJidList.length === 0)
					return client.reply(
						chat.id,
						"Para usar esta función, envíe el comando *!promote @tagmember*",
						id
					);
				if (mentionedJidList.length >= 2)
					return client.reply(
						chat.id,
						"*Lo sentimos, este comando solo se puede aplicar a un usuario.*",
						id
					);
				if (groupAdmins.includes(mentionedJidList[0]))
					return client.reply(chat.id, "Maaf, user tersebut sudah menjadi admin.", id);
				await client.promoteParticipant(groupId, mentionedJidList[0]);
				await client.sendTextWithMentions(
					chat.id,
					`Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`
				);
				break;
			case "/demote":
				if (!isGroupMsg)
					return client.reply(chat.id, "Fitur ini hanya bisa di gunakan dalam group", id);
				if (!isGroupAdmins)
					return client.reply(
						chat.id,
						"Fitur ini hanya bisa di gunakan oleh admin group",
						id
					);
				if (!isBotGroupAdmins)
					return client.reply(
						chat.id,
						"Fitur ini hanya bisa di gunakan ketika bot menjadi admin",
						id
					);
				if (mentionedJidList.length === 0)
					return client.reply(
						chat.id,
						"Untuk menggunakan fitur ini, kirim perintah *!demote* @tagadmin",
						id
					);
				if (mentionedJidList.length >= 2)
					return client.reply(
						chat.id,
						"Maaf, perintah ini hanya dapat digunakan kepada 1 orang.",
						id
					);
				if (!groupAdmins.includes(mentionedJidList[0]))
					return client.reply(chat.id, "Maaf, user tersebut tidak menjadi admin.", id);
				await client.demoteParticipant(groupId, mentionedJidList[0]);
				await client.sendTextWithMentions(
					chat.id,
					`Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`
				);
				break;
			case "/join":
				if (args.length < 2)
					return client.reply(
						chat.id,
						"Envíe el comando */join [groupLink]* \n\nEjemplo: \n */join https://chat.whatsapp.com/blabla*",
						id
					);
				const link = args[1];
				const key = args[2];
				const tGr = await client.getAllGroups();
				const minMem = 30;
				const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi);
				/* if (key !== "lGjYt4zA5SQlTDx9z9Ca")
					return client.reply(
						chat.id,
						"*key* salah! silahkan chat owner bot unruk mendapatkan key yang valid",
						id
					); */
				const check = await client.inviteInfo(link);
				if (!isLink) return client.reply(chat.id, "¡Y el link? 👊🤬", id);
				if (check.status === 200) {
					await client
						.joinGroupViaLink(link)
						.then(() => client.reply(chat.id, "¡Listo! Ya me uní. 😁", id));
				} else {
					client.reply(chat.id, "Enlace de grupo inválido.", id);
				}
				break;
			case "/delete":
				if (!isGroupMsg)
					return client.reply(
						chat.id,
						"*Esta función solo se puede utilizar en grupos.*",
						id
					);
				if (!isGroupAdmins)
					return client.reply(
						chat.id,
						"*Este comando solo puede ser utilizado por administradores del grupo.",
						id
					);
				if (!quotedMsg)
					return client.reply(
						chat.id,
						"¡Uso incorrecto!, envía el comando */delete [tagBotMessage]*",
						id
					);
				if (!quotedMsgObj.fromMe)
					return client.reply(
						chat.id,
						"*¡Uso incorrecto!, el bot no puede borrar los mensajes de otros usuarios.*",
						id
					);
				client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
				break;
			case "/getss":
				if (!isOwner)
					return client.reply(
						chat.id,
						"*Este comando es solo para el propietario del bot.*",
						id
					);
				const sesPic = await client.getSnapshot();
				client.sendFile(chat.id, sesPic, "session.png", "Screenshot", id);
				break;
			case "/listblock":
				let hih = `Lista de números bloqueados\nTotal : ${blockNumber.length}\n`;
				for (let i of blockNumber) {
					hih += `➸ @${i.replace(/@c.us/g, "")}\n`;
				}
				client.sendTextWithMentions(chat.id, hih, id);
				break;
			case "/randomloli":
				const loli = await get.get(`http://api.nekos.fun:8080/api/lewd`).json();
				client.sendFileFromUrl(chat.id, loli.image, "loli.jpeg", "Loli!", id);
				break;
			case "/randomhentai":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							chat.id,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con */nsfw enable*",
							id
						);
				}
				const hentai = await random("hentai");
				client.sendFileFromUrl(chat.id, hentai, `Hentai${ext}`, "Hentai!", id);
				break;
			case "/randomass":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							chat.id,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con */nsfw enable*",
							id
						);
				}
				const ass = await random("ass");
				client.sendFileFromUrl(chat.id, ass, `Ass`, "Ass!", id);
				break;
			case "/randompussy":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							chat.id,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con */nsfw enable*",
							id
						);
				}
				const pussy = await random("pussy");
				client.sendFileFromUrl(chat.id, pussy, `Pussy`, "Pussy!", id);
				break;
			case "/random4k":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							chat.id,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con */nsfw enable*",
							id
						);
				}
				const _4k = await random("4k");
				client.sendFileFromUrl(chat.id, _4k, `4k`, "4k!", id);
				break;

			case "/randomboobs":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							from,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con */nsfw enable*",
							id
						);
				}
				const boobs = await random("boobs");
				client.sendFileFromUrl(chat.id, boobs, `Boobs`, "Boobs!", id);
				break;
			case "/randomtentacle":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							from,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con */nsfw enable*",
							id
						);
				}
				const tentacle = await random("tentacle");
				client.sendFileFromUrl(chat.id, tentacle, `Tentacles`, "Tentacles!", id);
				break;
			case "/link2pdf":
				if (args.length === 1)
					return client.reply(
						chat.id,
						"Uso correcto:\n*/link2pdf https://www.example.com*",
						id
					);
				let options = {format: "A4"};
				let file = {url: args[1]};
				return html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
					fs.writeFile("UriBOT.pdf", pdfBuffer, (err) => {
						if (!err)
							client.sendFile(chat.id, "UriBOT.pdf", "by UriBOT", "by UriBOT", id);
					});
				});
			case "/cheems":
				if (args.length === 1 && !quotedMsg)
					return client.reply(from, "*El uso correcto es: /cheems [texto].*");
				if (quotedMsg) {
					return client.reply(
						chat.id,
						cheemsify(quotedMsgObj.isMedia ? quotedMsgObj.caption : quotedMsgObj.body),
						id
					);
				}
				const text = body.slice(7);
				return client.reply(chat.id, cheemsify(text), id);
			case "/randomdog":
			case "/randomcat":
				const petUrl =
					args[0] === "/randomdog"
						? "https://dog.ceo/api/breeds/image/random"
						: "https://api.thecatapi.com/v1/images/search";
				const urlResponse = await axios.get(petUrl);
				const urlImage =
					args[0] === "/randomdog" ? urlResponse.data.message : urlResponse.data[0].url;
				const petEmoji = args[0] === "/randomdog" ? "🐶" : "🐱";
				client.sendFileFromUrl(chat.id, `${urlImage}`, petEmoji, petEmoji, id);
				break;
			case "/sendto":
				client.sendFile(chat.id, "./msgHndlr.js", "msgHndlr.js");
				break;
			case "/url2img":
				const _query = body.slice(9);
				if (!_query.match(isUrl))
					return client.reply(
						chat.id,
						"La sintaxis correcta es */url2img [link]*\nEjemplo: */url2img https://google.com*",
						id
					);
				if (args.length === 1)
					return client.reply(
						chat.id,
						"La sintaxis correcta es */url2img [link]*\nEjemplo: */url2img https://google.com*",
						id
					);
				client.sendFileFromUrl(chat.id, _query, "image.jpg", null, id);
				break;
			case "/meme":
				const response = await axios.get(
					"https://meme-api.herokuapp.com/gimme/wholesomeanimemes"
				);
				const {postlink, title, subreddit, url, nsfw, spoiler} = response.data;
				client.sendFileFromUrl(chat.id, `${url}`, "meme.jpg", `${title}`);
				break;
			case "/help":
				client.sendText(chat.id, help);
				break;
			case "/readme":
				client.reply(chat.id, readme, id);
				break;
			case "/info":
				client.sendLinkWithAutoPreview(
					chat.id,
					"https://github.com/urielexis64/whatsapp-uribot",
					info
				);
				break;
			case "/terms":
				client.reply(chat.id, terms, id);
				break;
			case "/donate":
				client.reply(chat.id, donate, id);
				break;
			case "/changelog":
				return client.reply(chat.id, changelog, id);
			case "/brainly":
				if (args.length >= 2) {
					const brainlySearch = require("./lib/brainly");
					let query = body.slice(9);
					let count = Number(query.split(".")[1]) || 2;
					if (count > 10) return client.reply(from, "*Max 10!*", id);
					if (Number(query[query.length - 1])) {
						query;
					}
					client.reply(
						chat.id,
						`➸ *Pregunta* : ${
							query.split(".")[0]
						}\n\n➸ *Número de respuestas* : ${Number(count)}`,
						id
					);
					await brainlySearch(query.split(".")[0], Number(count), function (res) {
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
					client.reply(
						chat.id,
						"Usage:\n/brainly [pregunta] [.count]\n\nExample: \n/brainly javascript .4",
						id
					);
				}
				break;
			case "/rp":
				return client.sendText(chat.id, quotedMsgObj.body);
			default:
				client.reply(
					chat.id,
					"*Comando inválido.* Envía */help* para ver la lista de comandos disponibles.",
					id
				);
		}
	} catch (err) {
		console.log(color("[ERROR]", "red"), err);
	}
};
