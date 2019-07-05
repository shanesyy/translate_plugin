from googletrans import Translator as GoogleTrans
from datamuse import datamuse

translator = GoogleTrans()
similar_finder = datamuse.Datamuse()

def get_translation(word, src, dest='en'):
    if src:
        res = translator.translate(word, src=src, dest=dest)
    else:
        res = translator.translate(word, dest=dest)
    translation = {}
    translation['target'] = word
    translation['result'] = res.text
    translation['from_google'] = []
    translation['extra_similarity'] = []
    if res.extra_data['all-translations']:
        for item in res.extra_data['all-translations']:
            translation['from_google'].append((item[0], [i[:2]+i[3:] for i in item[2]]))
    if len(translation['from_google']) <= 1:
        text = res.text
        # datamuse only support english similar words right now
        if dest == 'en':
            similars = similar_finder.words(ml=text, max=4)
            for item in similars:
                translation['extra_similarity'].append([item['word'], 
                                                     [i for i in item.get("tags", []) if i != 'syn'], 
                                                     item['score']])
    print(translation)
    return translation


if __name__ == "__main__":
    word = '相似'
    translation = get_translation(word)
    print(translation)


