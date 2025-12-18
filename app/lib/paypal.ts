import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const configureEnvironment = function () {
  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
 new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
};
  
const client = function () {
  return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
};

export default client;