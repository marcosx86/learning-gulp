var http = require('http'),
    fs = require('fs'),
    Readable = require('stream').Readable,
    through = require('through2'),
    gutil = require('gulp-util'),
    Vinyl = require('vinyl');

module.exports = function() {

  var transform = function(file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file)
    }

    var that = this;

    var proj = {};
    proj.APIKey = "/* Your API Key */";
    proj.APIPwd = "/* Your API Password */";
    proj.Name = "My Project";
    proj.ReorderCode = true;
    proj.ReplaceNames = true;
    proj.EncodeStrings = true;
    proj.MoveStrings = true;
    proj.MoveMembers = true;
    proj.DeepObfuscate = true;
    proj.SelfCompression = true;
    proj.CompressionRatio = "Auto";
    proj.OptimizationMode = "Auto";

    var appJS = new Object();
    appJS.FileName = "app.js";
    appJS.FileCode = file.contents.toString('utf8');

    proj.Items = [appJS];

    var postData = JSON.stringify(proj);

    // gutil.log ("Lenght: " + Buffer.byteLength(postData, 'utf-8'))

    var options = {
      host: 'service.javascriptobfuscator.com',
      path: '/HttpApi.ashx',
      method: 'POST',
      headers: {
        'Content-Type': 'text/json',
        'Content-Length': Buffer.byteLength(postData, 'utf-8')
      }
    };

    postCallback = function(response) {

      response.setEncoding('utf8');
      var str = '';
      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('end', function() {

        // gutil.log(JSON.stringify(JSON.parse(str), null, '  '));
        var resObj = JSON.parse(str);

        var fileStream = new Readable();
        fileStream.push(resObj.Items[0].FileCode);
        fileStream.push(null);

        var jsFile = new Vinyl({
          cwd: file.cwd,
          base: file.base,
          path: file.path,
          contents: fileStream
        });

        that.push(jsFile);
        callback();
      });
    }

    var req = http.request(options, postCallback);
    req.write(postData);
    req.end();

  };

  return through.obj(transform);
};