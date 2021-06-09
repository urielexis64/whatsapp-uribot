const fs = require("fs");
const {prefix} = require(`../../../config.json`);

exports.wait = "*Espere un momento...*";
exports.waitUntilNextCall = "*Espera 5 segundos antes de volver a llamar al bot.*";
exports.groupOnly = `*Este comando solo puede ser usado en grupos*`;
exports.tooLongText = "*¡El texto es demasiado largo!*";
exports.maxVideoSeconds = "*El video/GIF debe durar máximo 5 segundos.*";
exports.sticketNotFound = "*Sticker no encontrado. Prueba con algo distinto.*";
exports.wrongFormat = `¡Formato incorrecto! Revisa el manual de uso enviando el comando *${prefix}help*`;
exports.online = "*En linea. ✅*";
exports.onlyBotAdmin =
	"*Este comando solo se puede usar cuando el bot se convierte en administrador.*";
exports.onlyBotOwner = "*Este comando solo puede usarlo el propietario del bot.*";
exports.onlyGroups = "*¡Este comando solo se puede usar en grupos!*";
exports.onlyAdmins = "*Este comando solo puede ser utilizado por los administradores del grupo.*";
exports.onlyGroupOwner = "*Este comando solo puede ser utilizado por el propietario del grupo.*";
exports.invalidLink = `*Enlace inválido*.`;
exports.menuNsfw =
	"*Comandos NSFW disponibles*\n\n1. /randomHentai 👧 \n2. /randomBoobs 🍈🍈\n3. /randomPussy 🥟\n4. /randomAss 🍑\n5. /random4k 📺\n6. /randomFeet 👣\n7. /randomCum 💦\n8. /randomBj 😮\n9. /randomAnal 🕳\n10. /randomGoneWild 👩‍🦰\n11. /randomTentacle 🦑";
exports.nsfwStatus = `El modo *NSFW* no está activado en este grupo.\nActívalo con *${prefix}nsfw enable*`;
exports.nsfwEnabled = `¡El modo NSWF se activó con éxito en este grupo!\nEnvía *${prefix}nsfwMenu* para ver qué opciones tengo para ti. 😉`;
exports.nsfwDisabled = "*¡El modo NSFW se desactivó con éxito en este grupo!*";
exports.welcomeEnabled = "Modo *Welcome* activado";
exports.welcomeDisabled = "Modo *Welcome* desactivado";
exports.muted = "Modo *silencio* activado";
exports.unmuted = "Modo *silencio* desactivado";
exports.addContactError = "*[❗] No se pudo agregar el contacto.*";
exports.cantKickAdmin = "*[❗] ¡El bot no puede expulsar a un administrador!*";
exports.isAlreadyAdmin = "*El usuario ya es administrador.*";
exports.languagesData =
	"Ingrese los datos del idioma: *[es]* para español, *[en]* para inglés, *[jp]* para japonés, *[ar]* para árabe y *[id]* para indonesio.";
exports.invalidCommand = `*Comando inválido.* Envía *${prefix}help* para ver la lista de comandos disponibles.`;
exports.invalidExtension = `*Extensión inválida.*`;
exports.translating = `*Traduciendo...*`;
exports.mergingPDF = `*Merging PDFs...*`;
exports.bye = "*Adiós. 👋*";
exports.savedSuggestion = "*Sugerecia guardada. 👍*";
exports.clearedSuggestions = "*Sugerecias eliminadas. 🗑*";
exports.availableQuoteTags =
	"*Available tags*\n\n• business\n• faith\n• famous-quotes\n• education\n• friendship\n• future\n• happiness\n• history\n• inspirational\n• life\n• love\n• nature\n• politics\n• proverb\n• religion\n• science\n• success\n• technology\n• wisdom";
/* ================================ FUNCTIONS ===================================== */
exports.stats = () => {
	const stats = JSON.parse(fs.readFileSync("database/bot/stats.json"));
	return `*Estadísticas de 🤖 UriBOT 🤖*\n\n*Versión del bot:* ${stats.version}\n*Fecha de inicio:* ${stats.startDate}\n*Total de llamadas al bot:* ${stats.totalCalls}\n*Archivos enviados:* ${stats.filesSent}\n*Stickers creados:* ${stats.stickersCreated}`;
};
exports.maxCount = (count) => `*Máximo ${count}*.`;
exports.minCount = (count) => `*Mínimo ${count}*.`;
exports.downloading = (value) => `*Descargando ${value}...*`;
exports.making = (value) => `*Creando ${value}...*`;
exports.searching = (value) => `*Buscando ${value}...*`;
exports.converting = (from, to) => `*Convirtiendo de ${from} a ${to}...*`;
exports.invalidLanguage = (lan, availableLanguages) =>
	`Idioma *${lan}* inválido.\n\nIdiomas disponibles:\n${availableLanguages
		.map((lan) => `*• ${lan}*`)
		.join("\n")}`;
