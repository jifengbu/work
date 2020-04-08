# coding:utf-8
import time

def fibrac(x):
    if (x == 1 or x == 2):
        return 1
    return fibrac(x - 1) + fibrac(x - 2)


start = time.clock()
a = fibrac(45);
end = time.clock()
print("=======", a);
print("=======", (end-start)*1000);
