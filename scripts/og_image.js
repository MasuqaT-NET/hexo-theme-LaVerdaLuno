const fs = require("hexo-fs");
const path = require("path");
const puppeteer = require("puppeteer");
const {magenta} = require('chalk');

const WIDTH = 1200;
const HEIGHT = 630;

hexo.extend.filter.register("before_post_render", async function (page) {
  if (page.layout !== "post") {
    return;
  }

  const ogImagePath = path.join("og_images", `${page.date.year()}/${page.p}.png`);

  page.og_image = ogImagePath.replace(/\\/g, "/");
})

hexo.extend.filter.register("before_generate", async function ([documents]) {
  // only if generate(build) pages
  if (hexo.env.cmd !== "generate") {
    return;
  }

  const posts = documents.filter(d => d.layout === "post" && !!d.og_image);

  if (posts.length === 0) {
    return;
  }

  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  // open page template
  const contentHtmlPath = path.join(hexo.theme_dir, "layout/og_image.html");
  const contentHtml = await fs.readFile(contentHtmlPath);
  await page.setViewport({
    width: WIDTH,
    height: HEIGHT,
  })
  await page.setContent(contentHtml, {
    waitUntil: 'networkidle0',
  })
  await page.evaluate(({width, height}) => {
    document.querySelector("#main-style").insertAdjacentText("afterbegin", `
      :root {
        --page-width: ${width};
        --page-height: ${height};
      }
    `);
  }, {width: `${WIDTH}px`, height: `${HEIGHT}px`});

  for (const post of posts) {
    const imagePath = post.og_image;
    const ogImageDestFilePath = path.join(hexo.public_dir, imagePath);
    if (await fs.exists(ogImageDestFilePath)) {
      return;
    }

    await fs.mkdirs(path.dirname(ogImageDestFilePath));

    await page.evaluate(title => {
      document.querySelector("#title").textContent = title;
    }, post.title)
    await page.screenshot({path: ogImageDestFilePath});

    hexo.log.i(`Generated: ${magenta(imagePath)}`);
  }

  await browser.close();
});
