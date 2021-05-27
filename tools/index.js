const options = (start) => {
	const options = {
		sessionId: "UriBOT",
		headless: true,
		qrTimeout: 0,
		authTimeout: 0,
		restartOnCrash: start,
		cacheEnabled: false,
		useChrome: true,
		killProcessOnBrowserClose: true,
		throwErrorOnTosBlock: false,
		chromiumArgs: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--aggressive-cache-discard",
			"--disable-cache",
			"--disable-application-cache",
			"--disable-offline-load-stale-cache",
			"--disk-cache-size=0",
		],
		//messagePreprocessor: "AUTO_DECRYPT_SAVE",
	};
	return options;
};

module.exports = {
	options,
};
