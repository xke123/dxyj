package zdxz;

import com.kimjunco.j2me.ConvKeyCanvas;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.Random;
import java.util.Timer;
import java.util.Vector;
import javax.microedition.lcdui.Font;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.rms.RecordStore;

/* loaded from: 地心探险(地心游记).jar:zdxz/b.class */
public final class b extends ConvKeyCanvas {
    int ad;
    int aq;
    Image r;
    int bI;
    boolean[][] bE;
    boolean[][] bC;
    private boolean bu;
    int by;
    int ci;
    f[][] cc;
    Image[] bv;
    Image[] aD;
    Image[] ao;
    Image[] aE;
    Image[] aP;
    int T;
    private byte[] aM;
    int az;
    static int G;
    static int i;
    int D;
    int bq;
    int aO;
    int aW;
    int y;
    int N;
    int bW;
    int bP;
    private boolean m;
    int as;
    Graphics cs;
    private boolean[] bs;
    e bL;
    Image[] cn;
    int ch;
    int f;
    boolean s;
    DataInputStream P;
    boolean ax;
    boolean aa;
    boolean e;
    boolean ar;
    boolean ba;
    boolean ai;
    boolean ae;
    boolean[][] bU;
    boolean aI;
    boolean cb;
    boolean bO;
    boolean bc;
    private boolean z;
    boolean aA;
    boolean bh;
    boolean am;
    boolean E;
    boolean bd;
    boolean ah;
    boolean x;
    boolean bB;
    boolean bT;
    boolean J;
    boolean cq;
    boolean B;
    boolean ct;
    int[] l;
    int[] bM;
    private int cl;
    int Z;
    Image[] at;
    int bj;
    int bK;
    int ap;
    int bY;
    int aB;
    int M;
    zdxz bD;
    int bQ;
    int aX;
    int bn;
    Image[] aj;
    int R;
    public static final byte[] aL = {-119, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82};
    public static final byte[] U = {0, 0, 0, 0, 73, 69, 78, 68, -82, 66, 96, -126};
    int au;
    Random cu;
    int bG;
    private RecordStore aN;
    int aZ;
    Image Y;
    int[] bN;
    public int bV;
    public int cp;
    int[] bA;
    int d;
    int aK;
    private Image o;
    int bS;
    Image[] V;
    Image[] aQ;
    Image[] I;
    Image[] c;
    Image[] t;
    Vector aY;
    boolean al;
    Timer b;
    c cj;
    int[] q;
    boolean bg;
    int bb;
    int K;
    int af = 5;
    int bf = 0;
    int p = 0;
    int bw = 0;
    int aC = 0;
    int n = 0;
    boolean A = false;
    boolean aG = true;
    int ay = 0;
    boolean bz = true;
    boolean aT = true;
    boolean bp = true;
    boolean k = true;
    boolean v = true;
    boolean bi = true;
    Image av = null;
    Image bZ = null;
    Image L = null;
    Image aF = null;
    Image cm = null;
    Image H = null;
    Image ck = null;
    Image u = null;
    Image be = null;
    Image h = null;
    Image w = null;
    Image cd = null;
    Image O = null;
    Image cg = null;
    Image bx = null;
    int X = 0;
    int j = 0;
    final int[] aJ = {0, 1, 0, 2};
    final int[] bl = {3, 4, 3, 5};
    final int[] aR = {9, 10, 9, 11};
    final int[] bX = {6, 7, 6, 8};
    Image bH = null;
    Image ak = null;
    Image S = null;
    Image F = null;
    Image aS = null;
    Image a = null;
    Image[] aw = null;
    Image[] co = null;
    Image[] cf = null;
    Image[] an = null;
    Image[] ac = null;
    Image[] aH = null;
    Image[] ag = null;
    Image[] bt = null;
    Image[] bR = null;
    Image[] C = null;
    Image[] aU = null;
    Image[] bo = null;
    Image[] br = null;
    Image bF = null;
    Image bm = null;
    Image bJ = null;
    int aV = 0;
    int ce = 0;
    boolean ab = true;
    int ca = 0;
    int bk = -1;
    final int[][] Q = {new int[]{1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 2}, new int[]{1, 15, 2, 11, 2, 4, 20, 2, 2, 1, 2, 2, 2, 2, 1, 1}, new int[]{1, 23, 2, 2, 24, 16, 2, 2, 1, 1, 1, 2, 8, 2, 1, 1}, new int[]{2, 22, 18, 2, 2, 2, 3, 1, 1, 1, 1, 1, 2, 2, 1, 1}, new int[]{2, 2, 17, 1, 5, 2, 2, 1, 1, 1, 1, 1, 1, 21, 1, 1}, new int[]{1, 2, 2, 1, 1, 1, 2, 2, 1, 14, 1, 1, 1, 2, 9, 2}, new int[]{1, 1, 13, 2, 1, 1, 6, 2, 1, 1, 1, 1, 1, 1, 2, 1}, new int[]{1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1}};
    final int[][] W = {new int[]{1, 5}, new int[]{4, 4}, new int[]{6, 6}, new int[]{2, 12}, new int[]{5, 14}, new int[]{1, 3}, new int[]{6, 2}};
    int cr = 13;
    int g = 2;

    static {
        int[] iArr = {0, 303, 710, 1103, 1611, 1999, 2377, 3133, 3844, 4164, 4575, 4778, 5039, 5399, 5957, 6489};
        int[] iArr2 = {303, 407, 393, 508, 388, 378, 756, 711, 320, 411, 203, 261, 360, 558, 532, 298};
    }

    /* JADX WARN: Type inference failed for: r1v71, types: [int[], int[][]] */
    /* JADX WARN: Type inference failed for: r1v73, types: [int[], int[][]] */
    public b(zdxz zdxzVar) {
        this.V = null;
        this.at = null;
        this.aj = null;
        this.bD = zdxzVar;
        setFullScreenMode(true);
        i = 176;
        G = 208;
        this.bA = new int[22];
        this.r = Image.createImage(i, G);
        this.cs = this.r.getGraphics();
        this.cu = new Random();
        this.bU = new boolean[8][9];
        this.aI = true;
        this.bS = 0;
        this.cc = new f[27][8];
        this.bE = new boolean[27][8];
        this.q = new int[216];
        this.l = new int[216];
        for (int i2 = 0; i2 < 27; i2++) {
            for (int i3 = 0; i3 < 8; i3++) {
                this.cc[i2][i3] = new f();
            }
        }
        this.bL = new e();
        this.y = 6;
        this.cl = 0;
        this.aY = new Vector();
        this.V = new Image[5];
        this.bC = new boolean[8][16];
        this.aj = new Image[12];
        this.cn = new Image[24];
        this.at = new Image[10];
        this.cs.setFont(Font.getFont(0, 0, 8));
        this.ae = az();
    }

    public final void ax() {
        if (this.al) {
            return;
        }
        for (int i2 = 26; i2 >= 0; i2--) {
            for (int i3 = 0; i3 < 8; i3++) {
                if (this.cc[i2][i3].h) {
                    this.cc[i2][i3].e = (this.cc[i2][i3].e + 1) & 15;
                    if (this.cc[i2][i3].e == 0) {
                        this.cc[i2][i3].h = false;
                        this.cc[i2][i3].a = true;
                    }
                } else if (this.cc[i2][i3].a) {
                    this.cc[i2][i3].b = (this.cc[i2][i3].b + 1) & 3;
                    if (this.cc[i2][i3].b == 0) {
                        this.cc[i2][i3].a = false;
                        this.cc[i2][i3].d = true;
                        this.cc[i2 + 1][i3].a(this.cc[i2][i3]);
                        this.cc[i2][i3].f = -1;
                        this.cc[i2][i3].b();
                    }
                }
            }
        }
    }

    public final void ai() {
        if (this.s) {
            this.T = (this.T + 1) & 3;
            if (this.T == 0) {
                this.s = false;
                if (this.ci < 0) {
                    this.cl++;
                    F();
                } else if (this.ci > 0) {
                    this.cl--;
                    Y();
                }
                this.ci = 0;
            }
        }
    }

    public final void ar() throws IOException {
        if (this.al) {
            return;
        }
        if (this.bL.v) {
            if (this.bL.o == 0) {
                this.bL.f--;
                if (this.bL.D == -3 || this.bL.D == 3) {
                    this.bL.R = (-1) * this.bL.R;
                }
                this.bL.D += this.bL.R;
                if (this.bL.f == 0) {
                    this.bL.f = 3;
                    this.bL.x--;
                }
                if (this.ca != 0) {
                    this.ca = 0;
                    this.bL.x = 5;
                }
                if (this.bL.x == 5) {
                    int i2 = this.bL.b;
                    b(false);
                    if (this.cl > i2) {
                        this.bL.b = this.cl;
                        L();
                    }
                    this.y = 6;
                    this.bL.d();
                    this.bW = 3;
                    l();
                }
            }
            this.bL.o = (this.bL.o + 1) & 3;
            return;
        }
        if (this.bL.r) {
            if (this.ay == 0) {
                this.bL.c();
                this.bL.y = (this.bL.y + 1) & 3;
                if (this.bL.y == 0) {
                    this.bL.a();
                    this.bL.r = false;
                    this.ay = 3;
                }
            }
            this.ay = (this.ay + 1) & 3;
            return;
        }
        if (this.bL.G) {
            if (this.ay == 0) {
                if (this.bL.Q == 0) {
                    this.bL.a(7);
                    this.bL.a(this.bL.h);
                }
                this.bL.c();
                this.bL.Q = (this.bL.Q + 1) & 3;
                if (this.bL.Q == 0) {
                    this.bL.G = false;
                    this.ay = 3;
                    if (this.bL.I <= 0) {
                        this.bL.I = 0;
                        this.bL.a();
                        return;
                    } else {
                        this.bL.l = true;
                        this.bL.a(this.bL.N);
                    }
                }
            }
            this.bL.a(1);
            this.ay = (this.ay + 1) & 3;
        }
        if (!this.bL.w && (p(this.bL.x + 1, this.bL.c) || this.cc[this.bL.x + 1][this.bL.c].a)) {
            this.bL.w = true;
            this.s = true;
            this.ci = -1;
        }
        if (this.bL.w) {
            this.bL.f = (this.bL.f + 1) & 3;
            if (this.bL.f == 0) {
                this.bL.w = false;
            }
        }
        if (this.bL.K) {
            this.bL.k = (this.bL.k + 1) & 3;
            this.bL.c();
            if (this.bL.k == 0) {
                W();
                this.bL.K = false;
            }
        }
        if (this.bL.q) {
            if (this.bL.w) {
                this.bL.q = false;
                this.bL.f = 0;
                this.bL.D = 0;
            } else {
                this.bL.D = (this.bL.D + 1) & 3;
                this.bL.c();
                if (this.bL.D == 0) {
                    this.bL.q = false;
                    if (this.bL.s > 0) {
                        this.bL.c++;
                    } else if (this.bL.s < 0) {
                        this.bL.c--;
                    }
                    this.bL.s = 0;
                }
            }
        }
        if (this.bL.I != 0 || this.bL.G) {
            return;
        }
        this.ay = 0;
        this.ai = true;
    }

    public final void c(int i2, int i3, int i4) {
        for (int i5 = i4 - 1; i5 < i3; i5++) {
            this.cs.setClip(0, i5 * 16, i, i2);
            a();
        }
    }

    public final void f(int i2, int i3, int i4) {
        for (int i5 = i4; i5 < i3; i5++) {
            this.cs.setClip(i5 * 16, 0, i2, 160);
            a();
        }
    }

    public final void aD() {
        for (int i2 = 0; i2 < 4; i2++) {
            int iNextInt = (this.cu.nextInt() & 31) % 8;
            int iNextInt2 = (this.cu.nextInt() & 31) % 9;
            if (this.bU[iNextInt][iNextInt2]) {
                int i3 = iNextInt;
                while (true) {
                    int i4 = i3;
                    if (iNextInt >= 8) {
                        break;
                    }
                    for (int i5 = 0; i5 < 9; i5++) {
                        if (!this.bU[i4][i5]) {
                            iNextInt = i4;
                            iNextInt2 = i5;
                            break;
                        }
                    }
                    i3 = (i4 + 1) & 7;
                }
            }
            this.bU[iNextInt][iNextInt2] = true;
            this.cs.setClip((-2) + (iNextInt2 * 20), iNextInt * 20, 20, 20);
            a();
        }
    }

    public final void e(int i2, int i3, int i4) {
        for (int i5 = i4; i5 < i3; i5++) {
            this.cs.setClip(((i5 * 16) + 16) - i2, 0, i2, 160);
            a();
        }
    }

    public final void i(int i2, int i3, int i4) {
        for (int i5 = i4; i5 < i3; i5++) {
            this.cs.setClip(0, ((i5 * 16) + 16) - i2, i, i2);
            a();
        }
    }

    public final void S() {
        for (int i2 = 0; i2 < 13; i2++) {
            for (int i3 = 0; i3 < 8; i3++) {
                this.cc[i2][i3].f = -1;
                this.cc[i2][i3].b();
            }
        }
        ah();
        for (int i4 = 13; i4 < 27; i4++) {
            for (int i5 = 0; i5 < 8; i5++) {
                int iNextInt = (this.cu.nextInt() & 31) % this.af;
                if (this.bN[iNextInt] == 4) {
                    iNextInt = (this.cu.nextInt() & 31) % this.af;
                }
                this.cc[i4][i5].f = this.bN[iNextInt];
                this.cc[i4][i5].b();
                if ((this.cu.nextInt() & 127) == 0) {
                    this.cc[i4][i5].f = (this.cu.nextInt() & 7) + 9;
                }
            }
        }
    }

    public final void P() {
        S();
        this.bL.d();
    }

    public final void d(int i2, int i3) {
        a(i2, i3);
        int i4 = this.cc[i2][i3].f;
        this.bE[i2][i3] = false;
        if (i3 > 0 && u(this.cc[i2][i3 - 1].f, i4) && this.bE[i2][i3 - 1]) {
            d(i2, i3 - 1);
        }
        if (i3 < 7 && u(this.cc[i2][i3 + 1].f, i4) && this.bE[i2][i3 + 1]) {
            d(i2, i3 + 1);
        }
        if (i2 > 0 && u(this.cc[i2 - 1][i3].f, i4) && this.bE[i2 - 1][i3]) {
            d(i2 - 1, i3);
        }
        if (i2 < 26 && u(this.cc[i2 + 1][i3].f, i4) && this.bE[i2 + 1][i3]) {
            d(i2 + 1, i3);
        }
    }

    public final void g(int i2) {
        int i3 = 0;
        int i4 = 0;
        while (i4 < 8) {
            if (this.bL.M[i4] != 0) {
                i3++;
            }
            if (i3 == i2 + 1) {
                break;
            } else {
                i4++;
            }
        }
        this.bL.B--;
        int[] iArr = this.bL.M;
        int i5 = i4;
        iArr[i5] = iArr[i5] - 1;
        if (this.bL.M[i4] == 0) {
            this.bL.P--;
            this.bq = 0;
            this.N = 0;
            this.by = 0;
        }
        this.bL.C += d.B[i4];
    }

    public final void R() {
        int i2 = (this.bL.x - 4) + 11;
        for (int i3 = this.bL.x - 4; i3 < i2; i3++) {
            for (int i4 = 0; i4 < 8; i4++) {
                if (this.cc[i3][i4].f >= 4 && this.cc[i3][i4].f <= 8) {
                    h(4, i4, i3);
                    this.cc[i3][i4].f = -1;
                    this.cc[i3][i4].b();
                }
            }
        }
    }

    public final void s(int i2) {
        int i3 = (this.bL.x - 4) + 11;
        for (int i4 = this.bL.x - 4; i4 < i3; i4++) {
            for (int i5 = 0; i5 < 8; i5++) {
                if (this.cc[i4][i5].f == i2) {
                    h(this.cc[i4][i5].f, i5, i4);
                    this.cc[i4][i5].f = -1;
                    this.cc[i4][i5].b();
                }
            }
        }
    }

