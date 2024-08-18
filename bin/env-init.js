#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');
const path = require("path");

const cwd = process.cwd();
const templateFile = path.join(__dirname, '.template.env.example');
const exampleFile = path.join(cwd, '.env.example');
const envFile = path.join(cwd, '.env');

const prompt = inquirer.createPromptModule();

if (!fs.existsSync(exampleFile)) {
  // Create example file with predefined variables
  fs.copyFileSync(templateFile, exampleFile);
} else {
  // Prompt user for desired name or use default
  prompt([
    {
      type: 'input',
      name: 'customName',
      message: 'Enter a custom name for the .env file (or press Enter for default):',
    },
  ])
  .then((answers) => {
    const customName = answers.customName.trim();
    const destinationFile = customName || envFile;

    // Copy contents of example file, including any modifications
    fs.copyFileSync(exampleFile, destinationFile);
    console.log(`Created ${destinationFile} with predefined variables.`);
  });
}