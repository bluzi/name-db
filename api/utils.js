const mysql = require('mysql');
const iso6393 = require('iso-639-3');

const mysqlConfig = {
  host: '184.73.147.33' || process.env.host,
  user: 'github-limited-user' || process.env.user,
  password: '' || process.env.password,
  database: 'name-db' || process.env.database,
};

const db = mysql.createConnection(mysqlConfig);

db.connect(err => {
  if (err) return console.error('Could not connect to database: ' + err.message);

  console.log(`Connected to database on ${mysqlConfig.host}`);
});

module.exports.findName = (name) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT name FROM aliases WHERE name = ${db.escape(name)} OR alias = ${db.escape(name)} LIMIT 1`, (err, name, fields) => {
            if (err) return reject(err);
            if (!name || !name.length) return reject(`Could not find '${name}' in the database`);

            return module.exports.generatePublicObject(name[0].name).then(resolve).catch(reject);
        });
    });
}

module.exports.searchTerm = (term) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT name FROM aliases WHERE name LIKE ${db.escape('%'+term+'%')} OR alias LIKE ${db.escape('%'+term+'%')}`, (err, names, fields) => {
            if (err) return reject(err);
            if (!names || !names.length) return reject(`Could not find any names with term '${term}' in the database`);
            const promises = [];

            for (const name of names) {
                promises.push(module.exports.generatePublicObject(name.name));
            }

            return Promise.all(promises).then(resolve).catch(reject);
        });
    });
}

module.exports.generatePublicObject = (name) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM meanings WHERE name = ${db.escape(name)}`, (err, meaning, fields) => {
            if (err) return reject(err);
            if (!meaning || !meaning.length) return reject(`Could not find '${name}' in the database`);

            db.query(`SELECT * FROM translations WHERE name = ${db.escape(name)}`, (err, translations, fields) => {
                if (err) return reject(err);

                db.query(`SELECT * FROM aliases WHERE name = ${db.escape(name)}`, (err, aliases, fields) => {
                    if (err) return reject(err);

                    return resolve({
                        name: meaning[0].name,
                        meaning: meaning[0].meaning,
                        translations: translations.map(translation => ({ languageCode: translation.language, language: iso6393.find(o => o.iso6393 === translation.language).name, value: translation.value })),
                        aliases: aliases.map(alias => alias.alias),
                    });
                });
            });
        });
    });
}