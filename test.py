import requests as req

print("Create User: "+req.get("http://localhost:1234/?action=create&target=user&username=nick&password=hmac").text)
print()

print("Create Conversation: "+req.get("""http://localhost:1234/?action=create&target=conversation&username=nick&password=hmac&data={"authUsers":["john","nick"],"title":"conversationTitle"}""").text)
print()

print("Request Conversation: "+req.get("""http://localhost:1234/?action=request&target=conversation&username=nick&password=hmac""").text)
print()

print("Create Message: "+req.get("""http://localhost:1234/?action=create&target=message&username=nick&password=hmac&id=13&data={"authConversation": 13,"sender": "nick","content": "Hi M!"}""").text)
print()

print("Request message: "+req.get("""http://localhost:1234/?action=request&target=message&username=nick&password=hmac&id=13""").text)
print()
