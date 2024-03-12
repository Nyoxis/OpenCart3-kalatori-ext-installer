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
  // console.log(process.argv);
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  
  // Navigate the page to a URL
  await page.goto('https://kalatori-ci.exilancr.com/admin/index.php');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});
  await page.type("#input-username", process.argv[2]);
  await page.type("#input-password", process.argv[3]);
  await page.click("button[type=\"submit\"]");


  // const link = await page.evaluate(() => {
  //   const elems = Array.from(document.querySelectorAll('ul > li > a'));
  //   const ret = [];
  //   for (const elem in elems) {
  //     ret.push(elem.innerText);
  //     // console.log(elem.innerText);
  //   }
  //   return ret;
  // });
  // console.log(link);
  const url = await page.url();
  var params = url.split('?')[1].split("&");
  params = params.map(v => v.split('='));
  paramsMap = {};
  params.forEach(param => {
    paramsMap[param[0]] = param[1];
  });
  const userToken = paramsMap["user_token"];
  await page.goto('https://kalatori-ci.exilancr.com/admin/index.php?route=marketplace/installer&user_token=' + userToken);
  // await page.click("button[id=\"button-upload\"]");
  // const fileChooser = await page.waitForFileChooser();
  const[fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click("button[id=\"button-upload\"]"),
  ])
  await fileChooser.accept([process.argv[4]]);
  // await example[0].type('1234');
  // await page.type("//input[@name=\"input-username\"]");

  // // Type into search box
  // await page.type('.devsite-search-field', 'automate beyond recorder');

  // // Wait and click on first result
  // const searchResultSelector = '.devsite-result-item-link';
  // await page.waitForSelector(searchResultSelector);
  // await page.click(searchResultSelector);

  // // Locate the full title with a unique string
  // const textSelector = await page.waitForSelector(
  //   'text/Customize and automate'
  // );
  // const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // // Print the full title
  // console.log('The title of this blog post is "%s".', fullTitle);
  await sleep(2000);
  await browser.close();
})();