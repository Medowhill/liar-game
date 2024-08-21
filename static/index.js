document.addEventListener("DOMContentLoaded", () => {
  let socket = null;

  function connect() {
    disconnect();

    const { location } = window;

    const proto = location.protocol.startsWith("https") ? "wss" : "ws";
    const wsUri = `${proto}://${location.host}/ws`;

    socket = new WebSocket(wsUri);
    socket.onopen = () => {
      console.log("connected");
    };
    socket.onmessage = (ev) => {
      document.getElementById("word").innerText = ev.data;
    };
    socket.onclose = () => {
      console.log("disconnected");
      onclose();
    };
  }

  function onclose() {
  }

  function disconnect() {
    if (socket) {
      socket.close()
      onclose();
    }
  }

  connect();
});
