#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const envExampleContent = `# Port
PORT=5000

# JWT Secret
JWT_SECRET=mysecretkey

# App Name
APP_NAME=My Awesome App

# MySQL Credentials
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=myapp
MYSQL_USER=root
MYSQL_PASSWORD=

# Firebase Credentials
FIREBASE_API_KEY=yourapikey
FIREBASE_AUTH_DOMAIN=yourauthdomain
FIREBASE_PROJECT_ID=yourprojectid

# AWS S3 Credentials
AWS_ACCESS_KEY_ID=youraccesskeyid
AWS_SECRET_ACCESS_KEY=yoursecretaccesskey
AWS_S3_BUCKET=yourbucketname

# SendGrid Credentials
SENDGRID_API_KEY=yoursendgridapikey
SENDGRID_SENDER_EMAIL=youremail@example.com

# Stripe Credentials
STRIPE_API_KEY=yourstripeapikey
STRIPE_PUBLISHABLE_KEY=yourstripepublishablekey

# Twilio Credentials
TWILIO_ACCOUNT_SID=yourtwilioaccountsid
TWILIO_AUTH_TOKEN=yourtwilioauthtoken
TWILIO_PHONE_NUMBER=yourtwiliophonenumber
`;

const envExampleFilename = '.env.example';
const envFilename = '.env';

function createEnvExample() {
  fs.writeFileSync(envExampleFilename, envExampleContent, 'utf8');
  console.log(`Created ${envExampleFilename} with default variables.`);
}

function copyEnvExampleToEnv() {
  const envExampleLines = envExampleContent.split('\n');
  const existingEnvContent = fs.existsSync(envFilename)
    ? fs.readFileSync(envFilename, 'utf8')
    : '';

  const newEnvContent = [];
  const existingEnvVariables = new Set();

  existingEnvContent.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key] = trimmedLine.split('=');
      existingEnvVariables.add(key);
    }
  });

  envExampleLines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key] = trimmedLine.split('=');
      if (!existingEnvVariables.has(key)) {
        newEnvContent.push(line);
      }
    }
  });

  if (newEnvContent.length === 0) {
    console.log('No new variables found in the .env.example file.');
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    `The following variables will be added to ${envFilename}:\n${newEnvContent.join(
      '\n'
    )}\nDo you want to append them (Y/n)? `,
    (answer) => {
      const shouldAppend = !/^n$/i.test(answer.trim());
      fs.writeFileSync(
        envFilename,
        shouldAppend
          ? `${existingEnvContent}\n${newEnvContent.join('\n')}\n`
          : newEnvContent.join('\n'),
        'utf8'
      );
      console.log(
        `Variables ${
          shouldAppend ? 'appended to' : 'overwritten in'
        } ${envFilename}.`
      );
      rl.close();
    }
  );
}

if (!fs.existsSync(envExampleFilename)) {
  createEnvExample();
} else {
  copyEnvExampleToEnv();
}