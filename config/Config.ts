import { ROOT_URI } from './Paths';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import nunjucks from 'nunjucks';

import { Application } from 'express';
import * as dotenv from 'dotenv';

export const config = () => {
  dotenv.config();
  return {
    COOKIE_SECRET: loadEnvVariable('COOKIE_SECRET'),
    COOKIE_NAME: loadEnvVariable('COOKIE_NAME'),
    CACHE_SERVER: loadEnvVariable('CACHE_SERVER'),
    CACHE_DB: Number(loadEnvVariable('CACHE_DB')),
    CACHE_PASSWORD: loadEnvVariable('CACHE_PASSWORD', ''),
    REDIRECT_HOST: loadEnvVariable('REDIRECT_HOST'),
    SESSION_EXPIRATION_TIME: Number(loadEnvVariable('SESSION_EXPIRATION_TIME', '15'))

  };
};

function loadEnvVariable(name: string, defaultVal?: string): string {
  const envVar = process.env[name];

  if (!envVar) {
    if (defaultVal !== undefined) {
      return defaultVal;
    } else
    throw Error(`${name} not set.`);
  }
  return envVar;
}

export const getExpressAppConfig = (directory: string) => (app: Application): void => {


  app.use(ROOT_URI, express.static(path.join(directory, 'public/html')));
  app.use(ROOT_URI, express.static(path.join(directory, 'public/html/**/*')));
  app.use(ROOT_URI, express.static(path.join(directory, 'public/styles/css')));

  app.use(ROOT_URI, express.static(path.join(directory, 'public/govuk')));
  app.use(ROOT_URI, express.static(path.join(directory, 'public/govuk/assets')));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.set('view engine', 'njk');
  nunjucks.configure([
    'public',
    'public/html',
    'public/html/includes',
    'public/govuk/',
    'public/govuk/components',
  ], {
    autoescape: true,
    express: app,
  });

  app.locals.ROOT_URI = ROOT_URI;
};