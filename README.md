<p align="center">
<a href="#"><img width="200px" title="๐ค UriBOT ๐ค" src="https://img.shields.io/badge/๐ค UriBOT ๐ค-blue?colorA=darkblue&colorB=darkblue&style=for-the-badge"></a>
</p>

<p align="center">
<a href="https://github.com/urielexis64"><img title="Author" src="https://img.shields.io/badge/Autor-urielexis64-blue.svg?style=for-the-badge&logo=github"></a>
</p>

<p align=center>
    <a href="https://img.shields.io/badge/version-1.5.5-green">
        <img title="version" src="https://img.shields.io/badge/version-1.5.5-green">
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
-   GraphicsMagik (to use _memecreator_ command)

# Installation ๐จ

## ๐ Clone this project

```bash
> git clone https://github.com/urielexis64/whatsapp-uribot
> cd whatsapp-uribot
```

## ๐งพ Installing Tesseract

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

## ๐?๏ธ Installing FFmpeg

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

## ๐?๏ธ Installing GraphicsMagik

-   Download graphicsmagik by clicking [this link](http://www.graphicsmagick.org/index.html/).
-   Run the .exe file you just downloaded.
-   Next, next, next...
-   Run this command (replacing the graphicsmagik version you downloaded):

```cmd
> setx /m PATH "C:\Program Files\graphicsmagick-[version];%PATH%"
```

It will give us a callback like `SUCCESS: specified value was saved`.

## ๐ Install the dependencies:

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

| ๐ท Sticker Creator ๐ท |                  Feature                  |
| :-----------------: | :---------------------------------------: |
|         โ          |          Send photo with caption          |
|         โ          |               Reply a photo               |
|         โ          |               Reply a video               |
|         โ          |                Reply a GIF                |
|         โ          | Reply a Sticker (change sticker metadata) |
|         โ          |                 Image URL                 |
|         โ          |          Send Video with caption          |
|         โ          |           Send GIF with caption           |
|         โ          |               Find Sticker                |
|         โ          |                 Unsticker                 |

| โฌ Downloader โฌ |        Feature        |
| :------------: | :-------------------: |
|       โ       |    YouTube mp3/mp4    |
|       โ       |       Play mp3        |
|       โ       |        Tiktok         |
|       โ       |    Facebook Video     |
|       โ       | Instagram Video/Image |
|       โ       |     Google Image      |
|       โ       |     Reddit Image      |
|       โ       |       PH Video        |

| ๐ Educational ๐ |         Feature          |
| :---------------: | :----------------------: |
|        โ         |      Google Search       |
|        โ         |   Google Image Search    |
|        โ         |      Brainly Search      |
|        โ         |      Text to speech      |
|        โ         |      Image to Text       |
|        โ         |       Link to PDF        |
|        โ         | Take Webpage Screenshot  |
|        โ         |     Generate QR Code     |
|        โ         |      Decode QR Code      |
|        โ         |        DOC to PDF        |
|        โ         |       Image to PDF       |
|        โ         |        Merge PDFs        |
|        โ         |       URL to Image       |
|        โ         | Resolve Math Expressions |
|        โ         |        Translate         |
|    Coming Soon    |     Wikipedia Search     |

| ๐ฌ Group Only ๐ฌ |            Feature             |
| :--------------: | :----------------------------: |
|        โ        |          Promote User          |
|        โ        |          Demote User           |
|        โ        |           Kick User            |
|        โ        |            Add User            |
|        โ        |        Mention All User        |
|        โ        |         Get link group         |
|        โ        |         Get admin list         |
|        โ        |        Get owner group         |
|        โ        |  Enable or Disable nsfw mood   |
|        โ        | Enable or Disable welcome mood |
|        โ        |         Mute or unmute         |
|        โ        |         Join via link          |

| Owner Group Only |     Feature      |
| :--------------: | :--------------: |
|        โ        | Kick All Members |
|        โ        |   Leave Group    |

| Owner Bot Only |      Feature      |
| :------------: | :---------------: |
|       โ       |     Broadcast     |
|       โ       |  Get Screenshot   |
|       โ       | Get blocked list  |
|       โ       | Leave all groups  |
|       โ       |    Clear chat     |
|       โ       |  Clear all chats  |
|       โ       | Clear suggestions |

| ๐ NSFW ๐ |    Feature     |
| :--------: | :------------: |
|     โ     |    random4k    |
|     โ     |   randomAnal   |
|     โ     |   randomAss    |
|     โ     |    randomBj    |
|     โ     |  randomBoobs   |
|     โ     |   randomCum    |
|     โ     |   randomFeet   |
|     โ     | randomGoneWild |
|     โ     |  randomHentai  |
|     โ     |  randomPussy   |
|     โ     | randomTentacle |

| โ Help โ |        Feature         |
| :--------: | :--------------------: |
|     โ     | All available commands |
|     โ     |     Commands Usage     |
|     โ     |  Terms and Conditions  |
|     โ     |       Changelog        |
|     โ     |    Creator Contact     |
|     โ     |      General Info      |
|     โ     |         Donate         |

| ๐ก Shortcut ๐ก |    Feature     |
| :------------: | :------------: |
|       โ       | Repeat command |
|       โ       |     Write      |
|       โ       |    Test bot    |

| Other |        Feature        |
| :---: | :-------------------: |
|  โ   |      Get lyrics       |
|  โ   |    Link Shortener     |
|  โ   |    Cheemsify Text     |
|  โ   |   Create suggestion   |
|  โ   |   Print suggestions   |
|  โ   | Get random cat images |
|  โ   | Get random dog images |
|  And  |        More...        |

## ๐ง Troubleshooting

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
