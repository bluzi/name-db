[![Build Status](https://travis-ci.org/bluzi/name-db.svg?branch=master)](https://travis-ci.org/bluzi/name-db)

# name-db
> `name-db` is a collection of names in all languages. Our goal is to collect as much data as we can, and to provide an open-source free API for name translations.

## Specs

*name-db* currently stores only **first names**.

Each name is stored in a JSON file, located in `collection/`. The following is the structure of a name file:

**`collection/{lowercase name}.json:`**

```js
{
    "name": "", // English name, lowercase, coresponding to the filename
    "meaning": "", // The meaning of the name, in English
    "aliases": [], // An array of lowercase alias names, such as: richard -> dick, daniel -> dan, etc.
    "translations": {
        "{lowercase ISO-639-3 language code}": "{translation}" 
    },
    "sex": "" // (Optional) Gender of the name. Use a single, lowercase letter: `m` for male, `f` for female or `u` for unisex (names that can be male or female).
}
``` 

**Example:**

**`collections/jonathan.json`**

```js
{
    "name": "jonathan",
    "meaning": "Hebrew for \"YHWH has given\"",
    "aliases": [
        "johnathan",
        "john",
        "yonathan"
    ], 
    "translations": {
        "heb": "ג'ונתן" 
    },
    "sex": "m"
}
``` 

The language codes are [ISO 639-3](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) codes. For a list of language codes, please see: https://en.wikipedia.org/wiki/List_of_ISO_639-3_codes

> Note that everything except the translations should be in English.

## API
The API is still under development, but you can see the latest stable version [here](http://54.161.117.62/david)
Note that you shouldn't use it in production yet - We still don't have enough data, and the endpoint is running on a cheap machine.
Feel free to [view the code](https://github.com/bluzi/name-db/tree/master/api), suggest features or create new features with a pull request - we're looking for help with the API.

## Test it Locally

### Database
To deploy the app you need a *MariaDB* or a *MySQL* instance running and a database named 'name-db'. To create the db schema you need to download [liquibase](http://download.liquibase.org/download/?frm=n) and then configure the [properties](database/liquibase.properties) to your DB instance. Once installed, you just need to run the following command:

```
$ liquibase --changeLogFile="database/changesets/changeset0-0-0-1.xml" update
```

### Data
Running the command `node deploy/deploy.collection.js` will fill the DB with the names collection.

### Server
The last configuration you must do is on the [utils](api/utils.js) file. Change the data on `mysqlConfig` for your DB credentials or create the required ENVs and you will be set.

Lastly execute the command `npm run start` and the server will be up. Test the API [here](http://localhost:3000).

## Contribution (Easy PR, large impact!)

Making a contribution is real easy - just read the specs, and do one of these:
- Add your/a name (if it doesn't exist yet)
- Add a translation to existing name
- Add meanings to existing names
- Correct translations / meanings
- Come up with a way we can do things better, and [create an issue](https://github.com/bluzi/name-db/issues)

**Also, feel free to take a few aliases that doesn't have a file, and create their files.**

**Just fork the repository, do one of the tasks above, make a pull request and we'll approve it.**

## License

This project is licensed under the MIT License.
