import { Next, Request, Response, Server } from 'restify';

async function status(_req: Request, res: Response, _next: Next) {
    res.json({ alive: true, version: '1.0.0' });
}

function verifyAuth(req: Request, res: Response, next: Next) {
    if ((<any>req).isAuthenticated()) {
        return next();
    }

    return res.redirect(302, '/noauth', next);
}

export function register(app: Server) {
    app.get({ path: '/status', version: '1.0.0' }, verifyAuth, status);
}
