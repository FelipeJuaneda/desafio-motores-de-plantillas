const socket = io.connect();

const imprimir = (data) => {
  const html = data.messages
    .map((element, index) => {
      return `
              <div>
                  <strong>${element.author}</strong>
                  <strong>${element.date}</strong>
                  <em>${element.text}</em>
              </div>
              `;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
  const ps = data.products
    .map((p) => {
      return `
      <div>
        <span>${p.title}</span>
        <span>${p.price}</span>
        <img style="width:100px" src=${p.thumbnail} alt='imagen producto'/>
      </div>
      `;
    })
    .join(" ");
  document.getElementById("divProductos").innerHTML = ps;
};

const addMessage = (e) => {
  let user = document.getElementById("username").value;
  let text = document.getElementById("text").value;
  let fecha = new Date().toLocaleDateString() + " " + new Date().toTimeString();
  let fyh= fecha.split(" ")
  const mensaje = {
    author: user,
    text: text,
    date: fyh[0]+" - "+fyh[1],
  };
  socket.emit("new-message", mensaje);
  return false;
};

const addProduct = (e) => {
  const product = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
  };
  socket.emit("new-product", product);
  return false;
};
socket.on("messages", (data) => {
  imprimir(data);
});
