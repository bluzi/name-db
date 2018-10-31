const assert = require('assert');
const fs = require('fs-extra');
const Validator = require('jsonschema').Validator;
const path = require('path');
const iso6393 = require('iso-639-3');

const files = fs.readdirSync('./collection');

describe('name files', () => {
    it('should contain valid JSON', () => {
        for (const fileName of files) {
            try {
                const contents = fs.readFileSync('./collection/' + fileName);
                JSON.parse(contents);
            } catch (err) {
                throw new Error(`Error in name file "${fileName}": Invalid JSON file \n${err}`);
            }
        }
    });

    it('should contain a lowercase name, same as the filename', () => {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);
            assert.ok(json.name === json.name.toLowerCase(), `name property "${json.name}" in "${fileName}" is not lowercase`)
            assert.ok(json.name === path.basename(fileName, '.json'), `name property "${json.name}" in "${fileName}" does not match the file name`);
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
        const duplicatedNames = names.filter((name, index) => names.indexOf(name) != index);
        assert.equal(isDuplicate, false, `duplicated names are not allowed, names duplicated: ${[...new Set(duplicatedNames)].join(', ')}`);
    });

    it('should have ISO-639-3 language codes', () => {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);

            for (const languageCode in json.translations) {
                const lookup = iso6393.find(o => o.iso6393 === languageCode);

                if (!lookup) {
                    throw new Error(`${languageCode} is not a valid ISO-639-3 language code in "${fileName}"`);
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
                },
                'sex': {
                    'required': false,
                    'type': 'string'
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

            for (const key of keys) {
                assert.equal(translations[key], translations[key].toLowerCase(), `"${translations[key]}" translation in "${fileName}" is not lowercase`);
            }
        }
    })
});

describe('Sex', () => {
    it('should be "m", "f" or "u"', () => {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);
            const sex = json.sex;
            const sexParams = ["m","f","u"];

            if (sex != null) {
                // assert.equal takes three parameters: actual value, expected value, and an optional error message)
                assert.equal(sexParams.indexOf(sex) !== -1, true, `sex property "${sex}" in "${fileName}" does not match expected values "m", "f" or "u"`);
            }
        }
    });  
         
    it('should be lowercase', () => {
        for (const fileName of files) {
            const contents = fs.readFileSync('./collection/' + fileName);
            const json = JSON.parse(contents);
            const sex = json.sex;

            if (sex != null) {
                assert.equal(sex, sex.toLowerCase(), `sex property "${sex}" in "${fileName}" is not lowercase`);
            }
        }
    });
});