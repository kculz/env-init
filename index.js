const { exec } = require('child_process');
const path = require('path');

const binDirectory = path.join(__dirname, 'bin');
const command = path.join(binDirectory, 'env-init.js');

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing env-init: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`env-init encountered an error: ${stderr}`);
    return;
  }

  console.log(`env-init output:\n${stdout}`);
});