    public final void n(int i2) {
        int[] iArr = this.bL.M;
        iArr[i2] = iArr[i2] - 1;
        if (this.bL.M[i2] == 0) {
            this.bL.P--;
        }
        this.bL.B--;
        if (i2 != 7) {
            i(i2 + 9);
        }
    }

    public final void j() {
        int i2 = this.bL.x + 12;
        for (int i3 = this.bL.x + 1; i3 < i2 && this.cc[i3][this.bL.c].f != 23 && this.cc[i3][this.bL.c].f != 24; i3++) {
            if (this.cc[i3][this.bL.c].f >= 0 && this.cc[i3][this.bL.c].f <= 8) {
                if (this.cc[i3][this.bL.c].f < 4) {
                    h(this.cc[i3][this.bL.c].f, this.bL.c, i3);
                } else {
                    h(4, this.bL.c, i3);
                }
                this.cc[i3][this.bL.c].f = -1;
                this.cc[i3][this.bL.c].b();
            }
        }
    }

    public final void at() {
        int i2 = this.bL.x + 4;
        int i3 = this.bL.c + 4;
        for (int i4 = this.bL.x - 3; i4 < i2; i4++) {
            for (int i5 = this.bL.c - 3; i5 < i3; i5++) {
                if (i5 >= 0 && i5 <= 7 && i4 >= 0 && i4 <= 26 && this.cc[i4][i5].f >= 0 && this.cc[i4][i5].f <= 8) {
                    if (this.cc[i4][i5].f < 4) {
                        h(this.cc[i4][i5].f, i5, i4);
                    } else {
                        h(4, i5, i4);
                    }
                    this.cc[i4][i5].f = -1;
                    this.cc[i4][i5].b();
                }
            }
        }
    }

    public final void h(int i2, int i3, int i4) {
        for (int i5 = 0; i5 < 2; i5++) {
            a aVar = new a(i2, (i3 * 20) + (8 * (this.cu.nextInt() & 1)), ((i4 - 8) * 20) + (i5 * (this.cu.nextInt() & 1)));
            aVar.a((this.cu.nextInt() & 7) + 1, ((this.cu.nextInt() & 1) * 2) - 1);
            this.aY.addElement(aVar);
        }
    }

    public final void l(int i2, int i3) {
        a(i2, i3);
        int i4 = this.cc[i2][i3].f;
        this.cc[i2][i3].f -= 50;
        if (i3 > 0 && u(this.cc[i2][i3 - 1].f, i4)) {
            l(i2, i3 - 1);
        }
        if (i3 < 7 && u(this.cc[i2][i3 + 1].f, i4)) {
            l(i2, i3 + 1);
        }
        if (i2 > 0 && u(this.cc[i2 - 1][i3].f, i4)) {
            l(i2 - 1, i3);
        }
        if (i2 >= 26 || !u(this.cc[i2 + 1][i3].f, i4)) {
            return;
        }
        l(i2 + 1, i3);
    }

    public final void W() {
        if (this.bL.I <= 0) {
        }
        switch (this.y) {
            case 1:
                if (this.cc[this.bL.x - 1][this.bL.c].f >= 0 && this.cc[this.bL.x - 1][this.bL.c].f <= 8) {
                    this.bL.I--;
                    if (!i(this.bL.x - 1, this.bL.c)) {
                        s(this.bL.x - 1, this.bL.c);
                        break;
                    } else {
                        c(this.bL.x - 1, this.bL.c);
                        break;
                    }
                }
                break;
            case 2:
                if (this.bL.c != 0 && this.cc[this.bL.x][this.bL.c - 1].f >= 0 && this.cc[this.bL.x][this.bL.c - 1].f <= 8) {
                    this.bL.I--;
                    if (!i(this.bL.x, this.bL.c - 1)) {
                        s(this.bL.x, this.bL.c - 1);
                        break;
                    } else {
                        c(this.bL.x, this.bL.c - 1);
                        break;
                    }
                }
                break;
            case 5:
                if (this.bL.c != 7 && this.cc[this.bL.x][this.bL.c + 1].f >= 0 && this.cc[this.bL.x][this.bL.c + 1].f <= 8) {
                    this.bL.I--;
                    if (!i(this.bL.x, this.bL.c + 1)) {
                        s(this.bL.x, this.bL.c + 1);
                        break;
                    } else {
                        c(this.bL.x, this.bL.c + 1);
                        break;
                    }
                }
                break;
            case 6:
                int i2 = this.cc[this.bL.x + 1][this.bL.c].f;
                if (i2 >= 0 && i2 < 24) {
                    if (i2 <= 8 || i2 >= 23) {
                        this.bL.I--;
                        if (!i(this.bL.x + 1, this.bL.c)) {
                            if (i2 == 23 && this.bL.I > 0) {
                                ae();
                                this.cb = true;
                                this.as = 14;
                                this.bL.C += 5000;
                            }
                            s(this.bL.x + 1, this.bL.c);
                            break;
                        } else {
                            c(this.bL.x + 1, this.bL.c);
                            break;
                        }
                    }
                }
                break;
        }
    }

