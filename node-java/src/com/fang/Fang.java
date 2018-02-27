package com.fang;

public class Fang {
	private int a;
	public int b = 10;
	public static int c = 42;

	public Fang(Integer a) {
		this.a = a;
	}

	public int getInt() {
		return a;
	}

	public static void Test() {
		System.out.println("hello world");
	}
	public static int addNumbers(int a, int b) {
		return a + b;
	}
}
