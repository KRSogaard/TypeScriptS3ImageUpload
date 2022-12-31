import * as bodyParser from "body-parser";
const path = require('path');
import * as express from "express";
import { APILogger } from "./logger/api.logger";
import { ImageController } from "./controller/imagecontroller";
import swaggerUi = require('swagger-ui-express');
import fs = require('fs');
import * as multer from 'multer';

class App {

    public express: express.Application;
    public logger: APILogger;
    public imageController: ImageController;

    /* Swagger files start */
    // private swaggerFile: any = (process.cwd()+"/swagger/swagger.json");
    // private swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
    // private customCss: any = fs.readFileSync((process.cwd()+"/swagger/swagger.css"), 'utf8');
    // private swaggerDocument = JSON.parse(this.swaggerData);
    /* Swagger files end */


    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.logger = new APILogger();
        this.imageController = new ImageController();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json({limit: '50mb'}));
        this.express.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
        this.express.use(express.static(path.join(__dirname, '../ui/build')));
    }

    private routes(): void {
        const upload = multer({ dest: '/api/upload' });

        this.express.post("/api/upload", upload.single('file'), async (req, res) => {
            // Get the file name from the request parameters
            const fileName = "MyFileName";

            // Get the file contents from the request body
            const fileContents = (req as any).file;

            try {
                await this.imageController.uploadImage(fileName + ".jpg", fs.createReadStream(fileContents.path));
                res.status(200).send("Upload done");

            } catch(err) {
                this.logger.error("Got error: " + err);
                res.status(500).send("Failed to upload");
            }
        });

        this.express.get("/", (req, res, next) => {
            res.sendFile(path.join(__dirname, '../ui/build/index.html'));
        });

        // swagger docs
        //this.express.use('/api/docs', swaggerUi.serve, swaggerUi.setup(this.swaggerDocument, null, null, this.customCss));

        // handle undefined routes
        this.express.use("*", (req, res, next) => {
            res.send("Make sure url is correct!!!");
        });
    }
}

export default new App().express;
