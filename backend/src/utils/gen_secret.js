import crypto from 'node:crypto';
import fs from 'node:fs';
import { getFullTime } from './time.js';

function get_secret() {
  return crypto.randomBytes(64).toString('hex');
}

fs.appendFile('secret.txt', `${getFullTime()}: \n` + get_secret() + "\n", function (err) {
  err ? console.log(err) : console.log('Saved!');
});