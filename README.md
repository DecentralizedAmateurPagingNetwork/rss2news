# RSS2News
Grabs the latest news from the DAPNET blog and adds them as rubric content into the DAPNET itself.

## Installation

### Requirements
Node.js & npm are required.  
Tested with Node.js v10.4.1+ only.

### Download
```bash
git clone https://github.com/DecentralizedAmateurPagingNetwork/rss2news.git
cd rss2news/

npm install
```

### Configuration
Create a `config.json` file using the template below and fill in the needed information.

```json
{
	"urls": {
		"rss": "https://hampager.de/dokuwiki/feed.php?ns=blog",
		"dapnet": "https://hampager.de/api/news"
	},
	"dapnet": {
		"rubricname": "dapnetnews",
		"username": "my-user",
		"password": "my-secret-password"
	}
}
```

### Cron
Add the command below to a cronjob to ensure, that the script will run regularly and update the content if needed.

## Run
```bash
node index.js
```

### Force Update
Ignores the `saved.json` file and updates the DAPNET news entries regardless.

```bash
node index.js --force
```
