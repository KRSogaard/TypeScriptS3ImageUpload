import * as http from "http";
import App from "./app";
import { APILogger } from "./logger/api.logger";
import * as AWS from 'aws-sdk';
require('dotenv').config()

const port = process.env.PORT || 3080;

const logger = new APILogger();

logger.info(JSON.stringify({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: 'us-east-1'
  }), []);

App.set("port", port);
const server = http.createServer(App);
server.listen(port);

server.on("listening", function(): void {
    const addr = server.address();
    const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Listening on ${bind}`, null);
 });

module.exports = App;
