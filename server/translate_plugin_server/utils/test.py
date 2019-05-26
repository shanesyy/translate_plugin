import requests
import json

def test1():
	data = {'text': '极限', 'src': 'zh-cn', 'dst': 'en'}
	body = json.dumps(data, ensure_ascii=False).encode('utf8')
	url = "http://localhost:12000/translate_service"
	res = requests.post(url=url, data=body)
	if res.status_code == 200:
		print(json.loads(res.text))