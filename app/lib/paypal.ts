import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const configureEnvironment = function () {
  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  const envName = process.env.PAYPAL_ENVIRONMENT;

  // Debugging log (Remove in production!)
  console.log(`[PayPal] Init: ${envName === 'sandbox' ? 'SANDBOX' : 'LIVE'}, ClientID starts with: ${clientId.substring(0, 4)}...`);

  return envName === 'sandbox'
    ? new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
};

const client = function () {
  return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
};

export default client;