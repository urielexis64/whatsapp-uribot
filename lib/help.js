function help() {
	return `
🤖 *UriBOT* 🤖

=== Comandos para grupos ===

✔ */add 521xxxxx*
✔ */kick @tagmember*
✔ */promote @tagmember*
✔ */demote @tagadmin*
✔ */mentionAll*
✔ */adminList*
✔ */ownerGroup*
✔ */leave*
✔ */linkGroup*
✔ */delete [replyChatBot]*
✔ */kickAll*
✔ */NSFW [enable|disable]*
✔ */welcome [enable|disable]*

=== Comandos de descarga ===

✔ */ytmp3 [linkYt]*
✔ */ytmp4 [linkYt]*
✔ */tiktok [linkTiktok]*
✔ */fb [linkFb]* 
✔ */url2img [url]*
✔ */xvid [term]*
✔ */ig [linkIg]* (no sirve)

===  Comandos para Stickers ===

✔ */sticker*
✔ */stickerGif*

=== Comandos NSFW ===

✔ */random4k*
✔ */randomAss*
✔ */randomBoobs*
✔ */randomPussy*
✔ */randomHentai*
✔ */randomTentacle*
✔ */randomLoli*

=== Comandos de ayuda ===

✔ */terms*
✔ */readme*
✔ */help*
✔ */creator*
✔ */info*

===  Otros comandos === 

✔ */tts [country code] [text]*
✔ */igStalk [@username]
✔ */randomCat
✔ */randomDog
✔ */wiki [query]* (no sirve)
✔ */meme*
✔ */write*
✔ */cheems [text]*
✔ */getss*
✔ */join [linkGroup]*
✔ */wait*
✔ */donate*

Envíe el comando *!readme* para averiguar la función y cómo usar cada uno de los comandos.`;
}
exports.help = help();
function readme() {
	return `
*[linkYt]* Un enlace de un video de Youtube válido
Ejemplo: */ytmp3 https://youtu.be/1me1fHG-Umo*

*[linkYt]* Un enlace de un video de Youtube válido
Ejemplo: */ytmp4 https://youtu.be/1me1fHG-Umo*

*[linkIg]* Un enlace de Instagram válido
Ejemplo: */ig https://www.instagram.com/p/CFqRZTlluAi/?igshid=1gtxkbdqhnbbe*

*[linkFb]* Un enlace de Facebook válido
Ejemplo: */fb https://www.facebook.com/EpochTimesTrending/videos/310155606660409*

*[@username]* Nombre de usuario de Instagram válido
Ejemplo: */igStalk @urielsanchez64*

*[linkGroup]* Un enlace para ingresar a un grupo de WhatsApp válido
Ejemplo: */join https://chat.whatsapp.com/Bhhw77d5t2gjao8*`;
}
exports.readme = readme();
function info() {
	return `Este bot es una versión modificada de *Shinomiya Kaguya BOT (https://github.com/MhankBarBar/whatsapp-bot)*
Lenguajes de programación utilizados: Javascript/NodeJS
Código fuente del bot: https://github.com/urielexis64/whatsapp-bot
Propietario del bot: wa.me/5216672545434

Oh, sí, este bot es gratis, porque veo a mucha gente vendiendo bots como este, pero este es gratis.`;
}
exports.info = info();
function terms() {
	return `Términos y condiciones  🤖 *UriBOT* 🤖

1. El texto y su nombre de usuario de WhatsApp se almacenarán en el servidor siempre que el bot esté activo
2. Tus datos se eliminarán cuando el bot esté desconectado.
3. No almacenamos imágenes, videos, archivos, audios ni documentos que envíe.
4. Nunca le pediremos que proporcione información personal.
5. Si encuentra un error/bug, infórmelo directamente al propietario del bot ➡ +5216672545434
6. Cualquier cosa que pidas en este bot, ¡NO SEREMOS RESPONSABLES!

¡Gracias!`;
}
exports.terms = terms();
function donate() {
	return `https://www.paypal.com/paypalme/urielphic`;
}
exports.donate = donate();
