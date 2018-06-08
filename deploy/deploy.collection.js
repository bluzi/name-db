#!/usr/bin/env node

const mysql = require('mysql');
const fs = require('fs');
const { version } = require('../package.json');
const deploy = require('commander');
const promptly = require('promptly');

// define db variable.
let db;

// get names collection.
const collection = fs.readdirSync('collection/')
    .map(fileName => fs.readFileSync('collection/' + fileName))
    .map(fileContents => JSON.parse(fileContents));

// create tasks object.
const tasks = {
    pipe: [meanings, aliases, translations],
    next: () => tasks.pipe.length > 0 ? tasks.pipe.shift()() : db.end(err => err ? console.error(err.message) : console.log('Bye!')),
}

// set deploy command options.
deploy
    .version(version, '-v, --version')
    .description('Will deploy the collection data into the DB.')
    .option('-H, --host <host>', 'DB host value without a port.', process.env.host)
    .option('-u, --user <user>', 'DB user.', process.env.user)
    .option('-N --db-name <db-name>', 'DB name.', process.env.database)
    .option('-p, --password [password]', 'Will ask for your password.', process.env.password)
    .parse(process.argv);

// validate if the -p flag was used without an argument.
if (typeof deploy.password === 'boolean') {
    // ask for a password and on result, deploy the collection data.
    (async () => await promptly.password('password: '))()
        .then((pass) => {
                deploy.password = pass;
                deployData();
            })
        .catch((err) => {
            if (err) console.log(`\n${err.message}...`);
        });
// just deploy the collection data.
} else {
    deployData();
}

/**
 * Create mysql connection and run defined tasks.
 */
function deployData() {
    const mysql_creds = {
        host: deploy.host,
        user: deploy.user,
        password: deploy.password,
        database: deploy.dbName,
    };

    // validate mysql credentials.
    if (!mysql_creds.host || !mysql_creds.user || !mysql_creds.database) {
        console.error(`Error: Database credentials may be empty. Please use the following options.`);
        deploy.help();
        process.exit(1);
    }

    db = mysql.createConnection(mysql_creds);
    
    console.log(`trying to connect to ${mysql_creds.user}@${mysql_creds.host}/${mysql_creds.database}...`)

    db.connect(err => err ? console.error('failed. ' + err.message) : console.log('success.\n') || tasks.next());
}

/**
 * Deploy meanings data into the database.
 */
function meanings() {
    db.query(`SELECT name, meaning FROM meanings`, (err, data, fields) => {
        const added = collection.filter(localEntry => !data.some(dbEntry => dbEntry.name === localEntry.name));
        const removed = data.filter(dbEntry => !collection.some(localEntry => localEntry.name === dbEntry.name));
        const changed = data
            .filter(dbEntry => {
                const localEntry = collection.find(localEntry => localEntry.name === dbEntry.name);
                if (!localEntry) return false;
                return localEntry.meaning !== dbEntry.meaning;
            })
            .map(dbEntry => collection.find(localEntry => localEntry.name === dbEntry.name));

        removed.forEach(entry => db.query(`DELETE FROM meanings WHERE name = ${db.escape(entry.name)}`));

        added.forEach(entry => db.query(`INSERT INTO meanings (name, meaning) VALUES (${db.escape(entry.name)}, ${db.escape(entry.meaning)})`));

        changed.forEach(entry => db.query(`UPDATE meanings SET meaning = ${db.escape(entry.meaning)} WHERE name = ${db.escape(entry.name)}`));

        console.log('meanings:');
        console.log(`found: ${collection.length}`);
        console.log(`added: ${added.length}`);
        console.log(`removed: ${removed.length}`);
        console.log(`changed: ${changed.length}\n`);

        tasks.next();
    });
}

/**
 * Deploy aliases data into the database.
 */
function aliases() {
    db.query(`SELECT name, alias FROM aliases`, (err, data, fields) => {
        const aliases = collection
            .reduce((arr, curr) => arr.concat((curr.aliases || []).map(alias => ({ name: curr.name, alias }))), []);

        const added = aliases.filter(localEntry => !data.some(dbEntry => dbEntry.name === localEntry.name && dbEntry.alias === localEntry.alias));
        const removed = data.filter(dbEntry => !aliases.some(localEntry => localEntry.name === dbEntry.name && dbEntry.alias === localEntry.alias));

        if (removed.length > 0) {
            db.query(`DELETE FROM aliases WHERE `
                + removed.reduce((arr, curr) => [...arr, `name = ${db.escape(curr.name)} AND alias = ${db.escape(curr.alias)}`], []).join(' OR '));
        }

        if (added.length > 0) {
            db.query(`INSERT INTO aliases (name, alias) VALUES `
                + added.reduce((arr, curr) => [...arr, `(${db.escape(curr.name)}, ${db.escape(curr.alias)})`], []).join(', '));
        }
     
        console.log('aliases:')
        console.log(`found: ${aliases.length}`);
        console.log(`added: ${added.length}`);
        console.log(`removed: ${removed.length}\n`);
        tasks.next();

    });
}

/**
 * Deploy translations data into the database.
 */
function translations() {
    db.query(`SELECT language, name, value FROM translations`, (err, data, fields) => {
        const translations = collection
            .reduce((arr, curr) =>
                arr.concat((Object.entries(curr.translations || {}))
                    .map(([language, value]) => ({ name: curr.name, language, value }))
                ), []
            );

        const added = translations.filter(localEntry => !data.some(dbEntry => dbEntry.language === localEntry.language && dbEntry.name === localEntry.name && dbEntry.value === localEntry.value));
        const removed = data.filter(dbEntry => !translations.some(localEntry => dbEntry.language === localEntry.language && dbEntry.name === localEntry.name && dbEntry.value === localEntry.value));

        if (removed.length > 0) {
            db.query(`DELETE FROM translations WHERE `
                + removed.reduce((arr, curr) => [...arr, `language = ${db.escape(curr.language)} AND name = ${db.escape(curr.name)} AND value = ${db.escape(curr.value)}`], []).join(' OR '));
        }

        if (added.length > 0) {
            db.query(`INSERT INTO translations (language, name, value) VALUES `
                + added.reduce((arr, curr) => [...arr, `(${db.escape(curr.language)}, ${db.escape(curr.name)}, ${db.escape(curr.value)})`], []).join(', '));
        }

        console.log('translations:')
        console.log(`found: ${translations.length}`);
        console.log(`added: ${added.length}`);
        console.log(`removed: ${removed.length}\n`);
        tasks.next();

    });
}