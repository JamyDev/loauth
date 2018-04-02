import * as cfg from 'config';

export interface ILocalConfig extends cfg.IConfig {
    server: {
        host: string;
        port: number;
    };
    providers: {
        google: {
            clientId: string;
            clientSecret: string;
        };
    };
}

export const config = <ILocalConfig>cfg;
