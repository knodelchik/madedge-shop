import { Client, Environment, LogLevel } from '@paypal/paypal-server-sdk';

const configureEnvironment = () => {
  if (process.env.PAYPAL_ENVIRONMENT === 'sandbox') {
    return Environment.Sandbox;
  }
  return Environment.Production;
};

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID || '',
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  },
  timeout: 0,
  environment: configureEnvironment(),
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

export default client;