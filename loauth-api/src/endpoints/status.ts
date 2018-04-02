import { Next, Request, Response, Server } from 'restify';

async function status(_req: Request, res: Response, _next: Next) {
    res.json({ alive: true, version: '1.0.0' });
}

export function register(app: Server) {
    app.get({ path: '/status', version: '1.0.0' }, status);
}
