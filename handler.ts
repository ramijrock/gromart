import app from "./src";
import ServerlessHttp from "serverless-http";

export const hello = ServerlessHttp(app)