document.addEventListener("DOMContentLoaded", () => {
  let socket = null;

  function connect() {
    disconnect();

    const { location } = window;

    const proto = location.protocol.startsWith("https") ? "wss" : "ws";
    const wsUri = `${proto}://${location.host}/ws`;

    socket = new WebSocket(wsUri);
    socket.onopen = () => {
      document.getElementById("status").innerText = "연결됨";
    };
    socket.onmessage = (ev) => {
      document.getElementById("word").innerText = ev.data;
    };
    socket.onclose = () => {
      onclose();
    };

    document.getElementById("status").innerText = "연결 중...";
    document.getElementById("connect").style.display = "none";
  }

  function onclose() {
    document.getElementById("status").innerText = "연결 끊김";
    document.getElementById("connect").style.display = "block";
  }

  function disconnect() {
    if (socket) {
      socket.close()
      onclose();
    }
  }

  document.getElementById('connect').addEventListener('click', connect);

  connect();
});
