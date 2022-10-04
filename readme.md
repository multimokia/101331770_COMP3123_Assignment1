# COMP 3123 Assignment 1

## ENV_VARS:
- `DB_URI` - **REQUIRED**, connection string to a mongodb database. **WILL ERROR IF NOT PROVIDED**
- `API_SECRET` - **REQUIRED** secret for encryption/decryption of jwts. **WILL ERROR IF NOT PROVIDED**
- `PORT` - The desired port to listen on (if not provided, 8000 is assumed)
- `SSL_CERT_FP`- Path to an SSL cert file. If not present (or file isn't found), http will be used instead of https
- `SSL_KEY_FP` - Path to an SSL key file. If not present (or file isn't found), http will be used instead of https
