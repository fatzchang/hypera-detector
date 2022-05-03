const wsState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};


const videoList = {}
let ws;

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const tryConnect = async () => {
  while (!ws || ws.readyState !== wsState.OPEN) {
    console.log('try connecting...');
    ws = new WebSocket('ws://localhost:49367/ws');
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
    types: ['xmlhttprequest'],
    urls: ["<all_urls>"],
  },
  ['requestHeaders', 'extraHeaders']
);
