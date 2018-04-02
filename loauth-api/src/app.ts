import * as sessions from 'client-sessions';
import { deserializeUser, initialize, serializeUser, session, use } from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
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

async function passport() {
    server.use(<any> initialize());
    server.use(<any> session());

    // TODO: check why session isn't set after auth
    // ALT: write own middleware for session data in JWT cookie
    server.use(sessions({
        // cookie name dictates the key name added to the request object
        cookieName: 'loa_sess',
        // should be a large unguessable string
        secret: 'yoursecret',
        // how long the session will stay valid in ms
        duration: 365 * 24 * 60 * 60 * 1000,
    }));

    // We would consider that each strategy returns the strategy name and a uuid string for that strategy
    serializeUser((user, done) => done(null, (<any>user).uuid));
    deserializeUser((user, done) => done(null, (<any>user).uuid));

    const googleStrategy = new OAuth2Strategy(
        {
            clientID: config.providers.google.clientId,
            clientSecret: config.providers.google.clientSecret,
            callbackURL: 'http://localhost:3400/auth/google/callback', // tslint:disable-line
        },
        (_accessToken, _refreshToken, profile, done) => {
            done(null, { uuid: profile.id });
            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //     return done(err, user);
            // });
        },
    );
    use(googleStrategy);
}

async function setup() {
    // Setup database
    await createConnection();

    // Setup passport
    await passport();

    // Start server
    server.listen(config.server.port, config.server.host);

    // TODO(jamydev): Move to bunyan or something
    console.log(`${name}@${version} listening on ${config.server.port}`); // tslint:disable-line

    return server;
}

setup().catch((err: Error) => {
    console.error(err.stack);
});
