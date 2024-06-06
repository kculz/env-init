#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const envExampleContent = `# Port
PORT=5000

# JWT Secret
JWT_SECRET=mysecretkey

# App Name
APP_NAME='My Awesome App'

# MySQL Credentials
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=myapp
MYSQL_USER=root
MYSQL_PASSWORD=

# Mongodb URI
MONGO_URI=

# Emails configs & Credentials
EMAIL_HOST='example.com'
EMAIL='johndoe.example.com'
EMAIL_PASSWORD='secretPassword'
EMAIL_PORT=465



`;

function createEnvExample(filename) {
  fs.writeFileSync(filename, envExampleContent, 'utf8');
  console.log(`Created ${filename} with default variables.`);
}

function copyEnvExampleToEnv(exampleFilename, envFilename) {
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
    } else {
      newEnvContent.push(line);
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the name of the .env file (default: .env): ', (envFileName) => {
  const filename = envFileName || '.env';
  const exampleFilename = '.env.example';

  if (!fs.existsSync(exampleFilename)) {
    createEnvExample(exampleFilename);
  } else {
    copyEnvExampleToEnv(exampleFilename, filename);
  }

  rl.close();
});