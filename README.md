[![Build Status](https://travis-ci.org/bluzi/name-db.svg?branch=master)](https://travis-ci.org/bluzi/name-db)

## name-db
*name-db* is a collection of names in all languages. Our goal is to collect as much data as we can, and to provide an open-source free API for name translations.

# Important notice for returning contributiors
*names.json* is *deprecated*. From now on, names are stored in *collection/* directory. Each name has a seperated file. 
The structure of the name object is the same.

# Specs
*name-db* currently stores only **first names**.
Each name is stored in a JSON file, located in *collection/*. The following is the structure of a name file:

collection/{lowercase name}.json:
```js
{
    "name": "", // English name, lowercase, coresponding to the filename
    "meaning": "", // The meaning of the name, in English
    "aliases": [], // An array of lowercase alias names, such as: richard -> dick, daniel -> dan, etc.
    "translations": {
        "{loewrcase ISO-639-3 language code}": "{translation}" 
    }
}
``` 

Example:
collections/jonathan.json
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
    }
}
``` 

The language codes are [ISO 639-3](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) codes. For a list of language codes, please see: https://en.wikipedia.org/wiki/List_of_ISO_639-3_codes

Note that everything except the translations should be in English.

# Contribution (Easy PR, large impact!)
Making a contribution is real easy - just read the specs, and do one of these:
- Add your/a name (if it doesn't exist yet)
- Add a translation to existing name
- Add meanings to existing names
- Correct translations / meanings
- Come up with a way we can do things better, and [create an issue](https://github.com/bluzi/name-db/issues)

Also, feel free to take a few aliases that doesn't have a file, and create their files.

Just fork the repository, do one of the tasks above, make a pull request and we'll approve it.
