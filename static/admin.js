document.addEventListener("DOMContentLoaded", () => {
  let socket = null;

  function connect() {
    disconnect();

    const { location } = window;

    const proto = location.protocol.startsWith("https") ? "wss" : "ws";
    const wsUri = `${proto}://${location.host}/ws`;

    socket = new WebSocket(wsUri);
    socket.onopen = () => {
      document.getElementById("input").style.display = "block";
    };
    socket.onmessage = (ev) => {
    };
    socket.onclose = () => {
      onclose();
    };

    document.getElementById("connect").style.display = "none";
  }

  function onclose() {
    document.getElementById("input").style.display = "none";
    document.getElementById("connect").style.display = "block";
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

  document.getElementById('connect').addEventListener('click', connect);

  connect();
});
