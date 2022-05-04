const wsState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

wsList = {}; // group by tabid



chrome.tabs.onCreated.addListener((tab) => {
  console.log('tab is created!');
  const videoList = {};

  const tryConnect = () => {  
    console.log(tab.id, 'trying connect...');
    wsList[tab.id] = new WebSocket('ws://localhost:49367/ws'),

    wsList[tab.id].onopen = () => {
      console.log('connected!');
    }

    wsList[tab.id].onclose = () => {
      console.log('disconnected!');
    };

    wsList[tab.id].onerror = () => {
      console.log('error!');
      if (wsList[tab.id]) {
        tryConnect();
      }
    };
  }

  tryConnect();

  // this api is asynchronous
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      let ws = wsList[tab.id];
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
  if (wsList[tabId]) {
    wsList[tabId].close();
    delete wsList[tabId];
  }
});