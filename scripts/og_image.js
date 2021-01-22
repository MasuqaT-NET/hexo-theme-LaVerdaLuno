const fs = require("hexo-fs");
const path = require("path");
const puppeteer = require("puppeteer");
const {magenta} = require('chalk');

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
  await page.setContent(contentHtml);
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });

  for await (const post of posts) {
    const imagePath = post.og_image;
    const ogImageDestFilePath = path.join(hexo.public_dir, imagePath);
    if (await fs.exists(ogImageDestFilePath)) {
      return;
    }

    await fs.mkdirs(path.dirname(ogImageDestFilePath));

    await page.evaluate(title => {
      document.querySelector("#title").textContent = title;
    }, post.title)
    await page.screenshot({path: ogImageDestFilePath, fullPage: true});

    hexo.log.i(`Generated: ${magenta(imagePath)}`);
  }

  await browser.close();
});
