class HyperaWebSocketClient {
  // class static variables
  static MAX_RECONNECT_ATTEMPT = 5;
  static list = {};
  static WS_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
  }

  ws = null;
  identifier = '';

  // initialize max attempt times
  remainedAttempts = HyperaWebSocketClient.MAX_RECONNECT_ATTEMPT;

  constructor(identifier) {
    this.identifier = identifier;
    this._tryConnect();

    // store into static list
    HyperaWebSocketClient.list[identifier] = this;
  }

  // public method
  isReady() {
    return this.ws && this.ws.readyState === HyperaWebSocketClient.WS_STATE.OPEN;
  }

  sendData(data) {
    let dataString;
    if (typeof data === 'object') {
      dataString = JSON.stringify(data);
    } else {
      dataString = data;
    }

    if (this.isReady()) {
      this.ws.send(dataString);
    }
  }

  close() {
    this.ws.close();
  }

  // private method
  _tryConnect() {
    this.ws = new WebSocket('ws://localhost:49367/ws');
    this._registerEvents();
  }

  _registerEvents() {
    this.ws.onopen = () => {
      console.log('connected!');
      this.ws.send('ping');
    }

    this.ws.onmessage = (message) => {
      setTimeout(() => {
        if (this.ws) {
          this.ws.send('ping');
        }
      }, 5000);
    }

    this.ws.onclose = () => {
      console.log('disconnected!');
    };

    this.ws.onerror = () => {
      console.log('error!');

      if (this.ws && this.remainedAttempts > 0) {
        this._tryConnect();
        this.remainedAttempts--;
      }
    };
  }

  // static method
  static remove(identifier) {
    if (this.list[identifier]) {
      this.list[identifier].close();

      delete this.list[identifier];
    }
  }
}

export default HyperaWebSocketClient;