const fs = require("hexo-fs");
const path = require("path");
const puppeteer = require("puppeteer");

const DEST_DIR_NAME = "og_images";

hexo.extend.filter.register("before_post_render", async function (page) {
  if (page.layout !== "post") {
    return;
  }

  const ogImagePath = path.join(DEST_DIR_NAME, `${page.date.year()}/${page.p}.png`);

  page.og_image = ogImagePath.replace(/\\/g, "/");
})

hexo.extend.filter.register("before_generate", async function ([documents]) {
  if (hexo.env.env === "development") {
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

  for await (const post of posts) {
    const ogImageDestFilePath = path.join(hexo.source_dir, post.og_image);
    if (await fs.exists(ogImageDestFilePath)) {
      return;
    }

    await fs.mkdirs(path.dirname(ogImageDestFilePath));

    await page.evaluate(title => {
      document.querySelector("#title").textContent = title;
    }, post.title)
    await page.screenshot({path: ogImageDestFilePath, fullPage: true});

    hexo.log.d(`Generated ${ogImageDestFilePath}`);
  }

  await browser.close();
});
