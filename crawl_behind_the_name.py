import json, os

import requests
import pycountry

from bs4 import BeautifulSoup
from bs4.element import NavigableString

POTENTIAL_TRANSLATION_CATEGORY = ['OTHER SCRIPTS', 'OTHER LANGUAGES/CULTURES']

base_url = 'https://www.behindthename.com/name/{}'
jsons_path = os.getcwd() + '/collection'

json_files = [f for f in os.listdir(jsons_path) if os.path.isfile(os.path.join(jsons_path, f))]

countries = list(pycountry.countries)

translations = {}
total = len(json_files)
for index, json_file in enumerate(json_files):
    print('{}/{}'.format(index + 1, total))
    data = json.load(open(jsons_path + '/' + json_file))
    response = requests.get(base_url.format(data['name']))
    bs = BeautifulSoup(response.text, 'html.parser')
    translation = {}
    tag_nodes = bs.findAll('div', {'class': 'namesub'})
    for node in tag_nodes:
        for category in POTENTIAL_TRANSLATION_CATEGORY:
            if category in node.text:
                translations_data = list(node.find('span', {'class': 'info'}).children)
                mixed_translations = [element for element in translations_data if type(element) != NavigableString]
                names_for_translation = []
                while mixed_translations:
                    element = mixed_translations.pop(0)
                    if str(element).startswith('<b>'):
                        translation[element.text.replace('(', '').replace(')', '')] = names_for_translation[0]
                        names_for_translation = []
                    else:
                        names_for_translation.append(element.text)
    if translation:
        for language in translation.keys():
            primary_language = language.split(',')[0]
            try:
                lang = pycountry.languages.lookup(primary_language.lower())
            except:
                continue
            if 'translations' not in data:
                data['translations'] = {}
            if lang.alpha_3 not in data['translations']:
                data['translations'][lang.alpha_3] = translation[language]
        with open(json_file, 'w+') as f:
            f.write(json.dumps(data, indent=4, sort_keys=True))
        translations[json_file.split('.')[0]] = translation

with open('crawler_output.json', 'w+') as f:
    f.write(json.dumps(translations, indent=4, sort_keys=True))
