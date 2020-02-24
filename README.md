# FAKE SIGN IN SERVICE

Create `.env` file and set:

- `COOKIE_NAME`
- `COOKIE_SECRET` - Must be at least 16 bytes of base64 encoded string
- `CACHE_SERVER` - Redis host in this format: `host:port`
- `CACHE_DB`
- `CACHE_PASSWORD`
- `REDIRECT_HOST` - URL of the application to redirect to after sign-in in thist format: `host:port`


# To run:

- `npm install`
- `npm start`