import http from "http";
import app from "../app";
import Constants from "../utils/Constants";

const server = http.createServer(app);
const serverPort = Constants.server.app_port;

server.listen(normalizePort(serverPort));

server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  console.log("listening on " + bind);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind =
    typeof serverPort === "string"
      ? "Pipe " + serverPort
      : "Port " + serverPort;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});

function normalizePort(val: string) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
