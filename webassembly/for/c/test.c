#include <stdio.h>
#include <time.h>

long cal(long x) {
    if (x < 100) {
        return x + 10;
    } else if (x < 1000) {
        return 3*x - 20;
    }
    return x * 2 - 30;
}
int main() {
    int start = clock();
    long a;
    for (long i=0; i<3000000000; i++) {
        a = cal(i);
    }
    int end = clock();
    printf("=======%ld\n", a);
    printf("=======%d\n", (end-start)/1000);
}
