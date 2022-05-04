const wsState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

wsList = {}; // group by tabid

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.tabs.onCreated.addListener((tab) => {
  console.log('tab is created!');
  const videoList = {};
  let ws = wsList[tab.id];

  const tryConnect = async () => {
    while (!ws || ws.readyState !== wsState.OPEN) {
      console.log('try connecting...');
      ws = new WebSocket('ws://localhost:49367/ws');
      wsList[tab.id] = ws;
      await sleep(5000);
    }
    
    console.log('connected!');
  
    ws.onclose = () => {
      console.log('disconnected!');
      tryConnect();
    };
  }

  tryConnect();

  // this api is asynchronous
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      if (ws && ws.readyState === wsState.OPEN) {
        if (!videoList[details.url] && details.url.includes('m3u8')) {
          videoList[details.url] = true;
          ws.send(JSON.stringify(details));
          console.log(details);
        }
      }
    },{
      tabId: tab.id,
      types: ['xmlhttprequest'],
      urls: ["<all_urls>"]
    },
    ['requestHeaders', 'extraHeaders']
  );
});


chrome.tabs.onRemoved.addListener((tabId) => {
  const ws = wsList[tabId];
  if (ws) {
    ws.close();
    delete wsList[tabId];
  }
});