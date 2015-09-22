var fs = require('fs');
var glob = require('glob');
var jsfmt = require('jsfmt');
var async = require('async');
var defaults = require('lodash.defaults');
var debug = require('debug')('mongodb-js-fmt');

/**
 * Expand globs into paths.
 */
function resolve(opts, done) {
  glob(opts.globs, {}, function(err, files) {
    if (err) return done(err);
    debug('project has %d files', files.length);

    opts.files = files;
    done();
  });
}

function format(opts, done) {
  function fmt(src, cb) {
    debug('formatting `%s`...', src);
    fs.readFile(src, function(err, buf) {
      if (err) return cb(err);
      var original = buf.toString('utf-8');
      try {
        var formatted = jsfmt.format(original, opts.jsfmtConfig);
        if (formatted === original) {
          debug('no formatting needed for `%s`', src);
          opts.res.unchanged.push(src);
        } else {
          debug('writing formatted version of `%s`...', src);
          opts.res.formatted.push(src);
          fs.writeFile(src, formatted, cb);
        }
      } catch (e) {
        debug('error while formatting `%s`: %s', src, err.stack);
        return cb(e);
      }
    });
  }
  debug('`%d` files will be formatted...', opts.files);
  async.parallel(opts.files.map(fmt), done);
}

/**
 * @param {Object} opts
 * @param {Function} done
 * @api public
 */
module.exports = function(opts, done) {
  defaults(opts, {
    dir: process.cwd(),
    globs: [],
    files: []
  });

  if (!Array.isArray(opts.globs)) {
    opts.globs = [opts.globs];
  }

  opts.res = {
    formatted: [],
    unchanged: []
  };

  // @todo (imlucas): Support config via package.json.
  // var path = require('path');
  // var pkg = require(path.join(opts.dir, 'package.json'));
  // debug('Loaded package.json from `%s`', opts.dir);

  opts.jsfmtConfig = jsfmt.getConfig();
  debug('loaded jshint config %j', opts.jsfmtConfig);

  async.series([
    resolve.bind(null, opts),
    format.bind(null, opts)
  ], function(err) {
    if (err) return done(err);
    done(null, opts.res);
  });
};
