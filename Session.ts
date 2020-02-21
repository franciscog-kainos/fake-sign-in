import { Keys } from './utils/Keys';
import { Encoding } from './utils/Encoding';
import { config } from './config/Config';

export function createNewSession(sessionSecret: string, email: string, password: string): ISession {

    const accessToken: IAccessToken = {
        [Keys.AccessToken]: Encoding.generateRandomBytesBase64(64),
        [Keys.ExpiresIn]: 3600,
        [Keys.RefreshToken]: Encoding.generateRandomBytesBase64(64),
        [Keys.TokenType]: 'Bearer',
    };

    const defaultUserProfile: IUserProfile = {
        [Keys.Email]: email,
        [Keys.Forename]: password,
        [Keys.UserId]: Encoding.generateRandomBytesBase64(1),
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
    const id = Encoding.generateSessionId()
    return {
        [Keys.Id]: id,
        [Keys.ClientSig]: Encoding.generateSignature(id, sessionSecret),
        [Keys.Hijacked]: null,
        [Keys.OAuth2Nonce]: Encoding.generateRandomBytesBase64(64),
        [Keys.ZXSKey]: Encoding.generateRandomBytesBase64(64),
        [Keys.Expires]: Date.now() + 3600 * 10000,
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