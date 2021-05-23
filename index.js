const {create, Client} = require("@open-wa/wa-automate");
const welcome = require("./lib/welcome");
const msgHandler = require("./msgHandler");
const options = require("./options");

const start = async (client = new Client()) => {
	console.log("[SERVER] Server Started!");
	// Force it to keep the current session
	client.onStateChanged((state) => {
		console.log("[Client State]", state);
		if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
	});

	client.onAnyMessage((message) => {
		client.getAmountOfLoadedMessages().then((msg) => {
			if (msg >= 3000) {
				client.cutMsgCache();
			}
		});
		msgHandler(client, message);
	});

	/* client.onMessage(async (message) => {
		client.getAmountOfLoadedMessages().then((msg) => {
			if (msg >= 3000) {
				client.cutMsgCache();
			}
		});
		msgHandler(client, message);
	}); */

	client.onGlobalParticipantsChanged(async (heuh) => {
		await welcome(client, heuh);
		//left(client, heuh)
	});

	client.onAddedToGroup((chat) => {
		let totalMem = chat.groupMetadata.participants.length;
		if (totalMem < 2) {
			client
				.sendText(
					chat.id,
					`El número de miembros en este grupo es de ${totalMem}. Si desea invitar al bot, el número mínimo de miembros debe ser 2.`
				)
				.then(() => client.leaveGroup(chat.id))
				.then(() => client.deleteChat(chat.id));
		} else {
			client.sendText(
				chat.groupMetadata.id,
				`¡Hola! Me alegra ser parte de *${chat.contact.name}*`
			);
		}
	});
	client.ona;

	client.onIncomingCall(async (call) => {
		await client
			.sendText(call.peerJid, "Lo siento, no puedo recibir llamadas. *¡Llamadas = bloquear!*")
			.then(() => client.contactBlock(call.peerJid));
	});
};

create(options(true, start))
	.then((client) => start(client))
	.catch((error) => console.log(error));
