'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const screenshots_dir = './screenshots';

async function shoot (args = {}) {
  const opt = Object.assign({
    width: 1024,
    height: 2048,
    url: ''
  }, args);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({
    width: opt.width,
    height: opt.height
  });
  let result = {
    success: false,
    filepath: '',
    messages: []
  };

  const dir = path.join(__dirname, screenshots_dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filename = opt.url.replace(/^https?:\/\//, '').replace(/\//g, '__');
  const filepath = path.join(__dirname, screenshots_dir, filename + '.png');
  result.filepath = filepath;
  if (fs.existsSync(filepath)) {
    result.messages.push('"' + filepath + '" is already exists.');
  } else {
    await page.goto(opt.url).catch((err) => {
      result.messages.push(err);
    });

    await page.screenshot({path: filepath}).then(() => {
        result.success = true;
        result.messages.push('"' + filepath + '" screenshot was saved.');
      }).catch((err) => {
        result.messages.push(err);
      });
  }

  await browser.close();
  return result;
};

module.exports = shoot;
