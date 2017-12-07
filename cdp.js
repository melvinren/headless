const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

function launchChrome(headless=true){
  return chromeLauncher.launch({
    chromeFlags:[
      '--disable-gup',
      headless ? '--headless': ''
    ]
  });
}

/*
launchChrome().then(async chrome=>{
  const version = await CDP.Version({port:chrome.port});
  console.log(version['User-Agent'])
})
*/

(async function(){
  const chrome = await launchChrome();
  const protocol = await CDP({prot:chrome.port});

  const {Page, Runtime} = protocol;
  await Promise.all([Page.enable(), Runtime.enable()]);
 
  Page.navigate({url: 'http://www.geetest.com/demo/fullpage.html'});

  Page.loadEventFired(async ()=>{
    const js = "document.querySelector('#btn').value";
    const si = setInterval(function(){
      const result = await Runtime.evaluate({expression:js});
      console.log(result.result.value);
      if(result.result.value){
        clearInterval(si);
      }
    }, 100);
   // protocol.close();
   // chrome.kill();
  })
})();
