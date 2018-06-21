console.log("Starting RSS2News...");

const axios = require("axios");
const fs = require("fs");
const xml2js = require('xml2js').parseString;

const config = require("./config.json");

// Read news from RSS-feed
axios.get(config.urls.rss).then(response => {
	// success --> parse news
	xml2js(response.data, (error, result) => {
		if (error) {
			console.log("Error parsing feed: " + error);
			process.exit(1);
		}

		let news = [];
		let number = 1;
		result['rdf:RDF']['item'].forEach(item => {
			// skip media files
			if (item.link[0].includes('doku.php?image=')) return;

			news.push({
				number: number,
				title: (item.description[0].substring(0, item.description[0].indexOf('\n'))).substring(0, 80),
				date: new Date(item["dc:date"])
			});

			number++;
		});

		// Read saved file and compare with data from server
		if (fs.existsSync("./saved.json")) {
			const savedData = require("./saved.json");

			if (JSON.stringify(savedData) === JSON.stringify(news)) {
				// Nothing changed
				console.log("No changes. Exiting...");
				process.exit(0);
			}
		}

		// Save current version of news
		fs.writeFileSync("./saved.json", JSON.stringify(news), error => {
			if (error) {
				console.log("Error saving feed: " + error);
				process.exit(1);
			}
		});

		// Send news to DAPNET server
		console.log("Sending news to DAPNET...");
		news.forEach(newsItem => {
			axios({
				method: "post",
				url: config.urls.dapnet,
				headers: {
					Authorization: "Basic " + Buffer.from(config.dapnet.username + ":" + config.dapnet.password).toString("base64")
				},
				data: {
					text: newsItem.title,
					rubricName: "dapnet-news",
					number: newsItem.number
				}
			}).then(responseSend => {
				console.log("Added news-item \"" + newsItem.title + "\" to DAPNET.");
			}).catch(errorSend => {
				console.log("Error posting news to DAPNET: " + errorSend);
			});
		});
	});
}).catch(error => {
	console.log("Error downloading feed: " + error);
	process.exit(1);
});
