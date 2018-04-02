import { Server } from 'restify';

import { register as auth } from './auth';
import { register as status } from './status';

// registerEndpoints pulls all of the register calls from the separate endpoints file and calls them.
export function registerEndpoints(app: Server) {
    auth(app);
    status(app);
}
