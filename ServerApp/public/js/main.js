const socket = io();

let messages = document.createElement("ul");
document.body.appendChild(messages);

socket.on("position message", (msg) => {
  console.log(msg);

  let messages = document.getElementsByTagName("ul")[0],
    message = document.createElement("li"),
    content = document.createTextNode(msg);
  message.appendChild(content);
  messages.appendChild(message);
});

socket.on("test", (msg) => console.log(msg));
