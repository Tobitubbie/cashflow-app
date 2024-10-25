import {APP_BASE_HREF} from '@angular/common';
import {CommonEngine} from '@angular/ssr';
import express from 'express';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';
import bootstrap from './src/main.server';
import {configDotenv} from 'dotenv';
import jwa from 'jwa';

// load dotenv file into process.env
configDotenv();

const env = {
  APPLICATION_ID: process.env['APPLICATION_ID'],
  PRIVATE_KEY: process.env['PRIVATE_KEY'],
}

function createJwtToken(expiration: number = 3600): string {
  const iat = Math.floor((new Date()).getTime() / 1000);
  const jwtBody = {
    iss: "enablebanking.com",
    aud: "api.enablebanking.com",
    iat: iat, // time when the token is created
    exp: iat + expiration, // time when the token is set to expire
  };

  const jsonBase64 = (data: any) => Buffer.from(JSON.stringify(data)).toString("base64").replace("=", "");

  const header = jsonBase64({
    typ: "JWT",
    alg: "RS256",
    kid: env.APPLICATION_ID
  });
  const body = jsonBase64(jwtBody);

  if (!env.PRIVATE_KEY) throw 'Missing environment variable "PRIVATE_KEY"';

  const signature = jwa("RS256").sign(`${header}.${body}`, env.PRIVATE_KEY);
  return `${header}.${body}.${signature}`;
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use(express.json());

  // Proxy requests from "/enablebanking" to "https://api.enablebanking.com"
  server.all('/enablebanking/**', async (req, res, _next) => {
    console.log("Proxy Intercept");

    const forwardedHeaders = new Headers();
    for (const key in req.headers) {
      const value = req.headers[key];
      if (Array.isArray(value)) {
        value.forEach(v => forwardedHeaders.set(key, v));
      } else if (value !== undefined) {
        forwardedHeaders.set(key, value);
      }
    }

    const targetUrl = req.url.replace('/enablebanking', 'https://api.enablebanking.com');

    return fetch(targetUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${createJwtToken()}`,
        'Content-Type': 'application/json',
        // TODO: not working yet...
        // ...forwardedHeaders,
      },
      ...(req.method !== 'GET') && {body: JSON.stringify(req.body)},
    })
      .then(async proxiedResponse => {
        return res.status(proxiedResponse.status).send(await proxiedResponse.json())
      })
      .catch(error => {
        console.error(error);
        return res.status(500).send({message: 'Error in custom proxy'});
      });
  })

  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    console.log("GET **");

    const {protocol, originalUrl, baseUrl, headers} = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{provide: APP_BASE_HREF, useValue: baseUrl}],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
