const brainly = require("brainly-scraper-v2");

module.exports = brainlySearch = (question, answers, cb) => {
	brainly(question.toString(), Number(answers), "es")
		.then((res) => {
			let brainlyResult = [];
			res.data.forEach((question) => {
				let opt = {
					questionTitle: question.pertanyaan,
					questionImage: question.questionMedia,
				};
				question.jawaban.forEach((answer) => {
					opt.answer = {
						answerTitle: answer.text,
						answerImage: answer.media,
					};
				});
				brainlyResult.push(opt);
			});
			return brainlyResult;
		})
		.then((x) => {
			cb(x);
		})
		.catch((err) => {
			console.log(err.error);
		});
};
