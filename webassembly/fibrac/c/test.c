#include <stdio.h>
#include <time.h>

int fibrac(int x) {
    if (x == 1 || x == 2) {
        return 1;
    }
    return fibrac(x - 1) + fibrac(x - 2);
}
int main() {
    int start = clock();
    int a = fibrac(50);
    int end = clock();
    printf("=======%d\n", a);
    printf("=======%d\n", end-start);
}
