const setCommunicator = () => {
  var port = chrome.runtime.connect();
  window.addEventListener('message', (event) => {
      // only accept messages from ourselves
      if (event.source != window) {
        return;
      }

      port.postMessage(event.data);
    },
    false
  );

  // in web page: use follow script to communicate with
  // window.postMessage({ type: 'HYPERA_PORT', text: 'Hello from the webpage!' }, '*');
}

export default setCommunicator;