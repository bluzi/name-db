const assert = require('assert');
const fs = require('fs-extra');
const Validator = require('jsonschema').Validator;
const path = require('path');
const iso6393 = require('iso-639-3');

const files = fs.readdirSync('./collection');

describe('name files', function () {
    it('should contain valid JSON', function () {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            JSON.parse(contents);
        }
    });

    it('should contain a lowercase name, same as the filename', function () {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);
            assert.ok(json.name === json.name.toLowerCase(), 'name is not lowercase');
            assert.ok(json.name === path.basename(fileName, '.json'), 'fileName should match the name');
        }
    });

    it('should not have duplicate names', function () {
        const names = [];

        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            var json = JSON.parse(contents);
            names.push(json.name);
        }

        var isDuplicate = (new Set(names).size !== names.length);
        assert.equal(isDuplicate, false);
    });

    it('should have ISO-639-3 language codes', function () {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);

            for (const languageCode in json.translations) {
                const lookup = iso6393.find(o => o.iso6393 == languageCode);

                if (!lookup) {
                    assert.fail(`${languageCode} is not a valid ISO-639-3 language code in ${fileName}`);
                }
            }
        }
    });

    it('should have correct structure', function () {
        const jsonValidator = new Validator();

        // create the schema for valid name objects
        const nameFileSchema = {

            'type': 'object',
            'properties': {
                'name': {
                    'required': true,
                    'type': 'string'
                },
                'meaning': {
                    'required': true,
                    'type': 'string'
                },
                'alias': {
                    'required': false,
                    'type': 'array'
                },
                'translations': {
                    'type': 'object',
                    'patternProperties': {
                        '^(?!eng)[a-z]{3}$': {
                            'type': 'string'
                        }
                    },
                    'additionalProperties': false
                }
            }
        };

        for (const fileName of files) {

                const contents = fs.readFileSync('./collection/' + fileName);
                const json = JSON.parse(contents);

                // Validate all the name files file against the defined schema above
                const validationResult = jsonValidator.validate(json, nameFileSchema, { throwError: true });

                // Ensure there are no validation errors
                assert.equal(validationResult.errors.length, 0);
        }
    });
});
