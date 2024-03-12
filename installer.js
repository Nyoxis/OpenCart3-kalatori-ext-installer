// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


(async () => {
  if (process.argv.length != 5) {
    console.log(`Usage: ${process.argv[0]} ${process.argv[1]} <username> <password> <file>`);
    return;
  }
  
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  
  // Navigate the page to a URL
  await page.goto('https://kalatori-ci.exilancr.com/admin/index.php');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});
  await page.type("#input-username", process.argv[2]);
  await page.type("#input-password", process.argv[3]);
  await page.click("button[type=\"submit\"]");


  const url = await page.url();
  var params = url.split('?')[1].split("&");
  params = params.map(v => v.split('='));
  paramsMap = {};
  params.forEach(param => {
    paramsMap[param[0]] = param[1];
  });
  const userToken = paramsMap["user_token"];
  await page.goto('https://kalatori-ci.exilancr.com/admin/index.php?route=marketplace/installer&user_token=' + userToken);

  const[fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click("button[id=\"button-upload\"]"),
  ])
  await fileChooser.accept([process.argv[4]]);
  

  await sleep(2000);
  await browser.close();
})();