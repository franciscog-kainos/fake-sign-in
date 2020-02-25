import * as express from 'express';
import { Application, RequestHandler, Request, Response, NextFunction } from 'express';
import { RedisClient } from 'redis';
import { Encoding } from './utils/Encoding';
import { createNewSession, ISession } from './Session';
import { Keys } from './utils/Keys';
import { config, getExpressAppConfig } from './config/Config';

export class Server {

    private app: Application;
    private redis: RedisClient;
    private redirectUrl: string;

    constructor(private readonly port: number) {
        this.app = express();
        getExpressAppConfig(__dirname)(this.app);
        this.app.get('/signin', this.signInPage());
        this.app.post('/signin', this.signInPost());

        this.redis = new RedisClient(
            {
                host: config().CACHE_SERVER,
                password: config().CACHE_PASSWORD,
                db: config().CACHE_DB
            }
        );
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log('Sign in server started.');
        });
    }

    private signInPost = (): RequestHandler =>
        (req: Request, res: Response, next: NextFunction) => {
            const newDummySession = createNewSession(config().COOKIE_SECRET, req.body['chs-email'], req.body['chs-password']);
            console.log(newDummySession);

            const id = newDummySession[Keys.Id];
            const sig = newDummySession[Keys.ClientSig];
            const cookie = id + sig;

            this.redis.set(id, Encoding.encode<ISession>(newDummySession));
            res.cookie(config().COOKIE_NAME, cookie);
            console.log('Redirecting to: ' + `${config().REDIRECT_HOST}${this.redirectUrl}`)
            return res.redirect(`http://${config().REDIRECT_HOST}${this.redirectUrl}`);
        };

    private signInPage = (): RequestHandler =>
        (req: Request, res: Response, next: NextFunction) => {
            this.redirectUrl = req.query.return_to;
            return res.render('chs-signin');
        };
}

new Server(3001).start();