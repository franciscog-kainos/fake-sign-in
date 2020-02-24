# FAKE SIGN IN SERVICE

Create `.env` file and set:

- `COOKIE_NAME`
- `COOKIE_SECRET` - Must be at least 16 bytes of base64 encoded string
- `CACHE_SERVER` - Redis host in this format: `host:port`
- `CACHE_DB`
- `CACHE_PASSWORD`
- `REDIRECT_HOST` - URL of the application to redirect to after sign-in in thist format: `host:port`
- `SESSION_EXPIRATION_TIME` - Time in seconds until session expires (optional, default value set to 3600).

# To run:

- `npm install`
- `npm start`