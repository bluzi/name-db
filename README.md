## name-db
*name-db* is a collection of names in all languages. Our goal is to collect as much data as we can, and to provide an open-source free API for name translations.

# Specs
*name-db* currently stores only **first names**, in a *UTF-8* JSON format.
*names.json* is an array of *name objects*. Each *name object* has the following structure:

```js
{
    "name": "", // English name
    "meaning": "", // The meaning of the name, in English
    "translations": {
        "{language code}": "{translation}" 
    }
}
``` 

The language codes are [ISO 639-3](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) codes.
Note that everything except the translations should be in English.

# Contribution (Easy PR, large impact!)
Making a contribution is real easy - just read the specs, and do one of these:
- Add your name (if it doesn't exist yet)
- Add a translation to existing name
- Add meanings to existing names
- Correct translations / meanings
- Come up with a way we can do things better, and [create an issue](https://github.com/bluzi/name-db/issues)

Just fork the repository, do one of the tasks above, make a pull request and we'll approve it.
