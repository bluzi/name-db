const assert = require('assert');
const fs = require('fs-extra');
const Validator = require('jsonschema').Validator;
const path = require('path');
const langs = require('langs');

const files = fs.readdirSync('./collection');

describe('name files', () => {
    it('should contain valid JSON', done => {
        (async () => {
            for (const fileName of files) {
                try {
                    const contents = fs.readFileSync('./collection/' + fileName);
                    JSON.parse(contents);
                } catch (err) {
                    done(`Error in name file "${fileName}":\n${err}`);
                }
            }

            done();
        })();
    });

    it('should contain a lowercase name, same as the filename', done => {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);
            assert.ok(json.name === json.name.toLowerCase(), 'name is not lowercase');
            assert.ok(json.name === path.basename(fileName, '.json'), 'fileName should match the name');
        }

        done();
    });

    it('should not have duplicate names', done => {
        const names = [];

        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            var json = JSON.parse(contents);
            names.push(json.name);
        }

        var isDuplicate = (new Set(names).size !== names.length);
        assert.equal(isDuplicate, false);
        done();
    });

    it('should have valid language code', done => {
        const ISOcodes = langs.codes("3")

        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            var languageCodes = JSON.parse(contents).translations == null ? new Array() :
            Object.keys(JSON.parse(contents).translations);

            var languageCodesPresent = languageCodes
                                      .every((code) => {return ISOcodes.indexOf(code) >= 0})
            assert.equal(languageCodesPresent,true);
        }

        done();
    });

    it('should have correct structure', done => {
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
            try {
                const contents = fs.readFileSync('./collection/' + fileName);
                const json = JSON.parse(contents);

                // Validate all the name files file against the defined schema above
                const validationResult = jsonValidator.validate(json, nameFileSchema, { throwError: true });

                // Ensure there are no validation errors
                assert.equal(validationResult.errors.length, 0);
            } catch (err) {
                done(`Error in name file "${fileName}":\n${err}`);
            }
        }

        done();
    });
});
