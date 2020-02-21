import * as msgpack5 from 'msgpack5';
import * as crypto from 'crypto';
import { promisify } from 'util';

export enum EncondingConstant {
    _idOctets = (7 * 3),
    _signatureStart = (_idOctets * 4) / 3,
    _signatureLength = 27,
    _cookieValueLength = _signatureStart + _signatureLength

}

export class Encoding {


    public static generateSignature(id: string, secret: string): string {
        const adjustedId = id.substr(0, EncondingConstant._idOctets);
        return this.generateSha1SumBase64(adjustedId + secret).substr(0, EncondingConstant._signatureLength);
    }

    public static generateSha1SumBase64(base: any): string {

        return crypto
            .createHash('sha1')
            .update(base)
            .digest('base64');
    }

    public static generateRandomBytesBase64(numBytes: number): string {
        return crypto.randomBytes(numBytes).toString('base64');

    }

    public static async generateRandomBytesBase64Async(numBytes: number): Promise<string> {
        const asyncFun = promisify(crypto.randomBytes);
        return (await asyncFun(numBytes)).toString('base64');

    }

    private static decodeMsgpack = (data: any): any => {
        const buffer = Buffer.from(data, 'base64')
        return JSON.parse(msgpack5().decode(buffer));
    };

    private static encodeMsgpack = (data: any): string => {
        return msgpack5().encode(JSON.stringify(data)).toString('base64');
    };

    public static encode = <T>(object: T): string => {
        return Encoding.encodeMsgpack(object);
    };

    public static decode = (value: string): any => {

        return Encoding.decodeMsgpack(value);
    };

    public static generateSessionId(): string {
        return Encoding.generateRandomBytesBase64(EncondingConstant._idOctets);
    }

    public static unmarshall = <T>(object: T): any => {
        const obj: any = {};
        const thisObj: any = object;

        const keys = Object.keys(thisObj).sort();

        for (const i in keys) {
            if (thisObj.hasOwnProperty(keys[i])) {
                obj[keys[i]] = thisObj[keys[i]];
            }
        }

        return obj;
    };

    public static marshall = <T>(object: T, data: any): T => {
        const populatedObject = object as any;
        const keys = Object.keys(data).sort();

        for (const i in keys) {
            if (data.hasOwnProperty(keys[i])) {
                populatedObject[keys[i]] = data[keys[i]];
            }
        }

        return populatedObject;
    };
}
