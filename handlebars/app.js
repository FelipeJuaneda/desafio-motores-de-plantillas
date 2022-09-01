const express = require("express");
const app = express();
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const port = 8080;

var productsRoute = require("./routes/productsRoute");
var usersRouter = require("./routes/users");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", productsRoute);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//requiero los productos
const products = require("./src/contenedor");
console.log(products);
//array donde se guardan los mensajes
let messages = [
  { author: "Juan", text: "Hola ¿ Qué tal ?", date: "31/8/2022 - 20:09:21" },
  { author: "Pedro", text: "Muy Bien y vos ?", date: "31/8/2022 - 20:09:21" },
  { author: "Ana", text: "Geinal !", date: "31/8/2022 - 20:09:21" },
];

const server = httpServer.listen(port, () => {
  console.log(`servidor escuchando en puerto ${port}`);
});

server.on("error", (err) => console.log(err));

io.on("connection", (socket) => {
  console.log("se conecto un cliente");
  //envio mensajes al cliente
  socket.emit("messages", { messages, products: products.getAll() });

  socket.on("new-message", (data) => {
    messages = [...messages, data];
    let todo = { messages: messages, products: products.getAll() };

    io.sockets.emit("messages", todo);
  });

  socket.on("new-product", (data) => {
    console.log(data);
    products.save(data);
    let todo = { messages: messages, products: products.getAll() };
    io.sockets.emit("messages", todo);
  });
});

module.exports = app;
