export default {
  token: {
    access_token_key: 'x_acc',
    refresh_token_key: 'x_ref',
    signed_token_secret: process.env.SIGNED_TOKEN_SECRET || 'signed_token_secret',
  }
}