import msgpack5 from 'msgpack5';
import * as crypto from 'crypto';

export enum EncondingConstant {
    _idOctets = (7 * 3),
    _signatureStart = (_idOctets * 4) / 3,
    _signatureLength = 27,
    _cookieValueLength = _signatureStart + _signatureLength

}

export class Encoding {

    public static encode = (data: any): string => {
        if (!data) {
            throw new Error('Value to encode must be defined');
        }

        return Encoding.encodeMsgpack(data);
    };

    private static encodeMsgpack = (data: any): string => {

        return msgpack5().encode(JSON.stringify(data)).toString('base64');
    };
}

export function generateSessionId(): string {
    return generateRandomBytesBase64(EncondingConstant._idOctets);
}

export function generateRandomBytesBase64(numBytes: number): string {
    return crypto.randomBytes(numBytes).toString('base64');
}

export function generateSignature(cookieString: string, secret: string): string {
    const adjustedId = extractSessionId(cookieString);
    const value = crypto
        .createHash('sha1')
        .update(adjustedId + secret)
        .digest('base64');
    return value.substr(0, value.indexOf('='));
}

export function extractSessionId(sessionCookie: string): string {
    return sessionCookie.substring(0, EncondingConstant._signatureStart);
}

export function extractSignature(sessionCookie: string): string {
    return sessionCookie.substring(EncondingConstant._signatureStart);
}

