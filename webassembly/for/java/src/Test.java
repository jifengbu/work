

public class Test {
	private long cal(long x) {
		if (x < 100) {
	        return x + 10;
	    } else if (x < 1000) {
	        return 3*x - 20;
	    }
	    return x * 2 - 30;
	}
	public static void main(String[] args) {
		Test test = new Test();
		long start = System.currentTimeMillis();
		long a = 0;
	    for (long i=0; i<3000000000L; i++) {
	        a = test.cal(i);
	    }
		long end = System.currentTimeMillis();
		System.out.println("=======" + a);
		System.out.println("=======" + (end-start));
	}
}
