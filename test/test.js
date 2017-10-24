var assert = require('assert');
var fs = require('fs');

describe('names.json', function () {
    it('should contain valid JSON', function (done) {
        fs.readFile("./names.json", function (err, text) {
            if (err) done(err);
            var json = JSON.parse(text, 'utf8');
            done();
        });
    });

    it('should be UTF-8 encoded', function (done) {
        var chardet = require('chardet');
        
        chardet.detectFile('./names.json', function (err, encoding) {
            if (err) done(err);
            
            assert.equal(encoding, 'UTF-8');
            done();
        });
    });
});
