# Channel website (working brand: Velus)

A static site for GitHub Pages: plain HTML, one CSS file, one small JS file, images. There is no build step and nothing to install. Google Fonts (Fraunces + Poppins) is the only external request, and there are no trackers or cookies.

## Structure

```
index.html            channel home: banner hero, film cards, "How we make these"
black-hole.html       sources and notes for "What If You Fell Into a Black Hole?" (ember/black theme)
influenced.html       sources and notes for "If They Are the Influencers, You Are the Influenced" (warm vs cold theme)
isolated-worlds.html  sources and notes for "Small Worlds Make Strange Things" (violet/pink/teal theme; its URLs are listed in tools/sources_isolated_worlds.txt)
assets/css/site.css   all styles; page themes are body classes: .theme-home, .theme-bh, .theme-inf, .theme-sal, .theme-iw
assets/js/site.js     brand name, YouTube embed, chapter links
assets/img/           banner, avatar, thumbnail and film frames (JPEG, max 1600 px wide)
tools/check.py        checks links, images, HTML and sources (see below)
brief/                the original brief (not part of the site; delete before publishing if you like)
```

## Change the brand name

The name lives in one place: the first line of `assets/js/site.js`:

```js
const BRAND = "Velus";
```

Every `<span class="brand"></span>` on every page, and the browser tab titles, are filled from it.

## Add the YouTube videos

Each film page has a placeholder:

```html
<div class="yt" data-id="TODO" ...>
```

Replace `TODO` with the video id (the part after `watch?v=`). After that, the play button loads a privacy-enhanced (`youtube-nocookie.com`) player when clicked, so nothing loads from YouTube before then. The chapter times also become links to that moment in the film.

## Add a film page

1. Copy `black-hole.html` (or `influenced.html`) to `new-film.html`.
2. Set the `<body>` class to a theme. You can reuse one, or add a new `.theme-xyz { --bg: …; --accent: …; }` block in `site.css` next to the others.
3. Fill in the hero, chapters (`<time data-t="SECONDS">m:ss</time>`), claims, caveats and readings. Claims go in `<ol class="claims" style="--start:N">`, where N is the number of claims in earlier chapters, so the numbering continues across chapters. Each claim has a `<p class="c">` (the claim) and a `<p class="src">` (sources). Use `<span class="nolink">` for a source with no URL and `<span class="calc">` + `<span class="badge">calc</span>` for numbers we computed. Only link to URLs that appear in the film's research files.
4. Save frames at most 1600 px wide as JPEG in `assets/img/`, for example `ffmpeg -ss 54 -i film.mp4 -frames:v 1 -vf scale=1600:-2 -q:v 4 assets/img/x.jpg`, and give every `<img>` an `alt`, a `width` and a `height`.
5. Add a card to the `.cards` list in `index.html`.
6. Add the page and its research files to `SOURCES` in `tools/check.py`, then run the check.

## Check before publishing

```
python3 -I tools/check.py
```

The script checks that:

- the HTML tags are balanced and every image has alt, width and height;
- every relative link, image and `#anchor` exists;
- every external link on a film page appears word for word in that film's research files (it only reads the engine folder, never writes to it);
- no external scripts are loaded.

It also prints the claims and sources per page and the total size.

## Publish on GitHub Pages

1. Create a repository (for example `velus-site`) and push the contents of this folder to the root of the `main` branch:
   ```
   git init && git add . && git commit -m "Site" && git branch -M main
   git remote add origin git@github.com:USER/velus-site.git && git push -u origin main
   ```
2. On GitHub, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then pick `main` and `/ (root)`.
3. After a minute or two the site is live at `https://USER.github.io/velus-site/`. All links are relative, so it also works under a custom domain (add it in the same settings page).

The empty `.nojekyll` file tells GitHub Pages to serve the files as they are, without running Jekyll.
