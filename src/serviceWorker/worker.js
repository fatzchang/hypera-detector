import HyperaWebSocketClient from './wsClient';
import { keepAlive } from './sorcery';

keepAlive();

chrome.tabs.onCreated.addListener((tab) => {
  console.log('tab is created!');
  const videoList = {};

  const ws = new HyperaWebSocketClient(tab.id);

  // this api is asynchronous
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      // ignore iframe's request
      // if (details.parentFrameId === -1) {
      if (ws.isReady()) {
        if (!videoList[details.url] && details.url.includes('m3u8')) {
          videoList[details.url] = true;
          ws.sendData(details);
        }
      }
      // }
    },{
      tabId: tab.id,
      types: ['xmlhttprequest'],
      urls: ["<all_urls>"]
    },
    ['requestHeaders', 'extraHeaders']
  );
});

chrome.tabs.onRemoved.addListener((tabId) => {
  HyperaWebSocketClient.remove(tabId);
});