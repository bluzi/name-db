#!/usr/bin/env node

const mysql = require('mysql');
const fs = require('fs');

const collection = fs.readdirSync('collection/')
    .map(fileName => fs.readFileSync('collection/' + fileName))
    .map(fileContents => JSON.parse(fileContents));

const [ env, command, host, user, password, database ] = process.argv;
const mysql_creds = {
    host: host || process.env.host,
    user: user || process.env.user,
    password: password || process.env.password,
    database: database || process.env.database,
};

const tasks = {
    pipe: [meanings, aliases, translations],
    next: () => tasks.pipe.length > 0 ? tasks.pipe.shift()() : db.end(err => err ? console.error(err.message) : console.log('Bye!')),
}


const db = mysql.createConnection(mysql_creds);

console.log(`trying to connect to ${mysql_creds.user}@${mysql_creds.host}/${mysql_creds.database}...`)

db.connect(err => err ? console.error('failed. ' + err.message) : console.log('success\n') || tasks.next());

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