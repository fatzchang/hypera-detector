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
    wsList[tab.id] = new WebSocket('ws://localhost:49367/ws');

    // let timer;
    wsList[tab.id].onopen = () => {
      console.log('connected!');
      wsList[tab.id].send('ping');
    }

    wsList[tab.id].onmessage = (message) => {
      setTimeout(() => {
        if (wsList[tab.id]) {
          wsList[tab.id].send('ping');
        }
      }, 5000);
    }

    wsList[tab.id].onclose = () => {
      console.log('disconnected!');
      delete wsList[tab.id];
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
      // ignore iframe's request
      if (details.parentFrameId === -1) {
        let ws = wsList[tab.id];
        if (ws && ws.readyState === wsState.OPEN) {
          if (!videoList[details.url] && details.url.includes('m3u8')) {
            videoList[details.url] = true;
            ws.send(JSON.stringify(details));
          }
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
  }
});


// mechanism to keep service worker alive in background
let lifeline;

keepAlive();

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'keepAlive') {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
  if (lifeline) return;
  for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => chrome.runtime.connect({ name: 'keepAlive' }),
        // `function` will become `func` in Chrome 93+
      });
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(tabId, info, tab) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
}