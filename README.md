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
    }
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
    }
}
``` 

The language codes are [ISO 639-3](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) codes. For a list of language codes, please see: https://en.wikipedia.org/wiki/List_of_ISO_639-3_codes

> Note that everything except the translations should be in English.

## API
The API is still under development, but you can see the latest stable version [here](http://54.161.117.62/david)
Note that you shouldn't use it in production yet - We still don't have enough data, and the endpoint is running on a cheap machine.
Feel free to [view the code](https://github.com/bluzi/name-db/tree/master/api), suggest features or create new features with a pull request - we're looking for help with the API.

## Translation Crawler

The crawler lookups translations for the existing data, writing it's output back on files/ adding it to a external file named `crawler_output.json` which may be found in the root of this repo.

In order to run it, as dependencies, `python3` and `virtualenv` has to be installed on the machine, running under a *NIX based OS.

### Installation

1) run virtualenv --python python3 venv
2) source venv/bin/activate
3) pip install -r requirements.txt

### Run

In order to run, use `python crawler_behind_the_names.py` in the terminal. A small output of how many names have been crawled out of how many there are have been parsed.

ENJOY!

P.S. If anything seems off, or you need support with anything, feel free to contact [me](emailto:virgil.luta@gmail.com).

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
