import 'reflect-metadata'; // tslint:disable-line:no-import-side-effect
import { createServer, Server } from 'restify';
import {
    acceptParser,
    fullResponse,
    jsonBodyParser,
    queryParser,
} from 'restify-plugins';
import { createConnection } from 'typeorm';

import { config } from './config';
import { registerEndpoints } from './endpoints';

const { name, version } = <{ name: string; version: string; }> require('../package.json'); // tslint:disable-line

export const server: Server = createServer({
    name,
    version,
});

// Set up middlewares
server.use(jsonBodyParser({ mapParams: true }));
server.use(acceptParser(server.acceptable));
server.use(queryParser({ mapParams: true }));
server.use(fullResponse());

// Register endpoints
registerEndpoints(server);

async function setup() {
    // Setup database
    await createConnection();

    // Start server
    server.listen(config.server.port, config.server.host);

    // TODO(jamydev): Move to bunyan or something
    console.log(`${name}@${version} listening on ${config.server.port}`); // tslint:disable-line

    return server;
}

setup().catch((err: Error) => {
    console.error(err.stack);
});