    public final void as() {
        if (this.al) {
            return;
        }
        for (int i2 = 0; i2 < 27; i2++) {
            for (int i3 = 0; i3 < 8; i3++) {
                this.bE[i2][i3] = true;
            }
        }
        for (int i4 = 0; i4 < 8; i4++) {
            if (this.cc[26][i4].f >= 0 && this.bE[26][i4]) {
                this.bS = 0;
                d(26, i4);
                for (int i5 = 0; i5 < this.bS; i5++) {
                    if (this.q[i5] > 0 && this.bE[this.q[i5] - 1][this.l[i5]] && this.cc[this.q[i5] - 1][this.l[i5]].f >= 0 && !u(this.cc[this.q[i5] - 1][this.l[i5]].f, this.cc[this.q[i5]][this.l[i5]].f)) {
                        d(this.q[i5] - 1, this.l[i5]);
                    }
                }
            }
        }
        for (int i6 = 26; i6 >= 0; i6--) {
            for (int i7 = 0; i7 < 8; i7++) {
                if (this.cc[i6][i7].f >= 0) {
                    if (this.bE[i6][i7]) {
                        if (!this.cc[i6][i7].a) {
                            if (!this.cc[i6][i7].d) {
                                this.cc[i6][i7].h = true;
                            } else if (i6 >= 26 || this.cc[i6 + 1][i7].f < 0 || this.cc[i6 + 1][i7].a) {
                                if (i7 > 0 && u(this.cc[i6][i7 - 1].f, this.cc[i6][i7].f) && this.cc[i6][i7 - 1].h) {
                                    this.bS = 0;
                                    l(i6, i7);
                                    int i8 = this.cc[i6][i7 - 1].e;
                                    for (int i9 = 0; i9 < this.bS; i9++) {
                                        this.cc[this.q[i9]][this.l[i9]].a = false;
                                        this.cc[this.q[i9]][this.l[i9]].f += 50;
                                        this.cc[this.q[i9]][this.l[i9]].h = true;
                                        this.cc[this.q[i9]][this.l[i9]].e = i8;
                                    }
                                } else if (i7 < 7 && u(this.cc[i6][i7 + 1].f, this.cc[i6][i7].f) && this.cc[i6][i7 + 1].h) {
                                    this.bS = 0;
                                    l(i6, i7);
                                    int i10 = this.cc[i6][i7 + 1].e;
                                    for (int i11 = 0; i11 < this.bS; i11++) {
                                        this.cc[this.q[i11]][this.l[i11]].a = false;
                                        this.cc[this.q[i11]][this.l[i11]].f += 50;
                                        this.cc[this.q[i11]][this.l[i11]].h = true;
                                        this.cc[this.q[i11]][this.l[i11]].e = i10;
                                    }
                                } else if (!this.cc[i6][i7].h) {
                                    this.cc[i6][i7].a = true;
                                }
                            } else if (this.cc[i6 + 1][i7].h && this.cc[i6 + 1][i7].e != this.cc[i6][i7].e) {
                                this.bS = 0;
                                l(i6, i7);
                                int i12 = this.cc[i6 + 1][i7].e;
                                for (int i13 = 0; i13 < this.bS; i13++) {
                                    this.cc[this.q[i13]][this.l[i13]].f += 50;
                                    this.cc[this.q[i13]][this.l[i13]].a = false;
                                    this.cc[this.q[i13]][this.l[i13]].h = true;
                                    this.cc[this.q[i13]][this.l[i13]].e = i12;
                                }
                            }
                        }
                    } else if (this.cc[i6][i7].h) {
                        this.bS = 0;
                        l(i6, i7);
                        for (int i14 = 0; i14 < this.bS; i14++) {
                            this.cc[this.q[i14]][this.l[i14]].f += 50;
                            this.cc[this.q[i14]][this.l[i14]].a();
                        }
                    } else if (this.cc[i6][i7].d) {
                        this.bS = 0;
                        l(i6, i7);
                        if (this.bS > 3) {
                            for (int i15 = 0; i15 < this.bS; i15++) {
                                int i16 = this.cc[this.q[i15]][this.l[i15]].f + 50;
                                int i17 = i16;
                                if (i16 > 4) {
                                    i17 = 4;
                                }
                                h(i17, this.l[i15], this.q[i15]);
                                this.cc[this.q[i15]][this.l[i15]].f = -1;
                                this.cc[this.q[i15]][this.l[i15]].b();
                            }
                        } else {
                            for (int i18 = 0; i18 < this.bS; i18++) {
                                this.cc[this.q[i18]][this.l[i18]].f += 50;
                                this.cc[this.q[i18]][this.l[i18]].d = false;
                                if (this.cc[this.q[i18]][this.l[i18]].h) {
                                    this.cc[this.q[i18]][this.l[i18]].e = 0;
                                    this.cc[this.q[i18]][this.l[i18]].h = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /* JADX WARN: Type inference failed for: r0v5, types: [int, java.lang.Throwable] */
    public final boolean az() {
        ?? numRecords;
        try {
            this.aN = RecordStore.openRecordStore(this.bD.b, true);
            numRecords = this.aN.getNumRecords();
            return numRecords <= 0;
        } catch (Exception e) {
            numRecords.printStackTrace();
            return true;
        }
    }

    public final boolean y(int i2, int i3) {
        for (int i4 = 0; i4 < i3; i4++) {
            if (this.bN[i4] == i2) {
                return false;
            }
        }
        return true;
    }

    public final void aa() {
        int i2 = this.bL.x;
        int i3 = this.bL.c;
        for (int i4 = 0; i4 <= i2; i4++) {
            if (this.cc[i4][i3].f < 9) {
                e(i4, i3);
                this.cc[i4][i3].f = -1;
                this.cc[i4][i3].b();
            }
        }
        if (i3 > 0) {
            for (int i5 = 0; i5 <= i2; i5++) {
                if (this.cc[i5][i3 - 1].f < 9) {
                    e(i5, i3 - 1);
                    this.cc[i5][i3 - 1].f = -1;
                    this.cc[i5][i3 - 1].b();
                }
            }
        }
        if (i3 < 7) {
            for (int i6 = 0; i6 <= i2; i6++) {
                if (this.cc[i6][i3 + 1].f < 9) {
                    e(i6, i3 + 1);
                    this.cc[i6][i3 + 1].f = -1;
                    this.cc[i6][i3 + 1].b();
                }
            }
        }
    }

    /* JADX WARN: Multi-variable type inference failed */
    public final void v() {
        try {
            ad();
            d();
            a("/res.boq");
            this.bF = o(d.Y[this.az]);
            this.ak = o(d.Y[this.az]);
            this.ck = o(d.Y[this.az]);
            d();
            this.aH = new Image[4];
            a(this.aH, 4);
            this.an = new Image[4];
            a(this.an, 4);
            d();
            this.cd = o(d.Y[this.az]);
            this.bo = new Image[4];
            a(this.bo, 4);
            this.aD = new Image[4];
            a(this.aD, 4);
            this.ao = new Image[4];
            a(this.ao, 4);
            d();
            this.aE = new Image[4];
            a(this.aE, 4);
            this.aP = new Image[4];
            a(this.aP, 4);
            this.cm = o(d.Y[this.az]);
            this.bJ = o(d.Y[this.az]);
            this.bx = o(d.Y[this.az]);
            d();
            this.C = new Image[4];
            a(this.C, 4);
            this.bR = new Image[4];
            a(this.bR, 4);
            this.a = o(d.Y[this.az]);
            this.cg = o(d.Y[this.az]);
            this.ag = new Image[4];
            a(this.ag, 4);
            this.ac = new Image[4];
            a(this.ac, 4);
            d();
            this.be = o(d.Y[this.az]);
            this.br = new Image[2];
            a(this.br, 2);
            this.bZ = o(d.Y[this.az]);
            this.w = o(d.Y[this.az]);
            this.aU = new Image[4];
            a(this.aU, 4);
            d();
            a(this.aj, 12);
            this.bm = o(d.Y[this.az]);
            this.co = new Image[4];
            a(this.co, 4);
            d();
            this.Y = o(d.Y[this.az]);
            this.av = o(d.Y[this.az]);
            this.S = o(d.Y[this.az]);
            this.O = o(d.Y[this.az]);
            this.h = o(d.Y[this.az]);
            this.aQ = new Image[5];
            a(this.aQ, 5);
            d();
            this.I = new Image[5];
            a(this.I, 5);
            this.c = new Image[5];
            a(this.c, 5);
            this.t = new Image[5];
            a(this.t, 5);
            this.aw = new Image[5];
            a(this.aw, 5);
            this.F = o(d.Y[this.az]);
            this.aS = o(d.Y[this.az]);
            this.u = o(d.Y[this.az]);
            d();
            this.bt = new Image[4];
            a(this.bt, 4);
            this.bH = o(d.Y[this.az]);
            this.cf = new Image[4];
            a(this.cf, 4);
            d();
            this.aC = 0;
            m();
        } catch (IOException e) {
            printStackTrace();
        }
    }

    /* JADX WARN: Not initialized variable reg: 0, insn: 0x009e: INVOKE (r0 I:java.lang.Throwable) VIRTUAL call: java.lang.Throwable.printStackTrace():void A[MD:():void (c)], block:B:20:0x009d */
    public final void t() throws IOException {
        Throwable thPrintStackTrace;
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(byteArrayOutputStream);
            for (int i2 = 0; i2 < 8; i2++) {
                for (int i3 = 0; i3 < 16; i3++) {
                    dataOutputStream.writeBoolean(false);
                    this.bC[i2][i3] = false;
                }
            }
            this.aW = 0;
            dataOutputStream.writeInt(1);
            for (int i4 = 0; i4 < 11; i4++) {
                dataOutputStream.writeInt(0);
            }
            dataOutputStream.flush();
            dataOutputStream.close();
            this.bL.b();
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            if (this.aN.getNumRecords() == 0) {
                this.aN.addRecord(byteArray, 0, byteArray.length);
            } else {
                this.aN.setRecord(1, byteArray, 0, byteArray.length);
            }
        } catch (Exception e) {
            thPrintStackTrace.printStackTrace();
        }
    }

    public final void b(Image[] imageArr, int i2) throws IOException {
        for (int i3 = 0; i3 < i2; i3++) {
            imageArr[i3] = o(d.v[this.az]);
        }
    }

    public final void a(Image[] imageArr, int i2) throws IOException {
        for (int i3 = 0; i3 < i2; i3++) {
            imageArr[i3] = o(d.Y[this.az]);
        }
    }

    /* JADX WARN: Multi-variable type inference failed */
    public final void H() {
        try {
            this.o = Image.createImage("/splash.png");
            this.cm = Image.createImage("/sinalogo.png");
        } catch (IOException e) {
            printStackTrace();
        }
    }

    public final void h() {
        int i2 = (this.bb / 20) + 1;
        for (int i3 = 0; i3 < 10; i3++) {
            if (i2 > 16) {
                i2 = 1;
            }
            try {
                this.at[i3] = Image.createImage(new StringBuffer().append("/images/worldmap").append(i2).append(".png").toString());
            } catch (IOException unused) {
            }
            i2++;
        }
    }

    public final void ae() {
        switch ((this.cu.nextInt() & 3) + 1) {
            case 1:
                this.bv = this.aD;
                this.V = this.aQ;
                break;
            case 2:
                this.bv = this.ao;
                this.V = this.I;
                break;
            case 3:
                this.bv = this.aE;
                this.V = this.c;
                break;
            case 4:
                this.bv = this.aP;
                this.V = this.t;
                break;
        }
    }

    public final void E() {
        for (int i2 = 0; i2 < 22; i2++) {
            this.bA[i2] = this.cu.nextInt() & 7;
        }
    }

    public final void e(int i2, int i3) {
        if (this.cc[i2][i3].f < 0) {
            return;
        }
        if (this.cc[i2][i3].f < 4) {
            h(this.cc[i2][i3].f, i3, i2);
        } else {
            h(4, i3, i2);
        }
    }

    public final void a(String str) {
        this.aM = new byte[4344];
        this.P = new DataInputStream(getClass().getResourceAsStream(str));
        for (int i2 = 0; i2 < 16; i2++) {
            this.aM[i2] = aL[i2];
        }
    }

    public final void s(int i2, int i3) {
        if (i2 < 0 || i2 > 26 || i3 < 0 || i3 > 7 || this.cc[i2][i3].f < 0) {
            return;
        }
        int i4 = this.cc[i2][i3].f;
        this.cc[i2][i3].f = -1;
        if (i4 != 23) {
            h(i4, i3, i2);
        } else {
            h((this.cu.nextInt() & 7) % 5, i3, i2);
        }
        if (i3 > 0 && this.cc[i2][i3 - 1].f == i4) {
            s(i2, i3 - 1);
        }
        if (i3 < 7 && this.cc[i2][i3 + 1].f == i4) {
            s(i2, i3 + 1);
        }
        if (i2 > 0 && this.cc[i2 - 1][i3].f == i4) {
            s(i2 - 1, i3);
        }
        if (i2 >= 26 || this.cc[i2 + 1][i3].f != i4) {
            return;
        }
        s(i2 + 1, i3);
    }

    public final void c(int i2, int i3) {
        this.cc[i2][i3].f++;
        if (this.cc[i2][i3].f > 8) {
            this.cc[i2][i3].f = -1;
            h(4, i3, i2);
        }
    }

    public final void am() {
        Q();
    }

    public final void Q() {
        a(this.cs, 85, 16777215, 0);
    }

    public final void r(int i2, int i3) {
        this.cs.drawImage(this.ak, i2, i3, 20);
    }

    public final void g(Graphics graphics) {
        graphics.setColor(0);
        graphics.fillRect(0, 0, i, G);
        for (int i2 = 11; i2 >= 0; i2--) {
            for (int i3 = 0; i3 < 8; i3++) {
                f fVar = this.cc[i2 + 7][i3];
                if (fVar.f >= 0) {
                    Image[] imageArr = null;
                    this.K = a(fVar);
                    if (fVar.f < 4) {
                        b(this.bv[fVar.f], 8 + (i3 * 20) + this.K, ((i2 - 1) * 20) + (this.ci * this.T * 5) + (fVar.b * 5));
                    } else if (fVar.f <= 8) {
                        b(this.aw[fVar.f - 4], 8 + (i3 * 20) + this.K, ((i2 - 1) * 20) + (this.ci * this.T * 5) + (fVar.b * 5));
                    } else if (fVar.f == 22) {
                        b(this.bm, 8 + (i3 * 20), ((i2 - 1) * 20) + (this.ci * this.T * 5));
                    } else if (fVar.f == 9) {
                        imageArr = this.co;
                    } else if (fVar.f == 10) {
                        imageArr = this.cf;
                    } else if (fVar.f == 11) {
                        imageArr = this.an;
                    } else if (fVar.f == 12) {
                        imageArr = this.ac;
                    } else if (fVar.f == 13) {
                        imageArr = this.aH;
                    } else if (fVar.f == 14) {
                        imageArr = this.ag;
                    } else if (fVar.f == 15) {
                        imageArr = this.bt;
                    } else if (fVar.f == 16) {
                        imageArr = this.bR;
                    } else if (fVar.f == 17) {
                        imageArr = this.C;
                    } else if (fVar.f >= 25 && fVar.f <= 28) {
                        b(this.bo[fVar.f - 25], 8 + (i3 * 20) + this.K, ((i2 - 1) * 20) + (this.ci * this.T * 5) + (fVar.b * 5));
                    } else if (fVar.f >= 18 && fVar.f <= 21) {
                        b(this.aU[fVar.f - 18], 8 + (i3 * 20) + this.K, ((i2 - 1) * 20) + (this.ci * this.T * 5) + (fVar.b * 5));
                    } else if (fVar.f == 23 || fVar.f == 24) {
                        b(this.br[fVar.f - 23], 8 + (i3 * 20) + this.K, ((i2 - 1) * 20) + (this.ci * this.T * 5) + (fVar.b * 5));
                    }
                    if (imageArr != null) {
                        fVar.c = (fVar.c + fVar.g) & 3;
                        b(imageArr[fVar.c], 8 + (i3 * 20) + this.K, ((i2 - 1) * 20) + (this.ci * this.T * 5) + (fVar.b * 5));
                        if (fVar.c == 0 || fVar.c == 3) {
                            fVar.g = -fVar.g;
                        }
                    }
                }
            }
        }
    }

    public final void e(Graphics graphics) {
        this.ad = (this.ad + 1) & 7;
        if (this.ad < 4) {
            graphics.drawImage(this.ck, i - 30, G - 28, 20);
        }
    }

    public final void c(Graphics graphics) {
        d(graphics);
        b(graphics, 40);
    }

    public final void c(int i2, int i3, int i4, int i5, int i6) {
        this.cs.setColor(i6);
        this.cs.fillRect(i2, i3, i4, i5);
    }

    public final void C() {
        this.cs.drawImage(this.O, 0, 0, 20);
        av();
        this.n = (this.n + 1) & 3;
        b(11, 57 + (21 * this.aq), 81, 14);
        d(22, 56, d.M);
        d(22, 77, d.n);
        d(22, 98, d.U);
        this.cs.setColor(0);
        this.cs.drawString(d.D[this.aq], 11, 165, 20);
        repai_m();
        serviceRepaints();
    }

    public final void b(int i2, int i3, int i4, int i5, int i6) {
        this.cs.setClip(i2, i3, 7, 18);
        this.cs.drawImage(this.cm, i2 - (i6 * 15), i3, 20);
        this.cs.setClip((i2 + i4) - 8, i3, 8, 18);
        this.cs.drawImage(this.cm, ((i2 + i4) - 15) - (i6 * 15), i3, 20);
        this.cs.setClip(0, 0, i, G);
        int[] iArr = i6 == 0 ? d.q : d.H;
        int length = iArr.length;
        for (int i7 = 0; i7 < length; i7++) {
            this.cs.setColor(iArr[i7]);
            this.cs.drawLine(i2 + 7, i3 + i7, (i2 + i4) - 8, i3 + i7);
        }
    }

    public final void n(int i2, int i3) {
        d(i2, i3, d.ac);
        a(i2 + 26, i3, 26, 13, 15592936);
        this.cs.setClip(i2 + 26, i3, 26, 13);
        this.cs.drawImage(this.h, i2, i3 - (d.t * 13), 20);
        this.cs.setClip(0, 0, i, G);
    }

    public final void aw() {
        m(47, 30);
    }

    public final void ab() {
        if (this.bL.P == 0) {
            this.cs.setColor(15788152);
            this.cs.fillRect(4, 164, 168, 40);
            this.cs.setColor(0);
            this.cs.drawString("没有道具", 6, 163, 20);
            this.cs.drawString("按7/9键退出", 6, 183, 20);
        } else {
            int i2 = 0;
            for (int i3 = 0; i3 < 8; i3++) {
                if (this.bL.M[i3] != 0) {
                    int i4 = i2 / 4;
                    int i5 = i2 % 4;
                    g((i4 * 50) + 40, (i5 * 23) + 40, i3 + 9);
                    l((i4 * 50) + 62, (i5 * 23) + 47, 10);
                    b((i4 * 50) + 73, (i5 * 23) + 47, this.bL.M[i3]);
                    i2++;
                }
            }
        }
        repai_m();
        serviceRepaints();
    }

    public final void b(int i2, int i3, int i4, int i5) {
        this.cs.drawImage(this.bx, i2, i3, 20);
        this.cs.drawImage(this.bx, (i2 + i4) - 10, i3, 20);
        this.cs.setColor(16290152);
        this.cs.fillRect(i2 + 5, i3, i4 - 10, i5);
    }

    public final void b(Image image, int i2, int i3) {
        this.cs.drawImage(image, i2, i3, 20);
    }

    public final void g(int i2, int i3, int i4) {
        Image[] imageArr = null;
        switch (i4) {
            case 9:
                imageArr = this.co;
                break;
            case 10:
                imageArr = this.cf;
                break;
            case 11:
                imageArr = this.an;
                break;
            case 12:
                imageArr = this.ac;
                break;
            case 13:
                imageArr = this.aH;
                break;
            case 14:
                imageArr = this.ag;
                break;
            case 15:
                imageArr = this.bt;
                break;
            case 16:
                imageArr = this.bR;
                break;
        }
        this.cs.drawImage(imageArr[0], i2, i3, 20);
    }

    public final void g(int i2, int i3) {
        this.cs.setColor(0);
        if (i3 < 5) {
            this.cs.drawString(d.E[i2][0].substring(0, i3), 24, 134, 20);
        } else {
            this.cs.drawString(d.E[i2][0], 24, 134, 20);
        }
        this.cs.drawString(d.E[i2][1].substring(0, i3), 24, 152, 20);
    }

    public final void i(Graphics graphics) {
        if (this.aZ == 0) {
            if (this.bw == 0) {
                this.aC = 0;
                ac();
                this.cs.setColor(0);
                this.cs.fillRect(0, 0, i, G);
                return;
            }
            a(graphics, this.bw);
            this.aC = (this.aC + 1) & 3;
            if (this.aC == 0) {
                this.bw--;
            }
        }
        this.aZ = (this.aZ + 1) & 3;
    }

    public final void h(Graphics graphics) {
        for (int i2 = 0; i2 < 8; i2++) {
            for (int i3 = 0; i3 < 16; i3++) {
                if (this.bC[i2][i3]) {
                    if ((i3 + 1) * 20 > this.bb && i3 * 20 < this.bb + i) {
                        graphics.setClip(((i3 * 20) - this.bb) + 7, i2 * 20, 20, 20);
                        graphics.drawImage(this.bJ, ((i3 * 20) - this.bb) + 7, i2 * 20, 20);
                    } else if (i3 * 20 < (i - 320) + this.bb) {
                        graphics.setClip(((i3 * 20) + 327) - this.bb, i2 * 20, 20, 20);
                        graphics.drawImage(this.bJ, ((i3 * 20) + 327) - this.bb, i2 * 20, 20);
                    }
                }
            }
        }
        graphics.setClip(0, 0, i, G);
    }

    public final void e(int i2) {
        if (i2 < 7) {
            d(11, 163, d.a + i2);
        } else {
            d(11, 163, d.w);
        }
        d(37, 163, d.O);
        d(11, 183, d.b);
        b(45, 184, this.bL.C);
    }

    public final void av() {
        if ((this.cu.nextInt() & 15) == 0) {
            this.cs.drawImage(this.cg, 113, 92, 20);
        }
    }

    public final void c(Graphics graphics, int i2) {
        for (int i3 = 0; i3 < 16; i3 += 2) {
            graphics.setClip(0, i3 * 16, i - (11 * i2), 16);
            graphics.drawImage(this.r, (-11) * i2, 0, 20);
        }
        for (int i4 = 1; i4 < 16; i4 += 2) {
            graphics.setClip(11 * i2, i4 * 16, i - (11 * i2), 16);
            graphics.drawImage(this.r, 11 * i2, 0, 20);
        }
    }

    public final void a(Graphics graphics, String[] strArr) {
        graphics.drawImage(this.aF, 0, 0, 20);
        graphics.setFont(Font.getFont(0, 0, 8));
        k(55, 170);
        if (this.ay + 6 < strArr.length) {
            a(86, 157 + this.aZ, 1);
        }
        if (this.bO) {
            a(graphics, 120, 21);
            b(graphics, 51, 21);
        }
        for (int i2 = 0; i2 < 6 && this.ay + i2 < strArr.length; i2++) {
            graphics.setColor(16777215);
            graphics.drawString(strArr[i2 + this.ay], 15, 42 + (i2 * 19), 20);
            if (i2 == 0) {
                graphics.drawString(d.e[this.bq], (i / 2) + 3, 18, 17);
            }
            graphics.setColor(0);
            if (i2 == 0) {
                graphics.drawString(d.e[this.bq], (i / 2) + 2, 17, 17);
            }
            graphics.drawString(strArr[i2 + this.ay], 14, 41 + (i2 * 19), 20);
        }
    }

    public final void a(Graphics graphics) {
        this.bL.a(graphics);
        if (this.bL.I >= 10 || this.bL.I <= 1) {
            return;
        }
        if (this.aC < 4) {
            this.cs.setColor(240, 232, 120);
            this.cs.drawRect((this.bL.c * 20) + 12, ((this.bL.x - 9) * 20) + 7, 10, 4);
            this.cs.drawRect((this.bL.c * 20) + 15, ((this.bL.x - 9) * 20) + 4, 4, 10);
            this.cs.setColor(16711680);
            this.cs.fillRect((this.bL.c * 20) + 13, ((this.bL.x - 9) * 20) + 8, 9, 3);
            this.cs.fillRect((this.bL.c * 20) + 16, ((this.bL.x - 9) * 20) + 5, 3, 9);
        }
        this.aC = (this.aC + 1) & 7;
    }

    public final void a(Image image, int i2, int i3) {
        switch (i3) {
            case 1:
                this.aV = 170 - (i2 * 10);
                break;
            case 2:
                this.aV = (-170) + (i2 * 10);
                this.ce = (-204) + (i2 * 12);
                break;
            case 3:
                this.aV = 170 - (i2 * 10);
                this.ce = 204 - (i2 * 12);
                break;
        }
        repai_m();
        serviceRepaints();
    }

    public final void b(Graphics graphics, int i2) {
        k(i2, 2, 0);
        b(i2 + 16, 4, this.bL.I);
        this.aK = this.z ? this.cl - this.bn : this.cl;
        if (this.cl > this.R) {
            this.aK = this.R;
        }
        k(i2 + 43, 2, 1);
        b(i2 + 60, 4, this.aK);
        if (this.aO != 14) {
            int i3 = 4;
            if (this.aK < 10) {
                i3 = 1;
            } else if (this.aK < 100) {
                i3 = 2;
            } else if (this.aK < 1000) {
                i3 = 3;
            }
            l(i2 + 60 + (7 * i3), 4, 11);
            this.aK = this.z ? this.bP : this.bn;
            b(i2 + 66 + (7 * i3), 4, this.aK);
        }
    }

    public final void d() {
        repai_m();
        serviceRepaints();
        this.aC++;
    }

    public final void x(int i2, int i3) {
        this.cs.setColor(16777215);
        this.cs.fillRect(0, 0, i, G);
        this.cs.drawImage(this.o, i2, i3, 3);
        repai_m();
    }

    public final void k(int i2, int i3) {
        this.cs.drawImage(this.bZ, i2, i3, 20);
    }

    public final void y() {
        a();
        h(this.cs);
        if (this.aW < 7) {
            if ((this.W[this.aW][1] + 1) * 20 > this.bb && this.W[this.aW][1] * 20 < this.bb + i) {
                this.cs.drawImage(this.bm, ((this.W[this.aW][1] * 20) - this.bb) + 9, (this.W[this.aW][0] * 20) + 2, 20);
            } else if (this.W[this.aW][1] * 20 < (i - 320) + this.bb) {
                this.cs.drawImage(this.bm, (((this.W[this.aW][1] * 20) + 320) - this.bb) + 9, (this.W[this.aW][0] * 20) + 2, 20);
            }
        }
        this.cs.setClip(0, 0, i, G);
        f(78, (this.f * 20) + this.bj);
        c(0, 160, i, 45);
        if (!this.A) {
            if (this.bg) {
                X();
            } else {
                j(this.f, this.ch);
            }
        }
        repai_m();
        serviceRepaints();
    }

    public final void a() {
        int i2 = -(this.bb % 20);
        for (int i3 = 0; i3 < 10; i3++) {
            if (i2 + (i3 * 20) < i && i2 + (i3 * 20) + 20 > 0) {
                this.cs.drawImage(this.at[i3], i2 + (i3 * 20), 0, 20);
            }
        }
    }

    public final void z(int i2, int i3) {
        if (i2 == 0) {
            c(0, 160, i, 45);
            this.cs.setColor(0);
            this.cs.drawString("生成地图 . . .", i / 2, 180, 17);
        }
        switch (i3) {
            case 0:
                c(i2, 11, 0);
                break;
            case 1:
                i(i2, 5, 0);
                c(i2, 11, 6);
                break;
            case 2:
                f(i2, 13, 7);
                e(i2, 6, 0);
                i(i2, 5, 0);
                c(i2, 11, 6);
                break;
            case 3:
                aD();
                break;
        }
        repai_m();
    }

    public final void j(int i2, int i3) {
        this.cs.setColor(0);
        int i4 = this.Q[i2][i3] - 1;
        if (h(i4 + 1)) {
            this.cs.drawString("海洋", 6, 164, 20);
            return;
        }
        if (i4 <= 2 || i4 >= 14) {
            if (this.bC[i2][i3]) {
                this.cs.drawString(d.Q[i4][1], 6, 164, 20);
                this.cs.drawString("已经挖掘", 6, 182, 20);
                return;
            } else if (i4 != 14) {
                this.cs.drawString(d.Q[i4][0], 6, 164, 20);
                return;
            } else if (g()) {
                this.cs.drawString(d.Q[i4][2], 6, 164, 20);
                return;
            } else {
                this.cs.drawString(d.Q[i4][0], 6, 164, 20);
                return;
            }
        }
        if (i4 == 13) {
            this.cs.drawString(d.Q[i4][0], 6, 164, 20);
            if (g()) {
                this.cs.drawString(d.Q[i4][2], 6, 182, 20);
                return;
            } else {
                this.cs.drawString(d.Q[i4][1], 6, 182, 20);
                return;
            }
        }
        if (this.bC[i2][i3]) {
            this.cs.drawString(d.Q[i4][2], 6, 164, 20);
        } else {
            this.cs.drawString(d.Q[i4][0], 6, 164, 20);
            this.cs.drawString(d.Q[i4][1], 6, 182, 20);
        }
    }

    public final void q(int i2) {
        this.cs.drawImage(this.aF, 0, 0, 20);
        this.cs.drawImage(this.L, 13, (-9) + (i2 * 3), 20);
        int i3 = 100;
        int i4 = 18;
        if (this.ae) {
            i3 = 85;
            i4 = 23;
        }
        if (this.bV > 70) {
            am();
        }
        for (int i5 = 0; i5 < 5; i5++) {
            if (!this.ae || i5 != 0) {
                if ((i5 & 1) == 0) {
                    if (i5 == this.bK) {
                        b((i2 * 10) - 83, i3 + (i4 * i5), 82, 18, 1);
                    } else {
                        b((i2 * 10) - 83, i3 + (i4 * i5), 82, 18, 0);
                    }
                    j((i2 * 10) - 69, i3 + 2 + (i4 * i5), d.l + i5);
                } else {
                    if (i5 == this.bK) {
                        b((i + 1) - (i2 * 10), i3 + (i4 * i5), 82, 18, 1);
                    } else {
                        b((i + 1) - (i2 * 10), i3 + (i4 * i5), 82, 18, 0);
                    }
                    j((i + 15) - (i2 * 10), i3 + 2 + (i4 * i5), d.l + i5);
                }
            }
        }
        repai_m();
        serviceRepaints();
    }

    public final void j(int i2, int i3, int i4) {
        this.cs.setClip(i2, i3, 52, 13);
        this.cs.drawImage(this.H, i2, i3 - (i4 * 13), 20);
        this.cs.setClip(0, 0, i, G);
    }

    public final void K() {
        c(32, 44, 110, 119);
        d(70, 64, d.P);
        d(70, 82, d.ad);
        d(70, 100, d.ae);
        d(70, 118, d.A);
    }

    public final void c(int i2, int i3, int i4, int i5) {
        int i6 = i4;
        int i7 = 0;
        while (i6 > 0) {
            int i8 = i6 > 7 ? 8 : i6;
            int i9 = this.bA[i7];
            this.cs.setClip(i2 + (i7 * 8), i3, i8, 4);
            this.cs.drawImage(this.be, (i2 + (i7 * 8)) - (i9 * 8), i3, 20);
            this.cs.setClip(i2 + (i7 * 8), (i3 + i5) - 4, i8, 4);
            this.cs.drawImage(this.be, (i2 + (i7 * 8)) - (i9 * 8), ((i3 + i5) - 4) - 4, 20);
            i6 -= i8;
            i7++;
        }
        int i10 = i5;
        int i11 = 0;
        while (i10 > 0) {
            int i12 = i10 > 7 ? 8 : i10;
            int i13 = this.bA[21 - i11];
            this.cs.setClip(i2, i3 + (i11 * 8), 4, i12);
            this.cs.drawImage(this.u, i2, (i3 + (i11 * 8)) - (i13 * 8), 20);
            this.cs.setClip((i2 + i4) - 4, i3 + (i11 * 8), 4, i12);
            this.cs.drawImage(this.u, ((i2 + i4) - 4) - 4, (i3 + (i11 * 8)) - (i13 * 8), 20);
            i10 -= i12;
            i11++;
        }
        this.cs.setClip(0, 0, i, G);
        this.cs.setColor(15788152);
        this.cs.fillRect(i2 + 4, i3 + 4, i4 - 8, i5 - 8);
    }

    public final void ay() {
        this.cs.setColor(15788152);
        this.cs.fillRect(4, 164, 168, 40);
        this.cs.setColor(0);
        this.cs.drawString("请先挑战低级关卡", 6, 182, 20);
        this.cs.drawString("时候未到", 6, 164, 20);
    }

    public final void a(int i2, int i3, int i4, int i5) {
        if (i4 < 10) {
            b(i2, i3, 0);
            b(i2 + 7, i3, i4);
        } else {
            b(i2, i3, i4);
        }
        l(i2 + 14, i3, 11);
        b(i2 + 21, i3, i5);
    }

    public final void l(int i2, int i3, int i4) {
        this.cs.drawImage(this.aj[i4], i2, i3, 20);
    }

    public final void b(int i2, int i3, int i4) {
        if (i4 < 0) {
            return;
        }
        int i5 = 10;
        int i6 = 0;
        while (i4 / i5 != 0) {
            i5 *= 10;
            i6++;
        }
        int i7 = i5 / 10;
        int i8 = i6 + 1;
        for (int i9 = 0; i9 < i8; i9++) {
            int i10 = i4 / i7;
            l(i2 + (i9 * 7), i3, i10);
            i4 -= i7 * i10;
            i7 /= 10;
        }
    }

    public final void m(int i2, int i3) {
        o(i2 + 5, i3 + 1);
        d(i2 + 30, i3 + 6, d.x);
        d(i2 - 1, i3 + 24, d.u);
        b(i2 + 38, i3 + 26, this.bL.n);
        d(i2 - 1, i3 + 42, d.w);
        d(i2 + 27, i3 + 42, d.C);
        b(i2 + 57, i3 + 44, this.bL.J);
        d(i2 - 1, i3 + 61, d.b);
        b(i2 + 37, i3 + 63, this.bL.C);
        d(i2 - 1, i3 + 100, d.aa);
        b(i2 + 37, i3 + 102, this.bL.a);
        d(i2 - 1, i3 + 80, d.y);
        if (this.cl > this.bL.b) {
            this.bL.b = this.cl > this.R ? this.R : this.cl;
        }
        b(i2 + 37, i3 + 82, this.bL.b);
        repai_m();
        serviceRepaints();
    }

    public final void o(int i2, int i3) {
        this.cs.setClip(i2, i3, 22, 22);
        this.cs.drawImage(this.w, i2, i3 - 44, 20);
        this.cs.setClip(0, 0, i, G);
    }

    public final void k(int i2, int i3, int i4) {
        this.cs.setClip(i2, i3, 15, 12);
        this.cs.drawImage(this.Y, i2 - (i4 * 15), i3, 20);
        this.cs.setClip(0, 0, i, G);
    }

    public final void n() {
        g(this.cs);
        b(this.cs);
        a(this.cs);
        if (this.cb) {
            c(this.as);
            this.p++;
            this.p &= 15;
            if (this.p == 0) {
                this.cb = false;
            }
        }
        if (this.bL.B == this.bL.j) {
            e(this.cs);
        }
    }

    public final void a(int i2, int i3, int i4) {
        this.cs.setClip(i2, i3, 7, 6);
        this.cs.drawImage(this.av, i2, i3 - (i4 * 6), 20);
        this.cs.setClip(0, 0, i, G);
    }

    public final void V() {
        this.cs.drawImage(this.O, 0, 0, 20);
        av();
        this.n = (this.n + 1) & 3;
        b(11, 57 + (21 * this.bI), 81, 14);
        d(22, 56, d.N);
        d(22, 77, d.V);
        d(22, 98, d.U);
        this.cs.setColor(0);
        this.cs.drawString(d.ab[this.bI], 11, 165, 20);
        repai_m();
        serviceRepaints();
    }

    public final void b(int i2, int i3) {
        this.cs.drawImage(this.S, i2, i3, 20);
    }

    public final void ag() {
        this.cs.drawImage(this.O, 0, 0, 20);
        this.n = (this.n + 1) & 3;
        av();
        if (this.bL.P == 0) {
            this.cs.setColor(0);
            this.cs.drawString("没有道具", 11, 161, 20);
            this.cs.drawString("按7/9键退出", 11, 183, 20);
        } else {
            int i2 = 0;
            int i3 = 0;
            b(11, (this.by * 21) + 55, 81, 14);
            if (this.N > 0) {
                a(27, 43 - (this.n & 1), 0);
            }
            if (this.N + 4 < this.bL.P && this.bL.P > 3) {
                a(27, 134 + (this.n & 1), 1);
            }
            int iA = a(this.bq + 1);
            for (int i4 = 0; i4 < 8; i4++) {
                if (this.bL.M[i4] != 0) {
                    i2++;
                    if (i2 > this.N) {
                        if (i4 == iA) {
                            this.ad = (this.ad + 1) & 7;
                            b(k(9 + i4)[this.ad >> 1], 20, 51 + (21 * i3));
                        } else {
                            g(20, 51 + (21 * i3), 9 + i4);
                        }
                        b(50, 56 + (21 * i3), d.B[i4]);
                        i3++;
                        if (i3 == 4) {
                            break;
                        }
                    } else {
                        continue;
                    }
                }
            }
            l(71, 165, 10);
            b(80, 165, this.bL.M[iA]);
            e(iA);
        }
        repai_m();
        serviceRepaints();
    }

    public final void a(Graphics graphics, int i2, int i3, int i4) {
        graphics.setFont(Font.getFont(0, 0, 8));
        for (int i5 = 0; i5 < 2; i5++) {
            if (i5 == 0) {
                graphics.setColor(i3);
            } else {
                graphics.setColor(i4);
            }
            graphics.drawString("BOOQIO荣誉出品", (i / 2) + i5, i2 + i5, 17);
            graphics.drawString("客户服务", (i / 2) + i5, i2 + 23 + i5, 17);
            graphics.drawString("support@booqio.com.cn", (i / 2) + i5, i2 + 46 + i5, 17);
            graphics.drawString("www.booqio.com.cn", (i / 2) + i5, i2 + 69 + i5, 17);
        }
    }

    public final void M() {
        this.cs.drawImage(this.O, 0, 0, 20);
        av();
        this.n = (this.n + 1) & 3;
        b(11, 54 + (this.by * 21), 81, 14);
        for (int i2 = 0; i2 < 4; i2++) {
            if (this.N + i2 == this.d) {
                this.ad = (this.ad + 1) & 7;
                b(k(9 + this.d)[this.ad >> 1], 20, 51 + (21 * i2));
            } else {
                g(20, 51 + (21 * i2), 9 + this.N + i2);
            }
            b(50, 56 + (21 * i2), d.m[this.N + i2]);
        }
        if (this.N > 0) {
            a(27, 43 - (this.n & 1), 0);
        }
        if (this.N < 4) {
            a(27, 134 + (this.n & 1), 1);
        }
        e(this.d);
        repai_m();
        serviceRepaints();
    }

    public final void d(int i2, int i3, int i4) {
        this.cs.setClip(i2, i3, 52, 13);
        this.cs.drawImage(this.h, i2, i3 - (i4 * 13), 20);
        this.cs.setClip(0, 0, i, G);
    }

    public final void d(Graphics graphics) {
        graphics.setClip(0, 0, 8, 3);
        graphics.drawImage(this.a, 0, 0, 20);
        graphics.setClip(0, G - 17, 8, 13);
        graphics.drawImage(this.a, 0, G - 20, 20);
        graphics.setClip(i - 8, 0, 8, 3);
        graphics.drawImage(this.a, i - 20, 0, 20);
        graphics.setClip(i - 8, G - 17, 8, 13);
        graphics.drawImage(this.a, i - 16, G - 20, 20);
        graphics.setClip(0, 0, i, G);
        this.aB = (this.bL.I * 188) / this.bL.J;
        this.bY = this.z ? this.cl - this.bn : this.cl;
        this.bk = this.z ? this.bP : this.bn;
        if (this.bY > this.bk) {
            this.bY = this.bk;
        }
        this.ap = (this.bY * 188) / this.bk;
        for (int i2 = 0; i2 < 8; i2++) {
            graphics.setColor(d.f[i2]);
            graphics.drawLine(i2, 3, i2, 191 - this.aB);
            graphics.drawLine((i - 8) + i2, 3, (i - 8) + i2, 191 - this.ap);
            graphics.setColor(d.K[i2]);
            graphics.drawLine(i2, 191 - this.aB, i2, G - 17);
            graphics.setColor(d.af[i2]);
            graphics.drawLine((i - 8) + i2, 191 - this.ap, (i - 8) + i2, G - 17);
        }
    }

    public final void b(Graphics graphics) {
        for (int size = this.aY.size() - 1; size >= 0; size--) {
            a aVar = (a) this.aY.elementAt(size);
            graphics.drawImage(this.V[aVar.c], aVar.b, aVar.a, 20);
        }
    }

    public final void d(Graphics graphics, int i2) {
        int i3 = i2;
        int i4 = i2 % 3;
        int i5 = i2 / 5;
        int i6 = i5;
        if (i5 > 2) {
            i6 = 2;
        }
        int i7 = 8 + (this.bL.c * 20);
        int i8 = (this.bL.x - 8) * 20;
        int i9 = ((i2 + 1) * (i2 + 1)) / 2;
        for (int i10 = 0; i10 < 12; i10++) {
            i3 = (i3 + 1) % 12;
            int i11 = i7 + ((i9 * d.R[i4][i3]) / 1000);
            int i12 = i8 + ((i9 * d.i[i4][i3]) / 1000);
            graphics.setClip(i11, i12, 16, 16);
            graphics.drawImage(this.bF, i11 - (i6 * 16), i12, 20);
        }
        graphics.setClip(0, 0, i, G);
    }

    public final void a(Graphics graphics, int i2) {
        int i3 = 25 - i2;
        int length = "游戏的故事发生在二零一零年，距离科幻大师凡尔纳的小说《地心游记》出版已经有两百多年了。在伦敦国家博物馆里，一个年轻的研究员在一本探险日志的夹层里发现了一张羊皮纸，这张羊皮纸竟然详细画出了《地心游记》中所描述的探险路线图。三个月后，当这位年轻的研究员宣称地心游记所描绘的地理发现都是真实的，整个世界为之震动。于是人类历史上第三次地理大发现开始了。".length();
        int i4 = 0;
        graphics.setColor(0);
        graphics.fillRect(0, 0, i, G);
        graphics.setColor(16777215);
        int i5 = 0;
        while (true) {
            int i6 = i4 + 11 > length ? length : i4 + 11;
            int i7 = (((i5 - i3) * 21) + G) - (this.aC << 2);
            if (i7 > -12 && i7 < G) {
                graphics.drawString("游戏的故事发生在二零一零年，距离科幻大师凡尔纳的小说《地心游记》出版已经有两百多年了。在伦敦国家博物馆里，一个年轻的研究员在一本探险日志的夹层里发现了一张羊皮纸，这张羊皮纸竟然详细画出了《地心游记》中所描述的探险路线图。三个月后，当这位年轻的研究员宣称地心游记所描绘的地理发现都是真实的，整个世界为之震动。于是人类历史上第三次地理大发现开始了。".substring(i4, i6), 2, i7, 20);
            }
            i4 += 11;
            if (i4 >= length) {
                return;
            } else {
                i5++;
            }
        }
    }

    public final void aB() {
        c(13, 17, 148, 161);
        this.cs.setColor(6844168);
        this.cs.fillRect(19, 127, 137, 2);
        if (this.bL.P == 0) {
            this.cs.setColor(0);
            this.cs.drawString("没有道具", 24, 132, 20);
            this.cs.drawString("按7/9键退出", 24, 152, 20);
            return;
        }
        int i2 = 0;
        for (int i3 = 0; i3 < 8; i3++) {
            if (this.bL.M[i3] != 0) {
                int i4 = i2 / 4;
                int i5 = i2 % 4;
                if (i2 == this.bq) {
                    this.ad = (this.ad + 1) & 7;
                    Image[] imageArrK = k(i3 + 9);
                    a(68, 115, this.bL.B, this.bL.j);
                    b(imageArrK[this.ad >> 1], (i4 * 66) + 35, (i5 * 20) + 28);
                } else {
                    g((i4 * 66) + 35, (i5 * 20) + 28, i3 + 9);
                }
                l((i4 * 66) + 59, (i5 * 20) + 35, 10);
                b((i4 * 66) + 70, (i5 * 20) + 35, this.bL.M[i3]);
                i2++;
            }
        }
    }

    public final void a(Graphics graphics, int i2, int i3) {
        graphics.setColor(16711680);
        for (int i4 = 0; i4 < 6; i4++) {
            graphics.drawLine(i2 + i4, i3 + i4, i2 + i4, i3 + i4 + (10 - (i4 * 2)));
        }
    }

    public final void b(Graphics graphics, int i2, int i3) {
        graphics.setColor(16711680);
        for (int i4 = 0; i4 < 6; i4++) {
            graphics.drawLine(i2 + i4, (i3 + 5) - i4, i2 + i4, i3 + 5 + i4);
        }
    }

    public final void X() {
        this.cs.setColor(0);
        this.cs.drawString("你的金钱已足够升级", 6, 164, 20);
        this.cs.drawString("可以到研发中心升级", 6, 182, 20);
    }

    public final void w(int i2, int i3) {
        c(i2, i3, 112, 125);
        this.ay = 0;
        o(i2 + 3, i3 + 7);
        this.bw = 0;
        this.ay = 0;
        this.cs.drawImage(this.aS, i2 + 38, i3 + 99, 20);
        d(i2 + 33, i3 + 15, d.x);
        d(i2 + 8, i3 + 31, d.u);
        d(i2 + 8, i3 + 48, d.w);
        d(i2 + 34, i3 + 48, d.C);
        d(i2 + 8, i3 + 64, d.r);
        d(i2 + 60, i3 + 64, d.C);
        d(i2 + 8, i3 + 81, d.L);
        b(i2 + 57, i3 + 33, this.bL.n);
        if (this.bL.n < 20) {
            b(i2 + 45, i3 + 83, d.F[this.bL.n][2]);
        }
        b(i2 + 95, i3 + 66, d.F[this.bL.n - 1][1]);
        b(i2 + 68, i3 + 50, d.F[this.bL.n - 1][0]);
        repai_m();
    }

    public final void f(int i2, int i3) {
        if (h(this.Q[this.f][this.ch])) {
            this.cs.setClip(i2, i3, 20, 20);
            this.cs.drawImage(this.cd, i2 - (20 * this.j), i3, 20);
            if (this.ay != 0) {
                if (this.Z > 0) {
                    this.cs.setClip(i2 - 9, i3 + 12, 9, 9);
                    this.cs.drawImage(this.bH, (i2 - 9) - 9, i3 + 12, 20);
                } else if (this.Z < 0) {
                    this.cs.setClip(i2 + 20, i3 + 12, 9, 9);
                    this.cs.drawImage(this.bH, (i2 + 20) - 27, i3 + 12, 20);
                } else if (this.bj < 0) {
                    this.cs.setClip(i2 + 5, i3 - 10, 9, 9);
                    this.cs.drawImage(this.bH, (i2 + 5) - 18, i3 - 10, 20);
                } else if (this.bj > 0) {
                    this.cs.setClip(i2 + 5, i3 + 20, 9, 9);
                    this.cs.drawImage(this.bH, i2 + 5, i3 + 20, 20);
                }
            }
        } else {
            this.X = (this.X + 1) & 3;
            int i4 = this.bM[this.X] % 3;
            int i5 = this.bM[this.X] / 3;
            this.cs.setClip(i2, i3, 22, 22);
            this.cs.drawImage(this.w, i2 - (22 * i4), i3 - (22 * i5), 20);
        }
        this.cs.setClip(0, 0, i, G);
    }

    public final void au() {
        this.bW = 4;
        this.bp = true;
        for (int i2 = 0; i2 < 10; i2++) {
            this.at[i2] = null;
        }
        System.gc();
    }

    public final void a(int i2, int i3, int i4, int i5, int i6) {
        this.cs.setColor(i6);
        this.cs.fillRect(i2, i3, i4, i5);
    }

    public final void al() {
        for (int i2 = 0; i2 < 24; i2++) {
            this.cn[i2] = null;
        }
        this.bF = null;
        this.ak = null;
        this.ck = null;
        for (int i3 = 0; i3 < 4; i3++) {
            this.aH[i3] = null;
            this.co[i3] = null;
            this.cf[i3] = null;
            this.ac[i3] = null;
            this.ag[i3] = null;
            this.bt[i3] = null;
            this.an[i3] = null;
            this.C[i3] = null;
            this.bR[i3] = null;
            this.bo[i3] = null;
            this.aD[i3] = null;
            this.ao[i3] = null;
            this.aE[i3] = null;
            this.aP[i3] = null;
            this.aU[i3] = null;
        }
        this.cd = null;
        this.cm = null;
        this.bJ = null;
        this.bx = null;
        this.a = null;
        this.cg = null;
        this.be = null;
        this.br[0] = null;
        this.br[1] = null;
        this.bZ = null;
        this.w = null;
        this.aF = null;
        this.H = null;
        this.Y = null;
        this.av = null;
        this.S = null;
        this.O = null;
        this.h = null;
        this.F = null;
        this.L = null;
        this.aS = null;
        this.u = null;
        this.bH = null;
        for (int i4 = 0; i4 < 10; i4++) {
            this.at[i4] = null;
        }
        for (int i5 = 0; i5 < 12; i5++) {
            this.aj[i5] = null;
        }
        for (int i6 = 0; i6 < 5; i6++) {
            this.aQ[i6] = null;
            this.I[i6] = null;
            this.c[i6] = null;
            this.t[i6] = null;
            this.aw[i6] = null;
        }
        this.r = null;
        System.gc();
    }

    public final void l() {
        for (int i2 = 0; i2 < 24; i2++) {
            this.cn[i2] = null;
        }
        System.gc();
    }

    public final void ad() {
        this.o = null;
        this.cm = null;
    }

    public final void m() throws IOException {
        this.aM = null;
        this.aM = new byte[784];
        for (int i2 = 0; i2 < 16; i2++) {
            this.aM[i2] = aL[i2];
        }
        this.P.close();
    }

    public final void T() throws IOException {
        if (this.bW == 0) {
            if (this.bz) {
                H();
                this.bz = false;
                this.aC = 1;
                this.bV = 0;
                this.ay = 0;
                this.cs.drawImage(this.cm, i / 2, G / 2, 3);
                repai_m();
                serviceRepaints();
            }
            if (this.ay < 70) {
                this.ay++;
                return;
            } else {
                Z();
                return;
            }
        }
        if (this.bW == 8) {
            b();
            return;
        }
        if (this.bW == 7) {
            this.bV++;
            repai_m();
            serviceRepaints();
            return;
        }
        if (this.bW == 6) {
            this.bV++;
            if (this.bV == 40) {
                this.b.cancel();
                al();
                this.bD.a();
            }
            if (this.bV != 17) {
                repai_m();
                serviceRepaints();
                return;
            } else {
                if (this.bT) {
                    return;
                }
                this.bW = 2;
                this.bw = 25;
                this.aC = 0;
                this.aZ = 0;
                return;
            }
        }
        if (this.bW == 5) {
            this.aC = 0;
            v();
            this.aC = 0;
            this.ca = 0;
            this.bW = 1;
            return;
        }
        if (this.bW == 1) {
            if (this.aT) {
                if (this.ae) {
                    this.bK = 1;
                } else {
                    this.bK = 0;
                }
                try {
                    a("/menu.boq");
                    this.az = 0;
                    this.aF = o(d.G[this.az]);
                    this.H = o(d.G[this.az]);
                    this.L = o(d.G[this.az]);
                    m();
                } catch (IOException unused) {
                }
                this.bV = 0;
                this.aT = false;
            }
            if (this.bV < 14) {
                q(this.bV);
                this.bV++;
                this.ca = 0;
                return;
            } else {
                if (this.bV <= 70) {
                    s();
                    return;
                }
                q(this.bV - 88);
                this.bV--;
                if (this.bV == 70) {
                    N();
                    return;
                }
                return;
            }
        }
        if (this.bW == 2) {
            if (this.ca != 8) {
                repai_m();
                serviceRepaints();
                return;
            }
            this.ca = 0;
            ac();
            this.cs.setColor(0);
            this.cs.fillRect(0, 0, i, G);
            this.bw = 0;
            this.aZ = 0;
            this.aC = 0;
            return;
        }
        if (this.bW == 3) {
            if (this.bp) {
                this.bp = false;
                if (this.bL.n < 20 && this.bL.C >= d.F[this.bL.n][2]) {
                    this.bg = true;
                }
                E();
                if (this.at[0] == null) {
                    h();
                }
                this.bV = 0;
                this.ay = 0;
                this.cp = this.cu.nextInt() & 3;
                if (this.cp == 3) {
                    for (int i2 = 0; i2 < 8; i2++) {
                        for (int i3 = 0; i3 < 9; i3++) {
                            this.bU[i2][i3] = false;
                        }
                    }
                }
            }
            if (this.bV >= 18) {
                A();
                return;
            }
            if (this.bV < 17) {
                z(this.bV, this.cp);
            } else {
                this.cs.setClip(0, 0, i, G);
                y();
                this.ca = 0;
            }
            this.bV++;
            return;
        }
        if (this.bW == 4) {
            if (this.ab) {
                try {
                    a("/man.boq");
                    this.az = 0;
                    b(this.cn, 24);
                    m();
                } catch (IOException unused2) {
                }
                this.bL.a(this.cn);
                this.ab = false;
                E();
                ae();
                P();
                g(this.cs);
                d(this.cs);
                this.cp = this.cu.nextInt() & 3;
                this.bV = 0;
                if (this.cp == 0) {
                    this.bW = 7;
                    return;
                }
                return;
            }
            if (this.bV < 18) {
                a(this.r, this.bV, this.cp);
                this.bV++;
                this.ca = 0;
                return;
            }
            if (this.ax) {
                aA();
                return;
            }
            if (this.am) {
                aj();
                return;
            }
            if (this.bB) {
                aF();
                return;
            }
            if (this.bL.l) {
                this.bL.m++;
                this.bL.m &= 7;
                if (this.bL.m == 0) {
                    this.bL.l = false;
                    aa();
                }
                this.bL.c();
                this.bL.a(this.cs);
                repai_m();
                return;
            }
            if (this.cc[this.bL.x][this.bL.c].f > 8 && this.cc[this.bL.x][this.bL.c].f < 23) {
                if ((!this.bL.G) & (!this.bL.r) & (!this.bL.v)) {
                    int i4 = this.cc[this.bL.x][this.bL.c].f;
                    this.cc[this.bL.x][this.bL.c].f = -1;
                    j(i4);
                }
            }
            if (this.cc[this.bL.x][this.bL.c].f == 27 || this.cc[this.bL.x][this.bL.c].f == 28) {
                this.bB = true;
                this.bw = 0;
                E();
                h(this.bL.x, this.bL.c);
            }
            if (this.ai) {
                if (this.ay == 0) {
                    q(26, 50);
                    repai_m();
                }
                this.ay++;
                this.ay &= 15;
                if (this.ay == 0) {
                    this.bL.r = true;
                    if (this.bL.i == this.bL.F || this.bL.i == this.bL.E) {
                        this.bL.a(this.bL.H);
                    } else {
                        this.bL.a(this.bL.u);
                    }
                    this.ai = false;
                    return;
                }
                return;
            }
            if (this.bu) {
                if (this.ay == 0) {
                    m(this.aO);
                    repai_m();
                }
                this.ay++;
                this.ay &= 31;
                if (this.ay == 0) {
                    this.bu = false;
                    return;
                }
                return;
            }
            if (this.cc[this.bL.x][this.bL.c].f >= 0 && this.cc[this.bL.x][this.bL.c].f <= 8 && this.bL.D == 0 && this.bL.f == 0 && !this.cc[this.bL.x][this.bL.c].a && !this.bL.v && this.bL.x == 12) {
                this.bL.G = true;
                this.bL.q = false;
            }
            if (this.bL.v || this.bL.x >= 12) {
                ar();
                if (this.bW == 3) {
                    return;
                }
                aG();
                ai();
                as();
                ax();
                u();
            } else {
                this.bL.f = (this.bL.f + 1) & 3;
                if (this.bL.f == 0) {
                    this.bL.x++;
                    if (this.bL.x == 12) {
                        this.bL.z = 0;
                    }
                }
                this.ca = 0;
            }
            if (!this.al) {
                n();
                c(this.cs);
            }
            repai_m();
            serviceRepaints();
        }
    }

    public final void N() {
        this.b.cancel();
        al();
        this.bD.a();
    }

    public final void l(int i2) {
        int iNextInt = this.cu.nextInt() & 7;
        if (this.cc[26][iNextInt].f < 23) {
            this.cc[26][iNextInt].f = i2;
        }
    }

    public final Image[] k(int i2) {
        switch (i2) {
            case 9:
                return this.co;
            case 10:
                return this.cf;
            case 11:
                return this.an;
            case 12:
                return this.ac;
            case 13:
                return this.aH;
            case 14:
                return this.ag;
            case 15:
                return this.bt;
            case 16:
                return this.bR;
            default:
                return null;
        }
    }

    public final void j(int i2) {
        this.as = i2 - 9;
        this.cb = true;
        this.p = 0;
        switch (i2) {
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
                if (this.bL.B >= this.bL.j) {
                    this.as = 13;
                    break;
                } else {
                    if (this.bL.M[this.as] == 0) {
                        this.bL.P++;
                    }
                    int[] iArr = this.bL.M;
                    int i3 = this.as;
                    iArr[i3] = iArr[i3] + 1;
                    this.bL.B++;
                    break;
                }
            case 17:
                this.bL.b(20);
                break;
            case 18:
                this.bL.C += 1000;
                break;
            case 19:
                this.bL.C += 2000;
                break;
            case 20:
                this.bL.C += 1000;
                break;
            case 21:
                this.bL.C += 5000;
                break;
        }
    }

    public final int a(f fVar) {
        int i2 = 0;
        switch (fVar.e) {
            case 0:
            case 15:
                i2 = 0;
                break;
            case 1:
            case 3:
            case 5:
            case 7:
            case 9:
            case 11:
            case 13:
                i2 = -1;
                break;
            case 2:
            case 4:
            case 6:
            case 8:
            case 10:
            case 12:
            case 14:
                i2 = 1;
                break;
        }
        return i2;
    }

    public final void ac() {
        a(this.bl);
        this.f = 3;
        this.ch = 6;
        this.bb = 47;
        this.bW = 3;
    }

    public final void m(int i2) {
        c(20, 8, 136, 51);
        this.cs.setColor(102);
        this.cs.drawString(d.Q[i2 - 1][1], i / 2, 16, 17);
        this.cs.drawString(new StringBuffer().append("第    ").append(((this.cl - this.bn) / 100) + 1).append("    层").toString(), i / 2, 37, 17);
    }

    public final void ah() {
        int iNextInt;
        if (this.bL.n == 1 && this.bL.C == 0) {
            this.af = 3;
        } else if (this.bL.n >= 4 || this.bL.C >= 80000) {
            do {
                iNextInt = this.cu.nextInt() & 7;
            } while (iNextInt == 0);
            if (iNextInt < 3) {
                this.af = 3;
            } else if (iNextInt < 6) {
                this.af = 4;
            } else {
                this.af = 5;
            }
        } else {
            int iNextInt2 = this.cu.nextInt() & 3;
            if (iNextInt2 < 2) {
                this.af = 3;
            } else if (iNextInt2 == 2) {
                this.af = 4;
            } else {
                this.af = 5;
            }
        }
        this.bN = new int[this.af];
        this.bN[this.af - 1] = 4;
        int i2 = 0;
        while (true) {
            int iNextInt3 = this.cu.nextInt() & 3;
            if (y(iNextInt3, i2)) {
                this.bN[i2] = iNextInt3;
                i2++;
                if (i2 == this.af - 1) {
                    return;
                }
            }
        }
    }

    public final void e() {
        this.aO = this.Q[this.f][this.ch];
        int i2 = this.aO - 1;
        this.bn = d.o[i2][0];
        this.bP = 0;
        this.cl = 0;
        this.bQ = d.o[i2][1];
        this.z = false;
        this.bu = false;
        this.m = false;
        this.bB = false;
        this.ab = true;
        this.bL.I = this.bL.J;
        if (i2 < 2) {
            this.bn = ((this.cu.nextInt() & 3) + 1) * 100;
            if (this.bL.n == 1 && this.bn > 100) {
                this.bn = (((this.cu.nextInt() & 3) % 3) + 1) * 100;
            }
            this.bQ = this.bn * 50;
        }
        if (i2 == 13) {
            this.bn = Integer.MAX_VALUE;
        }
        if (i2 >= 15) {
            this.bP = d.o[i2][2];
        }
        this.R = this.bP + this.bn;
        this.aK = this.bn;
        this.bN = new int[5];
        for (int i3 = 0; i3 < 5; i3++) {
            this.bN[i3] = i3;
        }
        this.af = 5;
        this.al = false;
        this.aZ = 0;
        this.aY.removeAllElements();
    }

    public final void u() {
        if (this.al || this.bL.G || this.bL.v || this.bL.r || this.bL.w || this.s || this.bL.q || this.bL.K) {
            return;
        }
        switch (this.ca) {
            case 1:
                this.ca = 0;
                this.bL.a(this.bL.p);
                this.y = 1;
                break;
            case 2:
                if (this.bh || this.ct) {
                    if (this.bL.i[0] == 2) {
                        D();
                        this.bL.a(this.bL.F);
                    } else {
                        this.bL.a(this.bL.F);
                    }
                    this.y = 2;
                    this.ct = false;
                    break;
                }
                break;
            case 5:
                if (this.bh || this.ct) {
                    if (this.bL.i[0] == 7) {
                        f();
                        this.bL.a(this.bL.t);
                    } else {
                        this.bL.a(this.bL.t);
                    }
                    this.y = 5;
                    this.ct = false;
                    break;
                }
                break;
            case 6:
                this.ca = 0;
                this.bL.a(this.bL.e);
                this.y = 6;
                break;
            case 8:
                if (this.bh || this.ct) {
                    this.bL.K = true;
                    r(this.y);
                    this.ct = false;
                    break;
                }
                break;
            case 13:
                this.ca = 0;
                this.am = true;
                break;
        }
    }

    public final boolean x() {
        return this.aO == 15;
    }

    public final boolean v(int i2, int i3) {
        int i4 = this.cc[i2][i3].f;
        return i4 >= 25 && i4 <= 28;
    }

    public final boolean b(int i2) {
        return this.aW < 7 && this.Q[this.W[this.aW][0]][this.W[this.aW][1]] == i2;
    }

    public final boolean p(int i2, int i3) {
        int i4 = this.cc[i2][i3].f;
        if (i4 >= 0) {
            return (i4 > 8 && i4 < 23) || v(i2, i3);
        }
        return true;
    }

    public final boolean h(int i2) {
        return i2 == 1;
    }

    public final boolean p(int i2) {
        return this.cl % 100 == i2;
    }

    public final boolean g() {
        return this.aW == 7;
    }

    public final boolean t(int i2, int i3) {
        return this.cc[i2][i3].f < 0;
    }

    public final boolean u(int i2, int i3) {
        return i2 == i3 ? i2 < 9 || i2 == 23 || i2 == 24 : i2 >= 4 && i2 <= 8 && i3 >= 4 && i3 <= 8;
    }

    public final boolean d(int i2) {
        return i2 >= 4 && i2 <= 13;
    }

    public final boolean i(int i2, int i3) {
        return this.cc[i2][i3].f >= 4 && this.cc[i2][i3].f <= 8;
    }

    public final boolean z() {
        return this.cl >= this.R - 11 && this.cl <= this.R - 6;
    }

    public final boolean f(int i2) {
        return this.cl == (this.R - 12) - i2;
    }

    public final boolean aE() {
        int i2 = this.cl % 100;
        if (i2 < 81 || i2 > 86) {
            return false;
        }
        if (i2 != 86) {
            return true;
        }
        ah();
        return true;
    }

    @Override // com.kimjunco.j2me.ConvKeyCanvas
    public final void keyPress_m(int i2) {
        this.ca = getGameAction(i2);
        if (i2 == -22) {
            this.ca = 8;
        } else if (i2 == 55 || i2 == 57 || i2 == -21) {
            this.ca = 13;
        }
        this.bh = true;
        this.ct = true;
    }

    @Override // com.kimjunco.j2me.ConvKeyCanvas
    public final void keyReleas_m(int i2) {
        this.bh = false;
    }

    public final void Y() {
        for (int i2 = 26; i2 > 0; i2--) {
            for (int i3 = 0; i3 < 8; i3++) {
                this.cc[i2][i3].a(this.cc[i2 - 1][i3]);
            }
        }
        for (int i4 = 0; i4 < 8; i4++) {
            this.cc[0][i4].f = -1;
            this.cc[0][i4].b();
        }
    }

    public final void F() {
        int i2;
        if (this.cl == this.bn && this.bP > 0 && !this.m) {
            this.z = true;
            this.m = true;
            this.bs = new boolean[this.bP / 100];
        }
        if (this.z && p(0) && (i2 = (this.cl - this.bn) / 100) < this.bs.length && !this.bs[i2]) {
            this.bu = true;
            this.bs[i2] = true;
        }
        for (int i3 = 0; i3 < 26; i3++) {
            for (int i4 = 0; i4 < 8; i4++) {
                this.cc[i3][i4].a(this.cc[i3 + 1][i4]);
            }
        }
        if (p(95)) {
            for (int i5 = 0; i5 < 12; i5++) {
                for (int i6 = 0; i6 < 8; i6++) {
                    this.cc[i5][i6].f = -1;
                    this.cc[i5][i6].b();
                }
            }
        }
        if (aE()) {
            for (int i7 = 0; i7 < 8; i7++) {
                this.cc[26][i7].f = 23;
                this.cc[26][i7].b();
            }
            return;
        }
        if (f(1)) {
            for (int i8 = 0; i8 < 8; i8++) {
                this.cc[26][i8].f = -1;
                this.cc[26][i8].b();
            }
            this.cc[26][3].f = 25;
            this.cc[26][4].f = 26;
            return;
        }
        if (f(0)) {
            for (int i9 = 0; i9 < 8; i9++) {
                this.cc[26][i9].f = -1;
                this.cc[26][i9].b();
            }
            this.cc[26][3].f = 27;
            this.cc[26][4].f = 28;
            return;
        }
        if (z()) {
            for (int i10 = 0; i10 < 8; i10++) {
                this.cc[26][i10].f = 24;
                this.cc[26][i10].b();
            }
            return;
        }
        for (int i11 = 0; i11 < 8; i11++) {
            this.aX = (this.cu.nextInt() & 15) % this.af;
            if (this.bN[this.aX] == 4 && !this.z) {
                this.aX = (this.cu.nextInt() & 15) % this.af;
            }
            this.cc[26][i11].f = this.bN[this.aX];
            this.cc[26][i11].b();
        }
        this.bG = this.cu.nextInt() & 7;
        if (this.bL.n < 6 && this.bL.C < 100000) {
            this.bG = 0;
        }
        if ((this.bG & 1) == 0) {
            int iNextInt = (this.cu.nextInt() & 31) + 1;
            if (iNextInt < 4) {
                this.aX = (this.cu.nextInt() & 7) + 9;
                if (this.aX == 16) {
                    this.aX = (this.cu.nextInt() & 7) + 9;
                }
                l(this.aX);
            }
            if (iNextInt == 6 || iNextInt == 5) {
                this.aX = (this.cu.nextInt() & 3) + 18;
                l(this.aX);
            }
            if (iNextInt == 7) {
                this.aX = (this.cu.nextInt() & 1) + 16;
                l(this.aX);
            }
        }
        if (this.z) {
            this.bG = this.cu.nextInt() & 7;
            if ((this.bG & 1) == 0) {
                this.aX = (this.cu.nextInt() & 3) + 18;
                l(this.aX);
                this.aX = this.cu.nextInt() & 3;
                if (this.aX == 0) {
                    this.aX = (this.cu.nextInt() & 15) - 3;
                    if (this.aX >= 0) {
                        l(this.aX + 9);
                    }
                }
            }
        }
    }

    public final void r() {
        this.ay = (this.ay + 1) & 3;
        if (this.bj > 0) {
            this.bj -= 5;
        }
        if (this.bj < 0) {
            this.bj += 5;
        }
        if (this.Z < 0) {
            this.bb -= 5;
            if (this.bb < 0) {
                this.bb = 320 + this.bb;
            }
            if (this.ay == 2) {
                for (int i2 = 9; i2 > 0; i2--) {
                    this.at[i2] = this.at[i2 - 1];
                }
                try {
                    this.at[0] = Image.createImage(new StringBuffer().append("/images/worldmap").append(this.g).append(".png").toString());
                } catch (IOException unused) {
                }
                this.g--;
                if (this.g == 0) {
                    this.g = 16;
                }
                this.cr--;
                if (this.cr == 0) {
                    this.cr = 16;
                }
            }
        }
        if (this.Z > 0) {
            this.bb += 5;
            if (this.bb > 320) {
                this.bb -= 320;
            }
            if (this.ay == 3) {
                for (int i3 = 0; i3 < 9; i3++) {
                    this.at[i3] = this.at[i3 + 1];
                }
                try {
                    this.at[9] = Image.createImage(new StringBuffer().append("/images/worldmap").append(this.cr).append(".png").toString());
                } catch (IOException unused2) {
                }
                this.cr++;
                if (this.cr > 16) {
                    this.cr = 1;
                }
                this.g++;
                if (this.g > 16) {
                    this.g = 1;
                }
            }
        }
        if (this.ay == 0) {
            this.bj = 0;
            this.Z = 0;
            this.A = false;
        }
    }

    public final void D() {
        if (this.bL.q || this.bL.c <= 0) {
            return;
        }
        if (p(this.bL.x, this.bL.c - 1)) {
            this.bL.q = true;
            this.bL.a(this.bL.F);
            this.bL.s = -1;
            if (p(this.bL.x + 1, this.bL.c - 1) && t(this.bL.x, this.bL.c - 1)) {
                this.ci = -1;
                this.s = true;
                return;
            }
            return;
        }
        if (p(this.bL.x - 1, this.bL.c - 1) && p(this.bL.x - 1, this.bL.c)) {
            this.bL.q = true;
            this.bL.a(this.bL.F);
            this.bL.s = -1;
            this.s = true;
            this.ci = 1;
        }
    }

    public final void f() {
        if (this.bL.q || this.bL.c >= 7) {
            return;
        }
        if (p(this.bL.x, this.bL.c + 1)) {
            this.bL.q = true;
            this.bL.a(this.bL.t);
            this.bL.s = 1;
            if (p(this.bL.x + 1, this.bL.c + 1) && t(this.bL.x, this.bL.c + 1)) {
                this.ci = -1;
                this.s = true;
                return;
            }
            return;
        }
        if (p(this.bL.x - 1, this.bL.c + 1) && p(this.bL.x - 1, this.bL.c)) {
            this.bL.q = true;
            this.bL.a(this.bL.t);
            this.bL.s = 1;
            this.s = true;
            this.ci = 1;
        }
    }

    public final void O() {
        this.ab = true;
        this.bq = 0;
        this.M = 0;
        this.bL.d();
    }

    @Override // com.kimjunco.j2me.ConvKeyCanvas
    public final void pai_m(Graphics graphics) {
        if (this.bW == 2) {
            graphics.setFont(Font.getFont(0, 0, 8));
            i(graphics);
            return;
        }
        if (this.bW == 4 && this.ax) {
            graphics.setColor(0);
            graphics.fillRect(0, 0, i, G);
            if (this.ay < 30) {
                graphics.drawImage(this.r, ((this.ay & 1) * 2) - 1, 0, 20);
                return;
            }
            if (this.ay < 48) {
                c(graphics, this.ay - 30);
                return;
            }
            a(graphics, (G - (3 * (this.ay - 50))) - 44, 0, 16777215);
            graphics.setColor(16777215);
            graphics.drawString("程序：徐文", i / 2, (G - (3 * (this.ay - 50))) + 85, 17);
            graphics.drawString("美工：王伟", i / 2, (G - (3 * (this.ay - 50))) + 100, 17);
            graphics.drawString("策划：冉锦 许像法", i / 2, (G - (3 * (this.ay - 50))) + 115, 17);
            graphics.drawString("恭喜你，通关了！", i / 2, (G - (3 * (this.ay - 50))) + 160, 17);
            int i2 = (G - (3 * (this.ay - 50))) + 210;
            int i3 = i2;
            if (i2 < 95) {
                i3 = 95;
            }
            graphics.drawString("BOOQIO移动科技欢迎你的加盟", i / 2, i3, 17);
            graphics.drawString("为你打造更多更精彩的手机游戏", i / 2, i3 + 15, 17);
            return;
        }
        if (this.bW == 7) {
            for (int i4 = 0; i4 < 16; i4 += 2) {
                graphics.setClip(0, i4 * 16, 11 * this.bV, 16);
                graphics.drawImage(this.r, (-i) + (this.bV * 11), 0, 20);
            }
            for (int i5 = 1; i5 < 16; i5 += 2) {
                graphics.setClip(i - (11 * this.bV), i5 * 16, 11 * this.bV, 20);
                graphics.drawImage(this.r, i - (this.bV * 11), 0, 20);
            }
            if (this.bV == 16) {
                this.bV = 18;
                this.bW = 4;
                return;
            }
            return;
        }
        if (this.bW == 6) {
            graphics.setColor(0);
            graphics.fillRect(0, 0, i, G);
            if (this.bT) {
                a(graphics, 80, 16777215, 0);
            }
            if (this.r != null) {
                c(graphics, this.bV);
                return;
            }
            return;
        }
        if (this.bW != 5) {
            graphics.drawImage(this.r, this.aV, this.ce, 20);
            if (this.al) {
                c(graphics);
                f(graphics);
                return;
            }
            return;
        }
        graphics.setFont(Font.getFont(0, 0, 8));
        graphics.setColor(394755);
        graphics.fillRect(0, 0, i, G);
        graphics.setColor(16777215);
        graphics.drawString("载入中...", 38, 90, 20);
        graphics.drawRect(38, 120, 101, 11);
        graphics.setColor(16711680);
        graphics.fillRect(39, 121, 10 * this.aC, 10);
    }

    public final void J() throws IOException {
        if (this.aA) {
            if (this.aG) {
                this.aG = false;
                this.ah = true;
                this.bI = 0;
            }
            o();
            return;
        }
        if (this.B) {
            if (this.bi) {
                this.bi = false;
                this.bg = false;
                E();
                w(32, 40);
            }
            p();
            return;
        }
        switch (this.ca) {
            case 1:
                this.ca = 0;
                this.aq = this.aq == 0 ? 2 : this.aq - 1;
                break;
            case 6:
                this.ca = 0;
                this.aq = this.aq == 2 ? 0 : this.aq + 1;
                break;
            case 8:
                this.ca = 0;
                if (this.aq != 2) {
                    if (this.aq != 0) {
                        if (this.aq == 1) {
                            this.B = true;
                            break;
                        }
                    } else {
                        this.aA = true;
                        break;
                    }
                } else {
                    U();
                    return;
                }
                break;
            case 13:
                this.ca = 0;
                U();
                return;
        }
        C();
    }

    public final void q() throws IOException {
        if (this.J) {
            aq();
            return;
        }
        switch (this.ca) {
            case 1:
                this.ca = 0;
                if (this.d > 0) {
                    this.d--;
                    if (this.by <= 0) {
                        this.N--;
                        break;
                    } else {
                        this.by--;
                        break;
                    }
                }
                break;
            case 6:
                this.ca = 0;
                if (this.d < 7) {
                    this.d++;
                    if (this.by >= 3) {
                        this.N++;
                        break;
                    } else {
                        this.by++;
                        break;
                    }
                }
                break;
            case 8:
                this.ca = 0;
                this.J = true;
                break;
            case 13:
                this.ca = 0;
                this.N = 0;
                this.d = 0;
                this.by = 0;
                this.ah = true;
                L();
                return;
        }
        M();
    }

    public final void aq() {
        if (this.cb) {
            this.ay++;
            this.ay &= 15;
            if (this.ay == 0) {
                this.cb = false;
                this.J = false;
                this.bT = false;
                return;
            }
            return;
        }
        switch (this.ca) {
            case 2:
            case 5:
                this.ca = 0;
                this.bT = !this.bT;
                break;
            case 8:
                this.ca = 0;
                a(10, 163, 100, 35, 15592936);
                if (!this.bT) {
                    this.J = false;
                    return;
                }
                if (this.bL.C < d.m[this.d]) {
                    d(15, 170, d.d);
                    this.cb = true;
                    repai_m();
                    return;
                }
                if (this.bL.B == this.bL.j) {
                    d(15, 170, d.W);
                    this.cb = true;
                    repai_m();
                    return;
                }
                if (this.bL.M[this.d] == 0) {
                    this.bL.P++;
                }
                this.bL.B++;
                int[] iArr = this.bL.M;
                int i2 = this.d;
                iArr[i2] = iArr[i2] + 1;
                this.bL.C -= d.m[this.d];
                n(15, 170);
                this.cb = true;
                repai_m();
                return;
        }
        a(10, 163, 100, 35, 15592936);
        d(10, 170, d.X);
        if (this.bT) {
            d(60, 170, d.S);
        } else {
            d(60, 170, d.I);
        }
        repai_m();
    }

    public final boolean w() {
        switch (this.ca) {
            case 1:
                this.ca = 0;
                this.D--;
                if (this.D < 0) {
                    this.D = 3;
                    break;
                }
                break;
            case 6:
                this.ca = 0;
                this.D = (this.D + 1) & 3;
                break;
            case 8:
                this.ca = 0;
                if (this.D == 2) {
                    this.bp = true;
                    for (int i2 = 0; i2 < 10; i2++) {
                        this.at[i2] = null;
                    }
                    System.gc();
                    this.bW = 1;
                    break;
                } else if (this.D == 3) {
                    this.bW = 3;
                    y();
                    break;
                } else if (this.D == 0) {
                    this.ar = true;
                    break;
                } else {
                    this.aa = true;
                    this.cl = 0;
                    break;
                }
            case 13:
                this.ca = 0;
                this.bW = 3;
                y();
                break;
        }
        return false;
    }

    public final void b() {
        c(32, 29, 110, 119);
        if (this.ar) {
            if (this.ca != 13) {
                ab();
                return;
            } else {
                this.ca = 0;
                this.ar = false;
                return;
            }
        }
        if (this.aa) {
            if (this.ca != 13) {
                aw();
                return;
            } else {
                this.ca = 0;
                this.aa = false;
                return;
            }
        }
        if (w()) {
            d(70, 49, d.P);
            d(70, 67, d.ad);
            d(70, 85, d.T);
            d(70, 103, d.U);
            this.n = (this.n + 1) & 3;
            r(49 - this.n, 49 + (this.D * 18));
            this.cs.setColor(15788152);
            this.cs.fillRect(4, 164, 168, 40);
            this.cs.setColor(0);
            this.cs.drawString(d.c[this.D], 6, 164, 20);
            repai_m();
            serviceRepaints();
        }
    }

    public final void c() {
        if (this.ca != 13 && this.ca != 8) {
            c(25, 24, 124, 159);
            m(45, 40);
        } else {
            this.ca = 0;
            this.ba = false;
            i();
        }
    }

    public final void Z() {
        if (this.ca != 0) {
            this.bW = 5;
            this.ca = 0;
            this.aC = 0;
            this.aZ = 0;
            this.bV = 0;
            this.ay = 0;
            return;
        }
        this.bV++;
        if (this.bV == 90) {
            this.ca = 1;
        }
        if (this.aC != 10000) {
            this.aC++;
            this.aZ += this.aC;
            x(i / 2, this.aZ);
            if (this.aZ >= G / 2) {
                this.aC = ((-this.aC) * 7) / 8;
                if (this.aC == 0) {
                    this.aC = 10000;
                }
            }
        }
    }

    public final void A() throws IOException {
        if (this.bc) {
            if (this.v) {
                this.v = false;
                this.aq = 0;
            }
            J();
            return;
        }
        if (!this.A && !this.cb) {
            if (this.ca != 0) {
                this.bg = false;
            }
            if (this.ca == 8) {
                this.ca = 0;
                if (this.Q[this.f][this.ch] == 3) {
                    this.bc = true;
                    return;
                }
                if (!this.bC[this.f][this.ch] && this.Q[this.f][this.ch] != 1) {
                    if ((this.Q[this.f][this.ch] == 15 || this.Q[this.f][this.ch] == 14) && !g()) {
                        return;
                    }
                    if (this.Q[this.f][this.ch] < 4 || this.Q[this.f][this.ch] > 13 || b(this.Q[this.f][this.ch])) {
                        e();
                        au();
                        return;
                    } else {
                        this.cb = true;
                        this.p = 0;
                        return;
                    }
                }
            } else if (this.ca == 2 && (this.bh || this.ct)) {
                this.ct = false;
                this.A = true;
                this.Z = -5;
                this.ch--;
                if (this.ch < 0) {
                    this.ch = 15;
                }
                if (h(this.Q[this.f][this.ch])) {
                    this.j = 0;
                } else {
                    a(this.aJ);
                }
            } else if (this.ca == 5 && (this.bh || this.ct)) {
                this.ct = false;
                this.A = true;
                this.Z = 5;
                this.ch = (this.ch + 1) & 15;
                if (h(this.Q[this.f][this.ch])) {
                    this.j = 0;
                } else {
                    a(this.bl);
                }
            } else if (this.ca == 1 && (this.bh || this.ct)) {
                this.ct = false;
                if (this.f > 0) {
                    this.f--;
                    this.A = true;
                    this.bj = 20;
                    if (h(this.Q[this.f][this.ch])) {
                        this.j = 1;
                    } else {
                        a(this.aR);
                    }
                }
            } else if (this.ca == 6 && (this.bh || this.ct)) {
                this.ct = false;
                if (this.f < 7) {
                    this.f++;
                    this.A = true;
                    this.bj = -20;
                    if (h(this.Q[this.f][this.ch])) {
                        this.j = 1;
                    } else {
                        a(this.bX);
                    }
                }
            } else if (this.ca == 13) {
                this.ca = 0;
                this.bW = 8;
                this.D = 0;
                E();
                this.ar = false;
                this.aa = false;
                return;
            }
        }
        if (this.cb) {
            this.p = (this.p + 1) & 15;
            if (this.p == 0) {
                this.cb = false;
                this.cs.setColor(15788152);
                this.cs.fillRect(4, 164, 168, 40);
                j(this.f, this.ch);
            } else {
                ay();
            }
            repai_m();
            serviceRepaints();
        }
        if (this.A) {
            r();
            y();
        }
    }

    public final void s() {
        if (this.bO) {
            this.aZ = (this.aZ + 1) & 1;
            if (this.ca == 13 || this.ca == 8) {
                this.bq = 0;
                this.ay = 0;
                this.aZ = 0;
                q(13);
                this.bO = false;
                this.ca = 0;
                return;
            }
            if (this.ca == 2) {
                this.bq--;
                this.ay = 0;
                if (this.bq < 0) {
                    this.bq = 2;
                }
                this.ca = 0;
            } else if (this.ca == 5) {
                this.bq++;
                if (this.bq > 2) {
                    this.bq = 0;
                }
                this.ay = 0;
                this.ca = 0;
            } else if (this.ca == 1) {
                this.ay--;
                this.ca = 0;
            } else if (this.ca == 6) {
                this.ay++;
                this.ca = 0;
            }
            String[] strArr = new String[0];
            switch (this.bq) {
                case 0:
                    strArr = d.z;
                    break;
                case 1:
                    strArr = d.j;
                    break;
                case 2:
                    strArr = d.Z;
                    break;
            }
            if (this.ay + 6 > strArr.length) {
                this.ay = strArr.length - 6;
            }
            if (this.ay < 0) {
                this.ay = 0;
            }
            a(this.cs, strArr);
            repai_m();
            serviceRepaints();
            return;
        }
        if (this.x) {
            if (this.ca == 13 || this.ca == 8) {
                q(13);
                this.x = false;
                this.ay = 0;
                this.aZ = 0;
                this.bq = 0;
                this.ca = 0;
                return;
            }
            if (this.ca == 1) {
                this.ay--;
                this.ca = 0;
            } else if (this.ca == 6) {
                this.ay++;
                this.ca = 0;
            }
            if (this.ay + 6 > d.J.length) {
                this.ay = d.J.length - 6;
            }
            if (this.ay < 0) {
                this.ay = 0;
            }
            this.aZ = (this.aZ + 1) & 1;
            a(this.cs, d.J);
            repai_m();
            serviceRepaints();
            return;
        }
        if (this.ca == 6) {
            this.ca = 0;
            this.bK++;
            if (this.bK == 5) {
                this.bK = this.ae ? 1 : 0;
            }
            q(13);
            return;
        }
        if (this.ca == 1) {
            this.ca = 0;
            this.bK--;
            if (this.bK < 0 || (this.ae && this.bK == 0)) {
                this.bK = 4;
            }
            q(13);
            return;
        }
        if (this.ca == 8) {
            this.ca = 0;
            if (this.bK < 2) {
                if (this.aI) {
                    this.bW = 6;
                    this.aI = false;
                    this.bV = 0;
                } else {
                    this.bW = 3;
                    if (this.bK == 1) {
                        ac();
                    }
                }
                if (this.bK == 0) {
                    b(false);
                } else {
                    this.cr = 13;
                    this.g = 2;
                    b(true);
                }
                this.ae = false;
                this.aT = true;
                this.aF = null;
                this.H = null;
                this.L = null;
                System.gc();
            }
            if (this.bK == 2) {
                this.bq = 0;
                this.ay = 0;
                this.aZ = 0;
                this.bO = true;
            }
            if (this.bK == 3) {
                this.ay = 0;
                this.bq = 3;
                this.x = true;
            }
            if (this.bK == 4) {
                this.bV = 100;
            }
        }
    }

    public final void aj() throws IOException {
        if (this.k) {
            this.k = false;
            this.M = 0;
            E();
            K();
        }
        if (this.e) {
            k();
            return;
        }
        if (this.ba) {
            c();
            return;
        }
        if (this.bd) {
            a(false);
            return;
        }
        if (this.E) {
            a(true);
            return;
        }
        switch (this.ca) {
            case 1:
                this.ca = 0;
                this.M--;
                if (this.M < 0) {
                    this.M = 3;
                    break;
                }
                break;
            case 6:
                this.ca = 0;
                this.M++;
                this.M &= 3;
                break;
            case 8:
                this.ca = 0;
                if (this.M != 0) {
                    if (this.M != 1) {
                        if (this.M == 2) {
                            this.bd = true;
                        }
                        if (this.M == 3) {
                            this.E = true;
                            break;
                        }
                    } else {
                        E();
                        this.ba = true;
                        return;
                    }
                } else {
                    E();
                    this.bq = 0;
                    this.e = true;
                    return;
                }
                break;
            case 13:
                this.ca = 0;
                i();
                return;
        }
        c(45, 64, 22, 80, 15788152);
        this.n = (this.n + 1) & 3;
        r(49 - this.n, 64 + (this.M * 18));
        repai_m();
        serviceRepaints();
    }

    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    /* JADX WARN: Removed duplicated region for block: B:15:0x008a  */
    /* JADX WARN: Removed duplicated region for block: B:17:0x009a  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public final void an() {
        /*
            r4 = this;
            r0 = r4
            int r0 = r0.ca
            switch(r0) {
                case 1: goto L30;
                case 6: goto L51;
                case 8: goto L78;
                case 13: goto L73;
                default: goto La7;
            }
        L30:
            r0 = r4
            r1 = 0
            r0.ca = r1
            r0 = r4
            int r0 = r0.bI
            if (r0 != 0) goto L44
            r0 = r4
            r1 = 2
            r0.bI = r1
            goto La7
        L44:
            r0 = r4
            r1 = r0
            int r1 = r1.bI
            r2 = 1
            int r1 = r1 - r2
            r0.bI = r1
            goto La7
        L51:
            r0 = r4
            r1 = 0
            r0.ca = r1
            r0 = r4
            int r0 = r0.bI
            r1 = 2
            if (r0 != r1) goto L66
            r0 = r4
            r1 = 0
            r0.bI = r1
            goto La7
        L66:
            r0 = r4
            r1 = r0
            int r1 = r1.bI
            r2 = 1
            int r1 = r1 + r2
            r0.bI = r1
            goto La7
        L73:
            r0 = r4
            r1 = 2
            r0.bI = r1
        L78:
            r0 = r4
            r1 = 0
            r0.ca = r1
            r0 = r4
            r1 = 0
            r0.ah = r1
            r0 = r4
            int r0 = r0.bI
            r1 = 1
            if (r0 != r1) goto L9a
            r0 = r4
            r1 = 0
            r0.N = r1
            r0 = r4
            r1 = 0
            r0.bq = r1
            r0 = r4
            r1 = 0
            r0.by = r1
            return
        L9a:
            r0 = r4
            int r0 = r0.bI
            r1 = 2
            if (r0 != r1) goto La6
            r0 = r4
            r0.af()
        La6:
            return
        La7:
            r0 = r4
            r0.V()
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: zdxz.b.an():void");
    }

    public final void B() throws IOException {
        if (this.bL.P == 0) {
            if (this.ca == 13) {
                this.ca = 0;
                this.bq = 0;
                this.N = 0;
                this.by = 0;
                L();
                this.ah = true;
            }
        } else {
            if (this.cq) {
                ao();
                return;
            }
            switch (this.ca) {
                case 1:
                    this.ca = 0;
                    if (this.bq > 0) {
                        this.bq--;
                        if (this.by <= 0) {
                            this.N--;
                            break;
                        } else {
                            this.by--;
                            break;
                        }
                    }
                    break;
                case 6:
                    this.ca = 0;
                    if (this.bq < this.bL.P - 1) {
                        this.bq++;
                        if (this.by >= 3) {
                            this.N++;
                            break;
                        } else {
                            this.by++;
                            break;
                        }
                    }
                    break;
                case 8:
                    this.ca = 0;
                    this.cq = true;
                    return;
                case 13:
                    this.J = false;
                    this.ca = 0;
                    this.bq = 0;
                    this.N = 0;
                    this.by = 0;
                    L();
                    this.ah = true;
                    return;
            }
        }
        ag();
    }

    public final void ao() {
        switch (this.ca) {
            case 2:
            case 5:
                this.ca = 0;
                this.bT = !this.bT;
                break;
            case 8:
                if (this.bT) {
                    g(this.bq);
                }
                this.ca = 0;
                this.bT = false;
                this.cq = false;
                return;
        }
        a(10, 163, 100, 35, 15592936);
        d(10, 170, d.X);
        if (this.bT) {
            d(60, 170, d.S);
        } else {
            d(60, 170, d.I);
        }
        repai_m();
    }

    public final void o() throws IOException {
        if (this.ah) {
            an();
        } else if (this.bI == 0) {
            q();
        } else if (this.bI == 1) {
            B();
        }
    }

    public final void a(boolean z) throws IOException {
        c(37, 85, 100, 34);
        d(42, 95, d.X);
        switch (this.ca) {
            case 2:
            case 5:
                this.ca = 0;
                this.bT = !this.bT;
                break;
            case 8:
                this.ca = 0;
                if (this.bT && !z) {
                    this.bW = 3;
                    l();
                    b(false);
                    if (this.cl > this.bL.b) {
                        this.bL.b = this.cl;
                        L();
                    }
                    this.am = false;
                    this.k = true;
                    this.cb = false;
                    O();
                }
                if (this.bT && z) {
                    this.bW = 6;
                    this.bV = 0;
                }
                this.bd = false;
                this.E = false;
                if (!this.bT) {
                    K();
                }
                if (!this.bT || z) {
                    return;
                }
                this.bT = false;
                return;
        }
        if (this.bT) {
            d(82, 95, d.S);
        } else {
            d(82, 95, d.I);
        }
        repai_m();
        serviceRepaints();
    }

    public final void k() {
        if (this.bL.P != 0) {
            switch (this.ca) {
                case 1:
                    this.ca = 0;
                    if (this.bq > 0) {
                        this.bq--;
                    } else {
                        this.bq = this.bL.P - 1;
                    }
                    this.bf = 0;
                    break;
                case 2:
                    this.ca = 0;
                    if (this.bq > 3) {
                        this.bq -= 4;
                        this.bf = 0;
                        break;
                    }
                    break;
                case 5:
                    this.ca = 0;
                    if (this.bq < 4 && this.bL.P > 4) {
                        if (this.bq + 4 < this.bL.P) {
                            this.bq += 4;
                        } else {
                            this.bq = this.bL.P - 1;
                        }
                        this.bf = 0;
                        break;
                    }
                    break;
                case 6:
                    this.ca = 0;
                    if (this.bq < this.bL.P - 1) {
                        this.bq++;
                    } else {
                        this.bq = 0;
                    }
                    this.bf = 0;
                    break;
                case 8:
                    this.ca = 0;
                    this.e = false;
                    i();
                    this.al = true;
                    this.bq = a(this.bq + 1);
                    n();
                    return;
                case 13:
                    this.ca = 0;
                    this.e = false;
                    this.bq = 0;
                    i();
                    return;
            }
        } else if (this.ca == 13) {
            this.ca = 0;
            this.e = false;
            i();
        }
        aB();
        if (this.bL.B > 0) {
            if (this.bf < 8) {
                this.bf++;
            }
            this.n = (this.n + 1) & 3;
            b((((this.bq / 4) * 66) + 26) - this.n, ((this.bq % 4) * 20) + 34);
            g(a(this.bq + 1), this.bf);
        }
        repai_m();
        serviceRepaints();
    }

    public final void p() throws IOException {
        if (!this.cb) {
            if (this.ca == 8) {
                this.ca = 0;
                if (this.bL.n < 20) {
                    this.cb = true;
                }
            }
            if (this.ca == 13) {
                this.ca = 0;
                I();
                return;
            }
            return;
        }
        if (this.ay == 0) {
            c(34, 94, 108, 35);
            d(69, 99, d.s);
        }
        if (this.ay < 15) {
            this.cs.setColor(16777215);
            this.cs.drawRect(69, 114, 45, 10);
            this.cs.setColor(16711680);
            this.cs.fillRect(69, 114, (this.ay * 3) + 3, 11);
            repai_m();
        }
        this.ay = (this.ay + 1) & 31;
        if (this.ay == 15) {
            c(34, 94, 108, 35);
            if (G()) {
                aC();
                L();
                d(64, 104, d.t);
            } else {
                d(36, 104, d.d);
                d(87, 104, d.k);
            }
            repai_m();
        }
        if (this.ay == 0) {
            this.cb = false;
            I();
        }
    }

    public final void a(int i2, int i3) {
        this.q[this.bS] = i2;
        this.l[this.bS] = i3;
        this.bS++;
    }

    public final void U() {
        this.bp = true;
        this.bc = false;
        this.v = true;
    }

    public final void i() {
        this.am = false;
        this.k = true;
        E();
    }

    public final void af() {
        this.N = 0;
        this.d = 0;
        this.by = 0;
        this.aG = true;
        this.aA = false;
    }

    public final void I() {
        this.B = false;
        this.bi = true;
    }

    /* JADX WARN: Type inference failed for: r0v4, types: [java.io.DataInputStream, java.lang.Throwable] */
    public final void ak() throws IOException {
        ?? dataInputStream;
        try {
            byte[] record = this.aN.getRecord(1);
            dataInputStream = new DataInputStream(new ByteArrayInputStream(record, 0, record.length));
            for (int i2 = 0; i2 < 8; i2++) {
                for (int i3 = 0; i3 < 16; i3++) {
                    this.bC[i2][i3] = dataInputStream.readBoolean();
                }
            }
            int i4 = 0;
            while (i4 < 7 && this.bC[this.W[i4][0]][this.W[i4][1]]) {
                i4++;
            }
            this.aW = i4;
            this.bL.n = dataInputStream.readInt();
            this.bL.j = d.F[this.bL.n - 1][1];
            this.bL.J = d.F[this.bL.n - 1][0];
            this.bL.C = dataInputStream.readInt();
            this.bL.a = dataInputStream.readInt();
            this.bL.b = dataInputStream.readInt();
            this.bL.P = 0;
            this.bL.B = 0;
            for (int i5 = 0; i5 < 8; i5++) {
                this.bL.M[i5] = dataInputStream.readInt();
                if (this.bL.M[i5] != 0) {
                    this.bL.P++;
                    this.bL.B += this.bL.M[i5];
                }
            }
            dataInputStream.close();
        } catch (Exception e) {
            dataInputStream.printStackTrace();
        }
    }

    public final Image o(int i2) throws IOException {
        this.P.read(this.aM, 16, i2);
        for (int i3 = 0; i3 < 12; i3++) {
            this.aM[16 + i2 + i3] = U[i3];
        }
        Image imageCreateImage = Image.createImage(this.aM, 0, i2 + 28);
        this.az++;
        return imageCreateImage;
    }

    public final void b(boolean z) {
        RecordStore recordStore;
        try {
            this.aN = RecordStore.openRecordStore(this.bD.b, true);
            if (this.aN.getNumRecords() <= 0 || z) {
                t();
            } else {
                ak();
            }
            recordStore = this.aN;
            recordStore.closeRecordStore();
        } catch (Exception e) {
            recordStore.printStackTrace();
        }
    }

    public final void ap() throws IOException {
        this.bL.b();
        this.cl = 0;
        for (int i2 = 0; i2 < 8; i2++) {
            for (int i3 = 0; i3 < 16; i3++) {
                this.bC[i2][i3] = false;
            }
        }
        this.aW = 0;
        L();
    }

    public final int a(int i2) {
        int i3 = 0;
        int i4 = 0;
        while (i4 < 8) {
            if (this.bL.M[i4] != 0) {
                i3++;
                if (i3 == i2) {
                    break;
                }
            }
            i4++;
        }
        return i4;
    }

    public final void r(int i2) {
        switch (i2) {
            case 1:
                this.bL.a(this.bL.p);
                break;
            case 2:
                this.bL.a(this.bL.E);
                break;
            case 5:
                this.bL.a(this.bL.g);
                break;
            case 6:
                this.bL.a(this.bL.e);
                break;
        }
    }

    public final void a(int[] iArr) {
        this.bM = iArr;
        this.X = 0;
    }

    public final void h(int i2, int i3) {
        int i4 = -1;
        if (this.cc[i2][i3].f == 27) {
            i4 = 1;
        }
        this.cc[i2 - 1][i3].f = -1;
        this.cc[i2][i3].f = -1;
        this.cc[i2 - 1][i3 + i4].f = -1;
        this.au = 22;
        if (d(this.aO)) {
            this.cc[i2][i3 + i4].f = this.au;
            this.bL.a++;
            if (this.aW < 7) {
                this.aW++;
                return;
            }
            return;
        }
        this.au = (this.cu.nextInt() & 7) % 7;
        this.cc[i2][i3 + i4].f = this.au + 9;
        if (this.bL.B == this.bL.j) {
            this.au = -1;
            return;
        }
        if (this.bL.M[this.au] == 0) {
            this.bL.P++;
        }
        int[] iArr = this.bL.M;
        int i5 = this.au;
        iArr[i5] = iArr[i5] + 1;
        this.bL.B++;
    }

    public final void q(int i2, int i3) {
        c(i2, i3, 124, 51);
        this.cs.setColor(102);
        this.cs.drawString("能量耗尽", i2 + 36, i3 + 8, 20);
        this.cs.drawString("下次要小心", i2 + 29, i3 + 25, 20);
    }

    public final void c(int i2) {
        int i3 = 0;
        if (i2 < 8) {
            i3 = 25;
        }
        c(((i - 130) + i3) >> 1, 168, 130 - i3, 35);
        this.cs.setColor(0);
        this.cs.drawString(d.p[i2], i / 2, 174, 17);
    }

    protected final void showNotify() {
        if (this.b == null) {
            this.b = new Timer();
            this.cj = new c(this);
            this.b.schedule(this.cj, 10L, 50L);
        }
    }

    public final void aF() throws IOException {
        if (this.bw == 0) {
            if (this.ay == 0) {
                A(56, 50);
                repai_m();
            }
            if (this.ay == 15) {
                c(33, 51, 110, 40);
                this.cs.setColor(0);
                if (this.au < 0) {
                    this.cs.drawString("道具栏已满", 88, 61, 17);
                } else if (this.au == 22) {
                    this.cs.drawString("获得挑战金杯", 88, 61, 17);
                } else {
                    this.cs.drawString(new StringBuffer().append("获得").append(d.p[this.au]).toString(), 88, 61, 17);
                }
                repai_m();
            }
            if (this.ay == 30) {
                this.bL.C += this.bQ;
                if (this.bQ > 0) {
                    c(30, 51, 116, 40);
                    this.cs.setColor(102);
                    this.cs.drawString(new StringBuffer().append("获得奖金").append(this.bQ).toString(), i / 2, 61, 17);
                }
                repai_m();
            }
            if (this.ay == 35) {
                this.ay = 63;
                this.bC[this.f][this.ch] = true;
                if (x()) {
                    this.ax = true;
                }
            }
            this.ay++;
            this.ay &= 63;
            if (this.ay == 0) {
                this.bw = 1;
                this.bB = false;
                if (!this.ax) {
                    if (this.cl - 2 > this.bL.b) {
                        this.bL.b = this.cl - 2;
                    }
                    L();
                    this.bW = 3;
                    l();
                }
            }
        }
        this.bw = (this.bw + 1) & 1;
    }

    public final void A(int i2, int i3) {
        this.cs.drawImage(this.F, i2, i3, 20);
    }

    public final void aG() {
        for (int size = this.aY.size() - 1; size >= 0; size--) {
            a aVar = (a) this.aY.elementAt(size);
            aVar.a();
            if (aVar.b < 0 || aVar.b > i || aVar.a > G) {
                this.aY.removeElement(aVar);
            }
        }
    }

    public final void f(Graphics graphics) {
        d(graphics, this.aZ >> 1);
        if (this.bq == 7 && this.aZ > 11) {
            this.bL.b(1);
        }
        this.aZ = (this.aZ + 1) & 31;
        if (this.aZ == 0) {
            this.al = false;
            n(this.bq);
            this.bq = 0;
        }
    }

    public final void aA() throws IOException {
        this.ay++;
        repai_m();
        serviceRepaints();
        if (this.ay == 200) {
            this.ay = 0;
        }
        if (this.ay == 0) {
            this.ax = false;
            this.bW = 1;
            this.aT = true;
            ap();
        }
    }

    public final void aC() {
        this.bL.J = d.F[this.bL.n][0];
        this.bL.j = d.F[this.bL.n][1];
        this.bL.C -= d.F[this.bL.n][2];
        this.bL.n++;
    }

    public final void L() throws IOException {
        RecordStore recordStore;
        try {
            this.aN = RecordStore.openRecordStore(this.bD.b, true);
            if (this.aN == null) {
                return;
            }
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(byteArrayOutputStream);
            for (int i2 = 0; i2 < 8; i2++) {
                for (int i3 = 0; i3 < 16; i3++) {
                    dataOutputStream.writeBoolean(this.bC[i2][i3]);
                }
            }
            dataOutputStream.writeInt(this.bL.n);
            dataOutputStream.writeInt(this.bL.C);
            dataOutputStream.writeInt(this.bL.a);
            dataOutputStream.writeInt(this.bL.b);
            for (int i4 = 0; i4 < 8; i4++) {
                dataOutputStream.writeInt(this.bL.M[i4]);
            }
            dataOutputStream.flush();
            dataOutputStream.close();
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            this.aN.setRecord(1, byteArray, 0, byteArray.length);
            recordStore = this.aN;
            recordStore.closeRecordStore();
        } catch (Exception e) {
            recordStore.printStackTrace();
        }
    }

    public final boolean G() {
        return this.bL.C >= d.F[this.bL.n][2];
    }

    public final void i(int i2) {
        switch (i2) {
            case 9:
            case 10:
            case 11:
            case 12:
                s(i2 - 9);
                break;
            case 13:
                R();
                break;
            case 14:
                j();
                break;
            case 15:
                at();
                break;
            case 16:
                this.bL.b(20);
                break;
        }
    }
}
