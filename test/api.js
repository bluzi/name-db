const assert = require('assert');
const request = require("supertest");
// const path = require("path");
// const { readdirSync } = require("fs");

const app = require("../api/app");
const { closeConnection: closeDbConnection } = require("../api/utils");

describe("api", () => {
	describe("GET /", () => {
		it("Should answer with state: running", () =>
			request(app)
				.get("/")
				.set('Accept', 'application/json')
				.expect(200)
				.then(({body}) => {
					assert.deepStrictEqual(body, { state: "running" })
				})
		);
	});

	describe("GET /:name", () => {
		it("Should answer with the name object if the name exists", () => {
			const tryName = name => request(app)
				.get(`/${name}`)
				.set('Accept', 'application/json')
				.expect(200)
				.then(({body}) => {
					assert.strictEqual(typeof body, "object");
					assert.strictEqual(typeof body.name, "string");
					assert.strictEqual(typeof body.meaning, "string");
					assert.ok(body.translations instanceof Array);
					body.translations.forEach(translation => {
						assert.strictEqual(
							typeof translation.languageCode,
							"string"
						);
						assert.strictEqual(
							typeof translation.language,
							"string"
						);
						assert.strictEqual(
							typeof translation.value,
							"string"
						);
					});
				});

			// Disabled because not all names are present on the public database
			/*const names = readdirSync(path.join(__dirname, "../collection"))
				.map(n => n.match(/(.+)\.json/)[1])*/

			const names = ["aaron", "benjamin", "daniel"];

			return Promise.all(names.map(tryName));
		});

		it("Should answer with 404 when not given a valid name", () =>
			request(app)
				.get("/sdgferyewrr")
				.set('Accept', 'application/json')
				.expect(404)
				.then(({body}) => {
					assert.strictEqual(body.err, true);
					assert.strictEqual(typeof body.debug, "string");
				})
		);
	});

	after(() => closeDbConnection());
});
