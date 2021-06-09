<p align="center">
<a href="#"><img width="200px" title="🤖 UriBOT 🤖" src="https://img.shields.io/badge/🤖 UriBOT 🤖-blue?colorA=darkblue&colorB=darkblue&style=for-the-badge"></a>
</p>

<p align="center">
<a href="https://github.com/urielexis64"><img title="Author" src="https://img.shields.io/badge/Autor-urielexis64-blue.svg?style=for-the-badge&logo=github"></a>
</p>

<p align=center>
    <a href="https://img.shields.io/badge/version-1.4.0-green">
        <img title="version" src="https://img.shields.io/badge/version-1.4.0-green">
    </a>
</p>

<p align="center">
<a href="https://github.com/urielexis64/followers"><img title="Followers" src="https://img.shields.io/github/followers/urielexis64?color=blue&style=flat-square"></a>
<a href="https://github.com/urielexis64/whatsapp-uribot/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/urielexis64/whatsapp-uribot?color=brown&style=flat-square"></a>
<a href="https://github.com/urielexis64/whatsapp-uribot/network/members"><img title="Forks" src="https://img.shields.io/github/forks/urielexis64/whatsapp-uribot?color=brown&style=flat-square"></a>
<a href="https://github.com/urielexis64/whatsapp-uribot/watchers"><img title="Watching" src="https://img.shields.io/github/watchers/urielexis64/whatsapp-uribot?label=Watchers&color=blue&style=flat-square"></a>
</p>

# Requirements

-   NodeJS
-   Git
-   FFMPEG (to use _ytmp3_ and _play_ commands)
-   Tesseract (to use _imgToTxt_ command)

# Installation 🔨

## 📝 Clone this project

```bash
> git clone https://github.com/urielexis64/whatsapp-uribot
> cd whatsapp-uribot
```

## 🧾 Installing Tesseract

