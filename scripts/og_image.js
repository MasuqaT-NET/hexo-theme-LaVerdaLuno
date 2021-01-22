const fs = require("hexo-fs");
const path = require("path");
const puppeteer = require("puppeteer");

let browser;
let browserPage;

// TODO 消す
hexo.extend.filter.register("after_init", async function () {
  browser = await puppeteer.launch({headless: true});
  const contentHtmlPath = path.join(hexo.theme_dir, "layout/og_image.html");
  const contentHtml = await fs.readFile(contentHtmlPath);
  browserPage = await browser.newPage();
  await browserPage.setContent(contentHtml);
});

// TODO 消す
hexo.extend.filter.register("before_exit", async function () {
  await browser.close();
});

// TODO 置き換える
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

  await browserPage.evaluate(title => {
    document.querySelector("#title").textContent = title
  }, page.title)
  await browserPage.screenshot({path: ogImageDestFilePath, fullPage: true});

  hexo.log.i(`Generated ${ogImageDestFilePath}`);
})

hexo.extend.filter.register("after_render", async function (page) { // TODO ??? before_generate???

});

// TODO 直列にやるとデータが衝突して死ぬ。適切な filter で待ち構えてまとめてやる必要がある
