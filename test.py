import requests as req

r = req.get("http://localhost:1234/?action=create&target=user&username=nick&password=hmac")
print(r.text)
