"use strict";

const assert = require('assert');
const unicharadata = require("unicharadata");

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
 Sources to discover the alphabet and language relation:
 http://www-01.sil.org/iso639-3/codes.asp
 https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 https://en.wikipedia.org/wiki/List_of_languages_by_writing_system
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var alphabet = {
    ARABIC: 'aao ara arb fas pes peo urd',
    ARMENIAN: 'hye',
    BALINESE: 'ban',
    BENGALI: 'ben',
    CJK: 'cmn czh zho',
    CYRILLIC: 'bel bul cro mkd mon rus srp ukr',
    DEVANAGARI: 'hin mar nep',
    GEORGIAN: 'kat',
    GREEK: 'ell gmy',
    GUJARATI: 'guj',
    GURMUKHI: 'pan',
    HANGUL: 'kor',
    HEBREW: 'heb idh yid',
    KANNADA: 'kan',
    KATAKANA: 'jpn',
    LAO: 'lao',
    LATIN: 'aae afr aze cat ces eng epo dan deu dse fra fin gae gct ghc gle hun isl ibo ita ise lat lim lit mri nld nno nor pol por rms rom ron slk slv spa swe tkm tur vie wlm zul',
    MALAYALAM: 'mal',
    SINHALA: 'sin',
    TAMIL: 'tam',
    TELUGU: 'tel',
    THAI: 'tha'
}
for (var a in alphabet) alphabet[a] = alphabet[a].split(' ');

const findAlphabetForLang = exports.findAlphabetForLang = function (lang) {
  for (var a in alphabet) if (alphabet[a].indexOf(lang) > -1) return a;
  return null;
}

const findAlphabetForChar = exports.findAlphabetForChar = function (char) {
  return unicharadata.lookupname(char).split(/ |-/)[0];
}

const ignorable = function(char, alphabet) {
  return alphabet === 'COMBINING' || alphabet === 'APOSTROPHE' || char === ' '
}

exports.assertAlphabetFor = function(lang, text) {
    var alphabet = findAlphabetForLang(lang);
    if (!alphabet) {
        let matchAlphabet = findAlphabetForChar(text[0]);
        assert.fail(
          `We do not know the correct alphabet for "${lang}" lang.\n` +
          `It may be ${matchAlphabet}. Please ensure it and update ${__filename}.`
        );
    }
    for (var i=0; i<text.length; i++) {
        let char = text[i];
        let matchAlphabet = findAlphabetForChar(char);
        if (matchAlphabet !== alphabet && !ignorable(char, matchAlphabet))
            assert.fail(
              `The char "${char}" of "${text}" is ${matchAlphabet},` +
              ` expected to be ${alphabet} (lang ${lang}).`
            );
    }
    assert.ok(alphabet);
}
