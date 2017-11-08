const assert = require('assert');
const fs = require('fs-extra');
const Validator = require('jsonschema').Validator;
const path = require('path');
const iso6393 = require('iso-639-3');
const {assertAlphabetFor} = require('./alphabet-helper');

const files = fs.readdirSync('./collection');

describe('name files', () => {
    it('should contain valid JSON', () => {
        for (const fileName of files) {
            try {
                const contents = fs.readFileSync('./collection/' + fileName);
                JSON.parse(contents);
            } catch (err) {
                throw new Error(`Error in name file "${fileName}":\n${err}`);
            }
        }
    });

    it('should contain a lowercase name, same as the filename', () => {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);
            assert.ok(json.name === json.name.toLowerCase(), 'name is not lowercase');
            assert.ok(json.name === path.basename(fileName, '.json'), 'fileName should match the name');
        }
    });

    it('should not have duplicate names', () => {
        const names = [];

        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);
            names.push(json.name);
        }

        const isDuplicate = (new Set(names).size !== names.length);
        assert.equal(isDuplicate, false);
    });

    it('should have ISO-639-3 language codes', () => {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);

            for (const languageCode in json.translations) {
                const lookup = iso6393.find(o => o.iso6393 === languageCode);

                if (!lookup) {
                    throw new Error(`${languageCode} is not a valid ISO-639-3 language code in ${fileName}`);
                }
            }
        }
    });

    it('should have correct structure', () => {
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
                throw new Error(`Error in name file "${fileName}":\n${err}`);
            }
        }
    });
});

describe('Translations', () => {

    it('should be lowercase', () => {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);
            const translations = json.translations || {};
            const keys = Object.keys(translations)

            const allLowerCase = keys.reduce(
                (allLowerCase, key) => allLowerCase && (
                    translations[key] === translations[key].toLowerCase()
                ), true
            );

            assert.equal(allLowerCase, true);
        }
    });

    describe('all chars should be in the lang alphabet', () => {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);
            const translations = json.translations || {};
            const langs = Object.keys(translations)

            it(`for translations of ${json.name}`, () => {
                langs.forEach( (l)=> assertAlphabetFor(l, translations[l]) );
            });
        }
    });
});
