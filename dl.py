import requests
import lxml.html
import json

site = 'http://ratos.zsmu.zp.ua/'


def get(url):
    result = requests.get(url)
    return lxml.html.document_fromstring(result.text)
doc = get('http://ratos.zsmu.zp.ua/testlog?session=731998')
test_name = doc.xpath('//h1')[0]
print(test_name.text_content())

data = []
for a in doc.xpath("//a"):
    res = ''
    href = a.attrib['href']
    d = get(site + href)
    question = d.xpath('//h1')[0]
    res += question.text_content() + ':::'

    id = d.xpath('//input[@name="id"]/@value')[0]
    res += id + ':::'
    answers = []

    for u in d.xpath("//*[@class='td_missing']"):
        answers.append({"name": u.text_content(), 'correct': 1})
        res += '+' + u.text_content() + ':::'
    for u in d.xpath("//*[@class='td_right']"):
        answers.append({"name": u.text_content(), 'correct': 1})
        res += '+' + u.text_content() + ':::'
    for u in d.xpath("//*[@class='td_none']"):
        answers.append({"name": u.text_content(), 'correct': 0})
        res += '-' + u.text_content() + ':::'
    print(res)
    obj = {"id": id, "name": question.text_content(), "answers": answers}
    data.append(obj)
with open('data.txt', 'w') as outfile:
    json.dump(data, outfile, ensure_ascii=False)
