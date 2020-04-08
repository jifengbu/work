# coding:utf-8
import time

def cal(x):
    if (x < 100):
        return x + 10
    elif (x < 1000):
        return 3*x - 20
    return x * 2 - 30


start = time.clock()
i=0
while i<30000000:
    a = cal(i)
    i+=1
end = time.clock()
print("=======", a);
print("=======", (end-start)*1000);
