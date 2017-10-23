var assert = require('assert');

describe('names.json', function () {
    it('should contain valid JSON', function () {
        var names = require.main.require('names.json');
    });
});
