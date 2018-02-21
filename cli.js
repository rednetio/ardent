#!/usr/bin/env node

'use strict';

const ardent = require('.');
let markdown = '';

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();

  if (chunk !== null) {
    markdown += chunk;
  }
});

process.stdin.on('end', () => {
  process.stdout.write(ardent(markdown));
});
