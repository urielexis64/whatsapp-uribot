const ytdl = require("ytdl-core");
const tiktok = require("tiktok-scraper");
const {decryptMedia} = require("@open-wa/wa-decrypt");
const fs = require("fs");
const axios = require("axios");
const moment = require("moment-timezone");
const get = require("got");
const fetch = require("node-fetch");
const color = require("./lib/color");
const {cheemsify, random, fb} = require("./lib/functions");
const {help, terms, info, donate, readme} = require("./lib/help");
const nsfw_ = JSON.parse(fs.readFileSync("./lib/NSFW.json"));
const welcome = JSON.parse(fs.readFileSync("./lib/welcome.json"));

moment.tz.setDefault("America/Mexico").locale("mx");

module.exports = msgHandler = async (client, message) => {
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

		if (!command.startsWith("!")) return;

		const msgs = (message) => {
			if (command.startsWith("!")) {
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
		const ownerNumber = ["526672545434@us.c", "526672545434"]; // replace with your whatsapp number
		const isOwner = ownerNumber.includes(sender.id);
		const isBlocked = blockNumber.includes(sender.id);
		const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false;
		const uaOverride =
			"WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36" +
			botNumber;
		const isUrl = new RegExp(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi
		);
		if (!isGroupMsg && command.startsWith("!"))
			console.log(
				"\x1b[1;31m~\x1b[1;37m>",
				"[\x1b[1;32mEXEC\x1b[1;37m]",
				time,
				color(msgs(command)),
				0,
				"from",
				color(pushname)
			);
		if (isGroupMsg && command.startsWith("!"))
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
		//if (!isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
		//if (isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
		if (isBlocked) return;
		//if (!isOwner) return
		switch (command) {
			case "!sticker":
			case "!stiker":
				if (isMedia && type === "image") {
					console.log("xd");
					const mediaData = await decryptMedia(message, uaOverride);
					const imageBase64 = `data:${mimetype};base64,${mediaData.toString("base64")}`;
					await client.sendImageAsSticker(from, imageBase64, stickersMetadata);
				} else if (quotedMsg && quotedMsg.type === "image") {
					const mediaData = await decryptMedia(quotedMsg, uaOverride);
					const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString(
						"base64"
					)}`;
					await client.sendImageAsSticker(from, imageBase64, stickersMetadata);
				} else if (args.length === 2) {
					const url = args[1];
					if (url.match(isUrl)) {
						await client
							.sendStickerfromUrl(from, url, {method: "get"}, stickersMetadata)
							.catch((err) => console.log("Caught exception: ", err));
					} else {
						client.reply(from, mess.error.Iv, id);
					}
				} else {
					client.reply(from, mess.error.St, id);
				}
				break;
			case "!stickergif":
			case "!stikergif":
			case "!sgif":
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
								from,
								filename,
								{
									crop: false,
									fps: 24,
									endTime: "00:00:09.0",
								},
								stickersMetadata
							);
						} catch (error) {
							client.reply(
								from,
								"El tamaño del video es muy extenso.\nMáximo peso para videos: *1.5 MB*",
								id
							);
						}
					} else
						client.reply(
							from,
							"[❗] El video/GIF debe durar menos de 10 segundos.",
							id
						);
				}
				break;
			case "!tts":
				if (args.length === 1) {
					return client.reply(
						from,
						"Enviar comando *!tts [es, en, jp, ar, id] [texto]*\nPor ejemplo *!tts es Hola, soy UriBot, mucho gusto.*",
						id
					);
				}

				const ttsId = require("node-gtts")("id");
				const ttsEn = require("node-gtts")("en");
				const ttsJp = require("node-gtts")("ja");
				const ttsAr = require("node-gtts")("ar");
				const ttsEs = require("node-gtts")("es");
				const dataText = body.slice(8);
				if (dataText === "") return client.reply(from, "Te faltó el texto.", id);
				if (dataText.length > 500)
					return client.reply(from, "¡El texto es demasiado largo!", id);
				var dataBhs = body.slice(5, 7);
				if (dataBhs == "id") {
					ttsId.save("./media/tts/resId.mp3", dataText, function () {
						client.sendPtt(from, "./media/tts/resId.mp3", id);
					});
				} else if (dataBhs == "en") {
					ttsEn.save("./media/tts/resEn.mp3", dataText, function () {
						client.sendPtt(from, "./media/tts/resEn.mp3", id);
					});
				} else if (dataBhs == "jp") {
					ttsJp.save("./media/tts/resJp.mp3", dataText, function () {
						client.sendPtt(from, "./media/tts/resJp.mp3", id);
					});
				} else if (dataBhs == "ar") {
					ttsAr.save("./media/tts/resAr.mp3", dataText, function () {
						client.sendPtt(from, "./media/tts/resAr.mp3", id);
					});
				} else if (dataBhs == "es") {
					ttsEs.save("./media/tts/resEs.mp3", dataText, function () {
						client.sendPtt(from, "./media/tts/resEs.mp3", id);
					});
				} else {
					client.reply(
						from,
						"Ingrese los datos del idioma: [es] para español, [en] para inglés, [jp] para japonés, [ar] para árabe y [id] para indonesio. ",
						id
					);
				}
				break;
			case "!ytmp3":
				client.reply(from, "[ESPERA] Estoy descargando el audio. Sé paciente.", id);
				const youtubeUrl = args[1];
				let videoInfo = await ytdl.getInfo(youtubeUrl);
				ytdl(youtubeUrl, {filter: "audioonly"})
					.pipe(fs2.createWriteStream("audio.mp3"))
					.on("finish", () => {
						client.sendFile(
							from,
							"audio.mp3",
							videoInfo.videoDetails.title,
							videoInfo.videoDetails.title,
							id
						);
					})
					.on("error", (error) => {
						client.reply(from, "Ocurrió un error: " + error, id);
					});
				break;
			case "!ytmp4":
				if (args.length === 1)
					return client.reply(from, "El uso correcto es: *!ytmp4 [youtubeLink]*", id);

				client.reply(from, "[ESPERA] Estoy descargando el video. Sé paciente.", id);
				ytdl(args[1])
					.pipe(fs2.createWriteStream("video.mp4"))
					.on("finish", () => {
						console.log("Video descargado!");
						client.sendFile(from, "video.mp4", "video.mp4", null, id);
					})
					.on("error", (err) => {
						client.reply(from, "Enlace inválido.", id);
					});
				break;
			case "!write":
				return client.sendText(from, body.slice(6));
			case "!wiki":
				break;
			case "!fb":
				try {
					if (args.length === 1) {
						return client.reply(from, "Uso correcto *!fb [linkFb]*", id);
					} else {
						client.reply(from, mess.wait, id);
						fb(args[1]).then((res) => {
							if (res.urlHd)
								return client.sendFileFromUrl(
									from,
									`${res.urlHd}`,
									"video.mp4",
									"Done!",
									id
								);
							else
								return client.sendFileFromUrl(
									from,
									`${res.url}`,
									"video.mp4",
									"Done!",
									id
								);
						});
					}
				} catch (error) {
					console.log(error);
				}
				break;
			case "!tiktok":
				if (args.length === 1)
					return client.reply(
						from,
						"El uso correcto es: *!tiktok [link]* \nEjemplo: !tiktok https://vm.tiktok.com/ZSJ5yT7Gp/",
						id
					);
				if (!args[1].includes("tiktok.com")) return client.reply(from, mess.error.Iv, id);
				client.reply(from, mess.wait, id);
				try {
					const videoData = await tiktok.getVideoMeta(args[1]);
					await tiktok.video(args[1], {
						download: true,
						filepath: __dirname + "\\tiktok",
					});
					fs.renameSync(`tiktok/${videoData.collector[0].id}.mp4`, `video.mp4`);
					client.sendFile(
						from,
						"tiktok/" + videoData.collector[0].id + ".mp4",
						`${videoData.collector[0].id}.mp4`,
						null,
						id
					);
				} catch (error) {
					client.sendText(from, `ERROR: *${error}*`);
				}

				break;
			case "!creator":
				client.sendContact(from, "5216672545434@c.us");
				break;
			case "!ig":
				break;
			case "!nsfw":
				if (!isGroupMsg)
					return client.reply(from, "Este comando solo está disponible en grupos.", id);
				if (!isGroupAdmins)
					return client.reply(from, "Solo los admins pueden usar este comando.", id);
				if (args.length === 1)
					return client.reply(
						from,
						"El uso correcto es ```!nsfw enable``` o ```!nsfw disable```",
						id
					);
				if (args[1].toLowerCase() === "enable") {
					nsfw_.push(chat.id);
					fs.writeFileSync("./lib/NSFW.json", JSON.stringify(nsfw_));
					client.reply(
						from,
						"¡El comando NSWF se activó con éxito en este grupo!\nEnvía *!nsfwMenu * para ver qué opciones tengo para ti. 😉",
						id
					);
				} else if (args[1].toLowerCase() === "disable") {
					nsfw_.splice(chat.id, 1);
					fs.writeFileSync("./lib/NSFW.json", JSON.stringify(nsfw_));
					client.reply(from, "NSFW Command berhasil di nonaktifkan di group ini!", id);
				} else {
					client.reply(
						from,
						"El uso correcto es ```!nsfw enable``` o ```!nsfw disable```",
						id
					);
				}
				break;
			case "!welcome":
				if (!isGroupMsg)
					return client.reply(from, "*Ese comando solo es permitido en grupos.*", id);
				if (!isGroupAdmins)
					return client.reply(
						from,
						"*Tienes que ser admin para ejecutar ese comando.*",
						id
					);
				if (args.length === 1)
					return client.reply(
						from,
						"*El uso correcto es ```!welcome enable``` o ```!welcome disable```*",
						id
					);
				if (args[1].toLowerCase() === "enable") {
					welcome.push(chat.id);
					fs.writeFileSync("./lib/welcome.json", JSON.stringify(welcome));
					client.reply(from, "Muy bien, ya activé el modo *Bienvenida*", id);
				} else if (args[1].toLowerCase() === "disable") {
					welcome.splice(chat.id, 1);
					fs.writeFileSync("./lib/welcome.json", JSON.stringify(welcome));
					client.reply(from, "Muy bien, ya desactivé el modo *Bienvenida*", id);
				} else {
					client.reply(
						from,
						"*El uso correcto es ```!nsfw enable``` o ```!nsfw disable```*",
						id
					);
				}
				break;
			case "!nsfwmenu":
				if (!isNsfw) return;
				client.reply(
					from,
					"*Comandos NSFW disponibles*\n\n1. !randomHentai 👧 \n2. !randomBoobs 🍈🍈\n3. !randomPussy 🥟\n4. !randomAss 🍑\n5. !random4k 📺\n6. !randomTentacle 🦑",
					id
				);
				break;
			case "!igstalk":
				break;
			case "!wait":
				if ((isMedia && type === "image") || (quotedMsg && quotedMsg.type === "image")) {
					if (isMedia) {
						var mediaData = await decryptMedia(message, uaOverride);
					} else {
						var mediaData = await decryptMedia(quotedMsg, uaOverride);
					}
					const imgBS4 = `data:${mimetype};base64,${mediaData.toString("base64")}`;
					client.reply(from, "Searching....", id);
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
							client.sendFileFromUrl(from, video, "nimek.mp4", teks, id).catch(() => {
								client.reply(from, teks, id);
							});
						})
						.catch(() => {
							client.reply(from, "Error !", id);
						});
				} else {
					client.sendFile(
						from,
						"./media/img/tutod.jpg",
						"Tutor.jpg",
						"Neh contoh mhank!",
						id
					);
				}
				break;
			case "!linkgroup":
				if (!isBotGroupAdmins)
					return client.reply(
						from,
						"Perintah ini hanya bisa di gunakan ketika bot menjadi admin",
						id
					);
				if (isGroupMsg) {
					const inviteLink = await client.getGroupInviteLink(groupId);
					client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`);
				} else {
					client.reply(from, "Perintah ini hanya bisa di gunakan dalam group!", id);
				}
				break;
			case "!bc":
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
			case "!adminlist":
				if (!isGroupMsg)
					return client.reply(from, "¡Este comando solo se puede usar en grupos!", id);
				let mimin = "";
				for (let admon of groupAdmins) {
					mimin += `➸ @${admon.replace(/@c.us/g, "")}\n`;
				}
				await client.sendTextWithMentions(from, mimin);
				break;
			case "!ownergroup":
				if (!isGroupMsg)
					return client.reply(from, "¡Este comando solo se puede usar en grupos!", id);
				const Owner_ = chat.groupMetadata.owner;
				await client.sendTextWithMentions(from, `Propietario del grupo: @${Owner_}`);
				break;
			case "!mentionall":
				if (!isGroupMsg)
					return client.reply(from, "¡Este comando solo se puede usar en grupos!", id);
				if (!isGroupAdmins)
					return client.reply(
						from,
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
				await client.sendTextWithMentions(from, hehe);
				break;
			case "!kickall":
				if (!isGroupMsg)
					return client.reply(from, "¡Este comando solo se puede usar en grupos!", id);
				const isGroupOwner = sender.id === chat.groupMetadata.owner;
				if (!isGroupOwner)
					return client.reply(
						from,
						"Este comando solo puede ser utilizado por el propietario del grupo.",
						id
					);
				if (!isBotGroupAdmins)
					return client.reply(
						from,
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
				client.reply(from, "Listo! Ya expulsé a todos los miembros del grupo.", id);
				break;
			case "!leaveall":
				if (!isOwner) return client.reply(from, "Perintah ini hanya untuk Owner bot", id);
				const allChats = await client.getAllChatIds();
				const allGroups = await client.getAllGroups();
				for (let gclist of allGroups) {
					await client.sendText(
						gclist.contact.id,
						`Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`
					);
					await client.leaveGroup(gclist.contact.id);
				}
				client.reply(from, "Succes leave all group!", id);
				break;
			case "!clearall":
				if (!isOwner)
					return client.reply(
						from,
						"Este comando es solo para el propietario del bot.",
						id
					);
				const allChatz = await client.getAllChats();
				for (let dchat of allChatz) {
					await client.deleteChat(dchat.id);
				}
				client.reply(from, "Succes clear all chat!", id);
				break;
			case "!add":
				const orang = args[1];
				if (!isGroupMsg)
					return client.reply(from, "Fitur ini hanya bisa di gunakan dalam group", id);
				if (args.length === 1)
					return client.reply(
						from,
						"Untuk menggunakan fitur ini, kirim perintah *!add* 628xxxxx",
						id
					);
				if (!isGroupAdmins)
					return client.reply(
						from,
						"Perintah ini hanya bisa di gunakan oleh admin group",
						id
					);
				if (!isBotGroupAdmins)
					return client.reply(
						from,
						"Perintah ini hanya bisa di gunakan ketika bot menjadi admin",
						id
					);
				try {
					await client.addParticipant(from, `${orang}@c.us`);
				} catch {
					client.reply(from, mess.error.Ad, id);
				}
				break;
			case "!kick":
				if (!isGroupMsg)
					return client.reply(from, "Esta función solo se puede utilizar en grupos.", id);
				if (!isGroupAdmins)
					return client.reply(
						from,
						"Este comando solo puede ser utilizado por administradores del grupo.",
						id
					);
				if (!isBotGroupAdmins)
					return client.reply(
						from,
						"Este comando solo se puede usar cuando el bot se convierte en administrador.",
						id
					);
				if (mentionedJidList.length === 0)
					return client.reply(
						from,
						"Para usar este comando, envíe el comando *!kick* @tagmember",
						id
					);
				await client.sendText(from, `Miembro expulsado:\n${mentionedJidList.join("\n")}`);
				for (let i = 0; i < mentionedJidList.length; i++) {
					if (groupAdmins.includes(mentionedJidList[i]))
						return client.reply(from, mess.error.Ki, id);
					await client.removeParticipant(groupId, mentionedJidList[i]);
				}
				break;
			case "!leave":
				if (!isGroupMsg)
					return client.reply(from, "Perintah ini hanya bisa di gunakan dalam group", id);
				if (!isGroupAdmins)
					return client.reply(
						from,
						"Perintah ini hanya bisa di gunakan oleh admin group",
						id
					);
				await client.sendText(from, "Sayonara").then(() => client.leaveGroup(groupId));
				break;
			case "!promote":
				if (!isGroupMsg)
					return client.reply(from, "Fitur ini hanya bisa di gunakan dalam group", id);
				if (!isGroupAdmins)
					return client.reply(
						from,
						"Fitur ini hanya bisa di gunakan oleh admin group",
						id
					);
				if (!isBotGroupAdmins)
					return client.reply(
						from,
						"Fitur ini hanya bisa di gunakan ketika bot menjadi admin",
						id
					);
				if (mentionedJidList.length === 0)
					return client.reply(
						from,
						"Untuk menggunakan fitur ini, kirim perintah *!promote* @tagmember",
						id
					);
				if (mentionedJidList.length >= 2)
					return client.reply(
						from,
						"Maaf, perintah ini hanya dapat digunakan kepada 1 user.",
						id
					);
				if (groupAdmins.includes(mentionedJidList[0]))
					return client.reply(from, "Maaf, user tersebut sudah menjadi admin.", id);
				await client.promoteParticipant(groupId, mentionedJidList[0]);
				await client.sendTextWithMentions(
					from,
					`Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`
				);
				break;
			case "!demote":
				if (!isGroupMsg)
					return client.reply(from, "Fitur ini hanya bisa di gunakan dalam group", id);
				if (!isGroupAdmins)
					return client.reply(
						from,
						"Fitur ini hanya bisa di gunakan oleh admin group",
						id
					);
				if (!isBotGroupAdmins)
					return client.reply(
						from,
						"Fitur ini hanya bisa di gunakan ketika bot menjadi admin",
						id
					);
				if (mentionedJidList.length === 0)
					return client.reply(
						from,
						"Untuk menggunakan fitur ini, kirim perintah *!demote* @tagadmin",
						id
					);
				if (mentionedJidList.length >= 2)
					return client.reply(
						from,
						"Maaf, perintah ini hanya dapat digunakan kepada 1 orang.",
						id
					);
				if (!groupAdmins.includes(mentionedJidList[0]))
					return client.reply(from, "Maaf, user tersebut tidak menjadi admin.", id);
				await client.demoteParticipant(groupId, mentionedJidList[0]);
				await client.sendTextWithMentions(
					from,
					`Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`
				);
				break;
			case "!join":
				if (args.length < 2)
					return client.reply(
						from,
						"Kirim perintah *!join linkgroup key*\n\nEx:\n!join https://chat.whatsapp.com/blablablablablabla abcde\nuntuk key kamu bisa mendapatkannya hanya dengan donasi 5k",
						id
					);
				const link = args[1];
				const key = args[2];
				const tGr = await client.getAllGroups();
				const minMem = 30;
				const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi);
				if (key !== "lGjYt4zA5SQlTDx9z9Ca")
					return client.reply(
						from,
						"*key* salah! silahkan chat owner bot unruk mendapatkan key yang valid",
						id
					);
				const check = await client.inviteInfo(link);
				if (!isLink) return client.reply(from, "Ini link? 👊🤬", id);
				if (tGr.length > 15)
					return client.reply(from, "Maaf jumlah group sudah maksimal!", id);
				if (check.size < minMem)
					return client.reply(
						from,
						"Member group tidak melebihi 30, bot tidak bisa masuk",
						id
					);
				if (check.status === 200) {
					await client
						.joinGroupViaLink(link)
						.then(() => client.reply(from, "Bot akan segera masuk!"));
				} else {
					client.reply(from, "Link group tidak valid!", id);
				}
				break;
			case "!delete":
				/* if (!isGroupMsg)
					return client.reply(from, "Fitur ini hanya bisa di gunakan dalam group", id);
				if (!isGroupAdmins)
					return client.reply(
						from,
						"Fitur ini hanya bisa di gunakan oleh admin group",
						id
					);
				if (!quotedMsg)
					return client.reply(
						from,
						"Salah!!, kirim perintah *!delete [tagpesanbot]*",
						id
					);
				if (!quotedMsgObj.fromMe)
					return client.reply(
						from,
						"Salah!!, Bot tidak bisa mengahpus chat user lain!",
						id
					); */
				client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
				break;
			case "!getss":
				const sesPic = await client.getSnapshot();
				client.sendFile(from, sesPic, "session.png", "Screenshot", id);
				break;
			case "!listblock":
				let hih = `Lista de números bloqueados\nTotal : ${blockNumber.length}\n`;
				for (let i of blockNumber) {
					hih += `➸ @${i.replace(/@c.us/g, "")}\n`;
				}
				client.sendTextWithMentions(from, hih, id);
				break;
			case "!randomloli":
				const loli = await get.get(`http://api.nekos.fun:8080/api/lewd`).json();
				client.sendFileFromUrl(from, loli.image, "loli.jpeg", "Loli!", id);
				break;
			case "!randomhentai":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							from,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con ```!nsfw enable```",
							id
						);
				}
				const hentai = await random("hentai");
				client.sendFileFromUrl(from, hentai, `Hentai${ext}`, "Hentai!", id);
				break;
			case "!randomass":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							from,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con ```!nsfw enable```",
							id
						);
				}
				const ass = await random("ass");
				client.sendFileFromUrl(from, ass, `Ass`, "Ass!", id);
				break;
			case "!randompussy":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							from,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con ```!nsfw enable```",
							id
						);
				}
				const pussy = await random("pussy");
				client.sendFileFromUrl(from, pussy, `Pussy`, "Pussy!", id);
				break;
			case "!random4k":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							from,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con ```!nsfw enable```",
							id
						);
				}
				const _4k = await random("4k");
				client.sendFileFromUrl(from, _4k, `4k`, "4k!", id);
				break;

			case "!randomboobs":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							from,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con ```!nsfw enable```",
							id
						);
				}
				const boobs = await random("boobs");
				client.sendFileFromUrl(from, boobs, `Boobs`, "Boobs!", id);
				break;
			case "!randomtentacle":
				if (isGroupMsg) {
					if (!isNsfw)
						return client.reply(
							from,
							"El comando *NSFW* no está activado en este grupo.\nActívalo con ```!nsfw enable```",
							id
						);
				}
				const tentacle = await random("tentacle");
				client.sendFileFromUrl(from, tentacle, `Tentacles`, "Tentacles!", id);
				break;
			case "!cheems":
				if (args.length === 1)
					return client.reply(from, "*El uso correcto es: !cheems [texto].*");
				const text = body.slice(7);
				return client.reply(from, cheemsify(text), id);
			case "!cat":
				q2 = Math.floor(Math.random() * 900) + 300;
				q3 = Math.floor(Math.random() * 900) + 300;
				client.sendFileFromUrl(
					from,
					"http://placekitten.com/" + q3 + "/" + q2,
					"neko.png",
					"Neko "
				);
				break;
			case "!sendto":
				client.sendFile(from, "./msgHndlr.js", "msgHndlr.js");
				break;
			case "!url2img":
				const _query = body.slice(9);
				if (!_query.match(isUrl))
					return client.reply(
						from,
						"La sintaxis correcta es *!url2img [link]*\nEjemplo: *!url2img https://google.com*",
						id
					);
				if (args.length === 1)
					return client.reply(
						from,
						"La sintaxis correcta es *!url2img [link]*\nEjemplo: *!url2img https://google.com*",
						id
					);
				client.sendFileFromUrl(from, _query, "image.jpg", null, id);
				break;
			case "!meme":
				const response = await axios.get(
					"https://meme-api.herokuapp.com/gimme/wholesomeanimemes"
				);
				const {postlink, title, subreddit, url, nsfw, spoiler} = response.data;
				client.sendFileFromUrl(from, `${url}`, "meme.jpg", `${title}`);
				break;
			case "!help":
				client.sendText(from, help);
				break;
			case "!readme":
				client.reply(from, readme, id);
				break;
			case "!info":
				client.sendLinkWithAutoPreview(
					from,
					"https://github.com/urielexis64/whatsapp-uribot",
					info
				);
				break;
			case "!terms":
				client.reply(from, terms, id);
				break;
			case "!donate":
				client.reply(from, donate, id);
				break;
			case "!brainly":
				if (args.length >= 2) {
					const brainlySearch = require("./lib/brainly");
					let query = body.slice(9);
					let count = Number(query.split(".")[1]) || 2;
					if (count > 10) return client.reply(from, "Max 10!", id);
					if (Number(query[query.length - 1])) {
						query;
					}
					client.reply(
						from,
						`➸ *Pregunta* : ${
							query.split(".")[0]
						}\n\n➸ *Número de respuestas* : ${Number(count)}`,
						id
					);
					await brainlySearch(query.split(".")[0], Number(count), function (res) {
						res.forEach((opt) => {
							if (opt.answer.answerImage.length == 0) {
								client.reply(
									from,
									`➸ *Pregunta* : ${opt.questionTitle}\n\n➸ *Respuesta* : ${opt.answer.answerTitle}\n`,
									id
								);
							} else {
								client.reply(
									from,
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
						from,
						"Usage :\n!brainly [pertanyaan] [.jumlah]\n\nEx : \n!brainly NKRI .2",
						id
					);
				}
				break;
			default:
				client.reply(
					from,
					"*Comando inválido.* Envía *!help* para ver la lista de comandos disponibles.",
					id
				);
		}
	} catch (err) {
		console.log(color("[ERROR]", "red"), err);
		//client.kill().then(a => console.log(a))
	}
};
