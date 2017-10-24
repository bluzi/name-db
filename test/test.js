const assert = require('assert');
const fs = require('fs-extra');
const Validator = require('jsonschema').Validator;

describe('name files', () => {
    it('should contain valid JSON', done => {
        (async () => {
            const files = await fs.readdir('./collection');

            for (const fileName of files) {
                try {
                    const contents = await fs.readFile('./collection/' + fileName);
                    JSON.parse(contents);
                } catch (err) {
                    done(`Error in name file "${fileName}":\n${err}`);
                }
            }

            done();
        })();
    });
});

describe('schema specifications', () => {
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

        (async () => {
            const files = await fs.readdir('./collection');
            for (const fileName of files) {
                try {
                    const contents = await fs.readFile('./collection/' + fileName);
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
        })();
    });
});