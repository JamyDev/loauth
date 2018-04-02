import * as cfg from 'config';

export interface ILocalConfig extends cfg.IConfig {
    server: {
        host: string;
        port: number;
    };
}

export const config = <ILocalConfig>cfg;
