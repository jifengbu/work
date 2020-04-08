

public class Test {
	private int fibrac(int x) {
	    if (x == 1 || x == 2) {
	        return 1;
	    }
	    return fibrac(x - 1) + fibrac(x - 2);
	}
	public static void main(String[] args) {
		Test test = new Test();
		long start = System.currentTimeMillis();
		int a = test.fibrac(50);
		long end = System.currentTimeMillis();
		System.out.println("=======" + a);
		System.out.println("=======" + (end-start));
	}
}
