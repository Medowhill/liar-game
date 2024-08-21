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

  document.getElementById('button').addEventListener('click', function() {
    const word = document.getElementById("word").value;
    const liarWord = document.getElementById("liar-word").value;
    if (socket) {
      socket.send(`${word},${liarWord}`);
    }
  });

  connect();
});
