#!/usr/bin/env node

/*eslint no-sync:0*/
var path = require('path');
var fs = require('fs');
var usage = fs.readFileSync(path.resolve(__dirname, '../usage.txt')).toString();
var args = require('minimist')(process.argv.slice(2), {
  boolean: ['debug']
});

if (args.debug) {
  process.env.DEBUG = 'mongodb-js-fmt';
}
var fmt = require('../');
var pkg = require('../package.json');

args.globs = args._;

if (args.help || args.h || args.globs.length === 0) {
  console.error(usage);
  process.exit(1);
}
if (args.version) {
  console.error(pkg.version);
  process.exit(1);
}

fmt(args, function(err, res) {
  if (err) {
    console.error(err);
    process.exit(1);
    return;
  }
  console.log('%d files formatted', res.formatted.length);
});
