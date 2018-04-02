import { Next, Request, Response, Server } from 'restify';

import { authenticate } from 'passport';
// tslint:disable

async function providerAuth(req: Request, res: Response, next: Next) {
    return authenticate(req.params.provider, { scope: ['https://www.googleapis.com/auth/plus.login'] })(req, res, next);
}

async function providerCallback(req: Request, res: Response, next: Next) {
    const customNext = function (_err: Error, user: boolean, ) {
        console.log(user)
        if (user) {
            return res.redirect(301, '/status', next);
        }

        res.status(403);
        res.json({ auth: false });
    }

    return authenticate(req.params.provider, { failureMessage: 'MAAAAALM' }, customNext)(req, res);
}

export function register(app: Server) {
    app.get({ path: '/auth/:provider', version: '1.0.0' }, providerAuth);
    app.get({ path: '/auth/:provider/callback', version: '1.0.0' }, providerCallback);
}
