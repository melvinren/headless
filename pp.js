const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser=>{
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    //interceptedRequest.continue();
    //console.log(interceptedRequest.url);
    if(interceptedRequest.url.indexOf('ajax.php')>0){
      console.log('ajax')
      // modify response
      //interceptedRequest.respond({body:"intercepted response"})
    } 

    interceptedRequest.continue();
  });

  page.on('response', async response=>{
    //console.log(response.url)
    if(response.url.indexOf('ajax.php')>0){
      console.log('ajax response');
      const text = await response.text();
      console.log(text);
      
      if (text.indexOf('success')>0){
 	await browser.close()
      }
    }
  });

  //await page.goto('http://www.geetest.com/demo/fullpage.html');
  //await page.screenshot({path:'screenshot.png'});
  //const btn = await page.$eval("#btn",el=>el.innerHTML);
  //console.log(btn);
  const watchGT = page.waitForSelector(".geetest_holder")
  await page.goto('http://www.geetest.com/demo/fullpage.html');
  await watchGT
  page.click(".geetest_holder")
  //await browser.close()
})
