package zdxz;

import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

/* loaded from: 地心探险(地心游记).jar:zdxz/e.class */
public final class e {
    int d;
    int o;
    int k;
    int y;
    int f;
    int Q;
    int s;
    int c;
    int x;
    boolean v;
    boolean K;
    boolean r;
    boolean w;
    boolean G;
    boolean l;
    boolean q;
    int z;
    int I;
    int b;
    int m;
    int[] i;
    int a;
    Image[] O;
    int D;
    int j = 10;
    int J = 100;
    int C = 0;
    int[] M = {0, 0, 0, 0, 0, 0, 0, 0};
    int P = 0;
    int B = 0;
    int R = -1;
    int[][] A = {new int[]{0, 0, 5, 5}, new int[]{21, 0, 5, 6}, new int[]{42, 0, 5, 5}, new int[]{63, 0, 1, 4}, new int[]{80, 0, 5, 6}, new int[]{0, 21, 0, 6}, new int[]{21, 22, 0, 5}, new int[]{42, 21, 0, 5}, new int[]{63, 29, 7, 5}, new int[]{86, 22, 2, -5}, new int[]{86, 33, 5, 5}, new int[]{0, 43, 0, 5}, new int[]{22, 43, 6, 5}, new int[]{44, 42, 1, 7}, new int[]{0, 66, 5, 7}, new int[]{23, 67, 1, 4}, new int[]{39, 67, 1, 4}, new int[]{63, 55, 6, 8}, new int[]{85, 56, 0, 6}, new int[]{0, 89, 2, 0}, new int[]{19, 92, 1, -5}, new int[]{43, 92, 9, -5}, new int[]{67, 82, 8, 7}, new int[]{89, 78, 1, 11}};
    final int[] F = {2, 1, 2, 0};
    final int[] E = {2, 12, 16, 16};
    final int[] H = {2, 18, 18, 20};
    final int[] t = {7, 5, 7, 6};
    final int[] g = {7, 11, 15, 15};
    final int[] u = {7, 22, 22, 21};
    final int[] e = {4, 8, 3, 3};
    final int[] p = {13, 10, 17, 23};
    final int[] h = {4, 19, 9, 9};
    final int[] L = {14, 14, 14, 14};
    final int[] N = {13, 4, 13, 4};
    int n = 1;

    public final void d() {
        this.o = 3;
        this.c = 4;
        this.x = 7;
        this.w = false;
        this.K = false;
        this.f = 0;
        this.q = false;
        this.v = false;
        this.G = false;
        this.D = 0;
        this.s = 0;
        this.z = 1;
        this.I = this.J;
        a(this.e);
    }

    public final void b(int i) {
        this.I += i;
        if (this.I > this.J) {
            this.I = this.J;
        }
    }

    public final void a() {
        this.f = 3;
        this.z = 1;
        this.s = -1;
        this.v = true;
        a(this.L);
    }

    public final void c() {
        this.d++;
        this.d &= 3;
    }

    public final void a(Graphics graphics) {
        int i = this.i[this.d];
        graphics.drawImage(this.O[i], ((this.c * 20) - this.A[i][2]) + (this.s * this.D * 5) + 10, (((this.x - 8) * 20) - this.A[i][3]) + (this.f * this.z * 5) + 4, 20);
    }

    public final void b() {
        d();
        this.J = 100;
        this.n = 1;
        this.B = 0;
        this.j = 10;
        this.C = 0;
        this.b = 0;
        this.a = 0;
        this.P = 0;
        for (int i = 0; i < 8; i++) {
            this.M[i] = 0;
        }
    }

    public final void a(int[] iArr) {
        this.i = iArr;
        this.d = 0;
    }

    public final void a(Image[] imageArr) {
        this.O = imageArr;
    }

    public final void a(int i) {
        this.I -= i;
        if (this.I < 0) {
            this.I = 0;
        }
    }
}
