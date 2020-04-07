# coding:utf-8
print("1 This is test.py")
import hello

print("2 This is test.py")
print(type(hello))
print(hello)
print(hello.text)
hello.function()

print("1 This is test.py")
import hello as hl

print("2 This is test.py")
print(type(hl))
print(hl)
print(hl.text)
hl.function()


from hello import text
print(text)

from hello import function
function()
