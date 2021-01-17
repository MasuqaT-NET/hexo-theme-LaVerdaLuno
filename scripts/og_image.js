const fs = require("hexo-fs");
const path = require("path");
const puppeteer = require("puppeteer");
const ejs = require("ejs");

let browser;
let contentHtml;

hexo.extend.filter.register("after_init", async function () {
  browser = await puppeteer.launch({headless: true});
  const contentHtmlPath = path.join(hexo.theme_dir, "layout/og_image.ejs");
  contentHtml = await fs.readFile(contentHtmlPath);
});

hexo.extend.filter.register("before_exit", async function () {
  await browser.close();
});


hexo.extend.filter.register("before_post_render", async function (page) {
  if (page.layout !== "post") {
    return;
  }

  const ogImagePath = path.join("og_images", `${page.date.year()}/${page.p}.png`);
  const ogImageDestFilePath = path.join(hexo.source_dir, ogImagePath);

  page.og_image = ogImagePath.replace(/\\/g, "/");

  if (await fs.exists(ogImageDestFilePath)) {
    return;
  }

  await fs.mkdirs(path.dirname(ogImageDestFilePath));

  const options = {title: page.title, width: 1200, height: 630};
  const pageContent = ejs.render(contentHtml, options)
  const browserPage = await browser.newPage();
  await browserPage.setContent(pageContent);
  await browserPage.screenshot({path: ogImageDestFilePath});

  hexo.log.i(`Generated ${ogImageDestFilePath}`);
})