exports.redditPost = (data) =>
	`*Title:* ${data.title}\n*Post link:* ${data.postLink}\n*Subreddit:* ${data.subreddit}\n*Up Votes:* ${data.ups}\n*Original URL:* ${data.url}`;
exports.googleFormat = (data) =>
	`\n\n*Title:* ${data.title}\n*Desc:* ${data.snippet}\n*Link:* ${data.link}`;
exports.newsFormat = (news) =>
	`*Título:* ${news.title}\n*Descripción:* ${news.description}\n*Fecha:* ${news.publishedAt}\n*Contenido:* ${news.content}\n*URL:* ${news.url}`;
exports.quoteFormat = (quote) => `*_“${quote.content}”_*\n\n${quote.author}`;
exports.igProfile = (data) =>
	`*Nombre:* ${data.name || "_No hay nombre_"}\n\n*Biografía:*\n${
		data.bio || "_No hay biografía_"
	}\n\n*Seguidores:*\n${data.followers}\n\n*Siguiendo:*\n${data.following}\n\n*Posts:*\n${
		data.posts
	}`;
exports.generalError = (error) => `*Error:* ${error}`;
exports.printSuggestions = (suggs) => {
	let suggestions = "";
	suggs.map((sug) => {
		suggestions += `*Sugerido por:* ${sug.username + " (" + sug.uid + ")"}\n*Fecha:* ${
			sug.date
		}\n*Descripción:* ${sug.desc}\n\n`;
	});
	return suggestions.trimEnd() || "*No hay sugerencias.* 🤔";
};

exports.changelog = `*📌 CHANGELOG 📌*

v1.5.0   |   fecha
*[NEW]* /randomNews
*[NEW]* /redditw
*[NEW]* /randomQuote
*[NEW]* /memeCreator
*[REMOVED]* /xvid
*[ADDED]* More translated messages.
*[FIX]* NSFW command not working properly.
*[FIX]* WELCOME command not working properly.
*[FIX]* Some grammar mistakes.

v1.4.0   |   01/06/2021
*[NEW]* /math
*[NEW]* /imgToText
*[NEW]* /doc2pdf
*[NEW]* /img2pdf
*[NEW]* /mergepdfs
*[NEW]* /sug
*[ADDED]* More translated messages.
*[IMPROVED]* igStalk now returns last posts if not private account.
*[IMPROVED]* /ytmp3 returns a native audio instead a document file audio.
*[REMOVED]* /pv2 (now use /play that returns a native WhatsApp audio)
*[FIX]* Some audios not playing when using /play command.
*[FIX]* Not showing error messages when misusing some commands.
*[FIX]* Can't download videos/audios due to age restricted. (ytmp3, ytmp4, play)
*[FIX]* Error when downloading videos/audios due to strange symbols on the title. (/\\:*?"<>|)

v1.3.0   |   28/05/2021

*[NUEVO]* /mute
*[NUEVO]* /unmute
*[NUEVO]* /reddit
*[NUEVO]* /ig
*[NUEVO]* /google
*[NUEVO]* /googleImg
*[NUEVO]* /findSticker
*[NUEVO]* /unsticker
*[NUEVO]* /link2pdf
*[NUEVO]* /randomAnal
*[NUEVO]* /randomFeet
*[NUEVO]* /randomBj
*[NUEVO]* /randomCum
*[NUEVO]* /randomGoneWild
*[NUEVO]* /stats
*[NUEVO]* /rp
*[CAMBIO]* /commands (/readme before)
*[MEJORA]* Help documentation
*[MEJORA]* Answers text
*[OTRO]* Reformated and cleaner code
*[OTRO]* Fix some bugs

v1.2.0   |   25/05/2021

*[CAMBIO]* Command prefix changed from ! to /
*[CAMBIO]* /randomCat (cat before)
*[NUEVO]* /randomDog
*[NUEVO]* /xvid
*[NUEVO]* /test
*[NUEVO]* /changelog
*[MEJORA]* /ytmp4 command
*[NUEVO]* /igStalk
*[OTRO]* Translated some command answers
*[OTRO]* Fix some bugs`;
