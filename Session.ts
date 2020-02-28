import { Keys } from './utils/Keys';
import { Encoding, generateRandomBytesBase64, generateSessionId, generateSignature } from './utils/Encoding';
import { config } from './config/Config';

export function createNewSession(sessionSecret: string, email: string, password: string): ISession {

    const accessToken: IAccessToken = {
        [Keys.AccessToken]: generateRandomBytesBase64(64),
        [Keys.ExpiresIn]: 3600,
        [Keys.RefreshToken]: generateRandomBytesBase64(64),
        [Keys.TokenType]: 'Bearer',
    };

    const defaultUserProfile: IUserProfile = {
        [Keys.Email]: email,
        [Keys.Forename]: password,
        [Keys.UserId]: generateRandomBytesBase64(1),
        [Keys.Locale]: 'GB_en',
        [Keys.Scope]: null,
        [Keys.Surname]: 'test',
    };

    const signInInfo: ISignInInfo = {
        [Keys.AccessToken]: accessToken,
        [Keys.AdminPermissions]: '0',
        [Keys.SignedIn]: 1,
        [Keys.UserProfile]: defaultUserProfile
    };
    const id = generateSessionId()
    return {
        [Keys.Id]: id,
        [Keys.ClientSig]: generateSignature(id, sessionSecret),
        [Keys.Hijacked]: null,
        [Keys.OAuth2Nonce]: generateRandomBytesBase64(64),
        [Keys.ZXSKey]: generateRandomBytesBase64(64),
        [Keys.Expires]: Date.now() + config().SESSION_EXPIRATION_TIME * 1000,
        [Keys.LastAccess]: Date.now(),
        [Keys.Pst]: 'all',
        [Keys.SignInInfo]: signInInfo
    };
}

export interface ISession {
    [Keys.Id]: string,
    [Keys.ClientSig]: string,
    [Keys.Hijacked]: string | null,
    [Keys.OAuth2Nonce]: string,
    [Keys.ZXSKey]: string,
    [Keys.Expires]: number,
    [Keys.LastAccess]: number,
    [Keys.Pst]: string,
    [Keys.SignInInfo]: ISignInInfo;
}

export interface ISignInInfo {
    [Keys.AccessToken]: IAccessToken,
    [Keys.AdminPermissions]: string,
    [Keys.SignedIn]: number,
    [Keys.UserProfile]: IUserProfile,
}

export interface IUserProfile {
    [Keys.Email]: string,
    [Keys.Forename]: string,
    [Keys.UserId]: string,
    [Keys.Locale]: string,
    [Keys.Scope]: string,
    [Keys.Surname]: string,
}


export interface IAccessToken {
    [Keys.AccessToken]: string,
    [Keys.ExpiresIn]: number,
    [Keys.RefreshToken]: string,
    [Keys.TokenType]: string,
}