const CDP = require("chrome-remote-interface");

function lanchPage(){
   CDP(client =>{
   const { Network, Page, DOM} = client;
   Network.requestWillBeSent(params =>{
	console.log(params.request.url);
   });
//   Page.loadEventFired(()=>{
//	setTimeout(()=>{client.close();}, 1000);
//   });
   Promise.all([Network.enable(), Page.enable()])
	.then(()=>{
	   return Page.navigate({url: "http://192.168.0.230:11080"});
	})
	.then(()=>{
         DOM.getDocument((error, params)=>{
	  if(error){
		console.error(params);
		return;
          }
	   const options = {nodeId:params.root.nodeId, selector:'div'};
	   DOM.querySelectorAll(options, (error, params)=>{
		if(error){
		  console.error(params);
		  return;
		}
		params.nodeIds.forEach(nodeId =>{
		 DOM.getAttributes({nodeId:nodeId}, (error, params)=>{
			if(error){console.error(params);return;}
			console.log(params.attributes);
		 });
		})
	   });
	 });
	})
	.catch(err=>{
	   console.error(err);
	   client.close();
	});
}).on("error", err=>{
   console.error(err);
});
};
lanchPage();
