const {create, Client} = require("@open-wa/wa-automate");
const uribot = require("./message");
const {options} = require("./tools");

const start = async (client = new Client()) => {
	await client.setPresence(false);

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
		uribot(client, message);
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

	client.onIncomingCall(async (call) => {
		await client
			.sendText(call.peerJid, "Lo siento, no puedo recibir llamadas. *¡Llamadas = bloquear!*")
			.then(() => client.contactBlock(call.peerJid));
	});
};

create(options(start))
	.then((client) => start(client))
	.catch((error) => console.log(error));
