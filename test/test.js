var assert = require('assert');
var fs = require('fs');
var chardet = require('chardet');
var Validator = require('jsonschema').Validator;

describe('names.json', function () {
    it('should contain valid JSON', function (done) {
        fs.readFile("./names.json", function (err, text) {
            if (err) done(err);
            var json = JSON.parse(text);
            done();
        });
    });

    it('should be UTF-8 encoded', function (done) {
        chardet.detectFile('./names.json', function (err, encoding) {
            if (err) done(err);

            assert.equal(encoding, 'UTF-8');
            done();
        });
    });

    describe('schema specifications', function () {
        it('should have correct structure', function (done) {
            var v = new Validator();

            // create the schema for valid name objects
            var nameSchema = {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "required": true
                        },
                        "meaning": {
                            "required": true
                        },
                        "translations": {
                            "type": "object",
                            "patternProperties": {
                                // this part checks that the language code is lower case
                                // and only 3 characters
                                "^[a-z]{3}$": {
                                    "type": "string"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            };

            fs.readFile("./names.json", function (err, text) {
                if (err) done(err);
                var json = JSON.parse(text);

                // validate the names.json file against the defined schema above
                const validationResult = v.validate(json, nameSchema, { throwError: true });

                // ensure there are no validation errors
                assert.equal(validationResult.errors.length, 0);

                done();
            });
        });
    });
});
