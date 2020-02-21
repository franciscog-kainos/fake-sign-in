import { ROOT_URI } from './Paths';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as nunjucks from 'nunjucks';

import { Application } from 'express';
import * as dotenv from 'dotenv'

export const config = () => {
  dotenv.config();
  return  {
    COOKIE_SECRET: loadEnvVariable('COOKIE_SECRET'),
    COOKIE_NAME: loadEnvVariable('COOKIE_NAME'),
  }
};

function loadEnvVariable(name: string): string {
  const envVar = process.env[name];

  if (!envVar) {
    throw Error(`${envVar} not set.`);
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