-   Download the file [here](https://s.id/vftesseract).
-   Run downloaded file as Administrator.
-   Complete the installation.
-   Run Command prompt as Administrator
-   Run this command:

```cmd
> setx /m PATH "C:\Program Files\Tesseract-OCR;%PATH%"
```

It will give us a callback like `SUCCESS: specified value was saved.`

-   Now that you've installed Tesseract, verify that it's working by running this command to see version number:

```cmd
> tesseract -version
```

## 🛠️ Installing FFmpeg

-   Download one of the available versions of FFmpeg by clicking [this link](https://www.gyan.dev/ffmpeg/builds/).
-   Extract the file to `C:\` path.
-   Rename the extracted folder to `ffmpeg`.
-   Run Command Prompt as Administrator.
-   Run this command:

```cmd
> setx /m PATH "C:\ffmpeg\bin;%PATH%"
```

It will give us a callback like `SUCCESS: specified value was saved`.

-   Now that you've installed FFmpeg, verify that it's working by running this command to see version number:

```cmd
> ffmpeg -version
```

## 🛠️ Installing GraphicsMagik

-   Download graphicsmagik by clicking [this link](http://www.graphicsmagick.org/index.html/).
-   Run the .exe file you just downloaded.
-   Next, next, next...
-   Run this command (replacing the graphicsmagik version you downloaded):

```cmd
> setx /m PATH "C:\Program Files\graphicsmagick-[version];%PATH%"
```

It will give us a callback like `SUCCESS: specified value was saved`.

## 🔍 Install the dependencies:

Before running the below command, make sure you're in the project directory that you've just cloned.

```bash
> npm install
```

## Usage

Before running this script, first edit [this section](https://github.com/urielexis64/whatsapp-uribot/blob/master/config.json#L2) with your WhatsApp number, remember your WhatsApp number! Not a bot number, then

```bash
> npm start
```

## Features

| 🏷 Sticker Creator 🏷 |                  Feature                  |
| :-----------------: | :---------------------------------------: |
|         ✅          |          Send photo with caption          |
|         ✅          |               Reply a photo               |
|         ✅          |               Reply a video               |
|         ✅          |                Reply a GIF                |
|         ✅          | Reply a Sticker (change sticker metadata) |
|         ✅          |                 Image URL                 |
|         ✅          |          Send Video with caption          |
|         ✅          |           Send GIF with caption           |
|         ✅          |               Find Sticker                |
|         ✅          |                 Unsticker                 |

| ⬇ Downloader ⬇ |        Feature        |
| :------------: | :-------------------: |
|       ✅       |    YouTube mp3/mp4    |
|       ✅       |       Play mp3        |
|       ✅       |        Tiktok         |
|       ✅       |    Facebook Video     |
|       ✅       | Instagram Video/Image |
|       ✅       |     Google Image      |
|       ✅       |     Reddit Image      |
|       ✅       |     XVideos Video     |
|  Coming Soon   |       PH Video        |

| 📚 Educational 📚 |         Feature          |
| :---------------: | :----------------------: |
|        ✅         |      Google Search       |
|        ✅         |   Google Image Search    |
|        ✅         |      Brainly Search      |
|        ✅         |      Text to speech      |
|        ✅         |      Image to Text       |
|        ✅         |       Link to PDF        |
|        ✅         |        DOC to PDF        |
|        ✅         |       Image to PDF       |
|        ✅         |        Merge PDFs        |
|        ✅         |       URL to Image       |
|        ✅         | Resolve Math Expressions |
|        ✅         |        Translate         |
|    Coming Soon    |     Wikipedia Search     |

| 💬 Group Only 💬 |            Feature             |
| :--------------: | :----------------------------: |
|        ✅        |          Promote User          |
|        ✅        |          Demote User           |
|        ✅        |           Kick User            |
|        ✅        |            Add User            |
|        ✅        |        Mention All User        |
|        ✅        |         Get link group         |
|        ✅        |         Get admin list         |
|        ✅        |        Get owner group         |
|        ✅        |  Enable or Disable nsfw mood   |
|        ✅        | Enable or Disable welcome mood |
|        ✅        |         Mute or unmute         |
|        ✅        |         Join via link          |

| Owner Group Only |     Feature      |
| :--------------: | :--------------: |
|        ✅        | Kick All Members |
|        ✅        |   Leave Group    |

| Owner Bot Only |      Feature      |
| :------------: | :---------------: |
|       ✅       |     Broadcast     |
|       ✅       |  Get Screenshot   |
|       ✅       | Get blocked list  |
|       ✅       | Leave all groups  |
|       ✅       |    Clear chat     |
|       ✅       |  Clear all chats  |
|       ✅       | Clear suggestions |

| 👀 NSFW 👀 |    Feature     |
| :--------: | :------------: |
|     ✅     |    random4k    |
|     ✅     |   randomAnal   |
|     ✅     |   randomAss    |
|     ✅     |    randomBj    |
|     ✅     |  randomBoobs   |
|     ✅     |   randomCum    |
|     ✅     |   randomFeet   |
|     ✅     | randomGoneWild |
|     ✅     |  randomHentai  |
|     ✅     |  randomPussy   |
|     ✅     | randomTentacle |

| ❔ Help ❔ |        Feature         |
| :--------: | :--------------------: |
|     ✅     | All available commands |
|     ✅     |     Commands Usage     |
|     ✅     |  Terms and Conditions  |
|     ✅     |       Changelog        |
|     ✅     |    Creator Contact     |
|     ✅     |      General Info      |
|     ✅     |         Donate         |

| 💡 Shortcut 💡 |    Feature     |
| :------------: | :------------: |
|       ✅       | Repeat command |
|       ✅       |     Write      |
|       ✅       |    Test bot    |

| Other |        Feature        |
| :---: | :-------------------: |
|  ✅   |      Get lyrics       |
|  ✅   |    Cheemsify Text     |
|  ✅   |   Create suggestion   |
|  ✅   |   Print suggestions   |
|  ✅   | Get random cat images |
|  ✅   | Get random dog images |
|  And  |        More...        |

## 🧐 Troubleshooting

Make sure all the necessary dependencies are installed. https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

Fix Stuck on linux, install google chrome stable:

```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

## Special thanks to

-   [`open-wa/wa-automate-nodejs`](https://github.com/open-wa/wa-automate-nodejs)
-   [`ytdl-core`](https://github.com/fent/node-ytdl-core)

## License

MIT
