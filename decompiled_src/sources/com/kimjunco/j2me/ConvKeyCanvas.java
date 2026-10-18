package com.kimjunco.j2me;

import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.GameCanvas;

/* loaded from: 地心探险(地心游记).jar:com/kimjunco/j2me/ConvKeyCanvas.class */
public class ConvKeyCanvas extends GameCanvas {
    boolean Key_Convert_Switch;
    boolean Use_Touch_Key;
    int vertical_line_1;
    int vertical_line_2;
    int horizontal_line_1;
    int horizontal_line_2;
    int key01_org;
    int key01_mod;
    int key02_org;
    int key02_mod;
    int key03_org;
    int key03_mod;
    int key04_org;
    int key04_mod;
    int key05_org;
    int key05_mod;
    int key06_org;
    int key06_mod;
    int key07_org;
    int key07_mod;
    int key08_org;
    int key08_mod;
    int key09_org;
    int key09_mod;
    int key10_org;
    int key10_mod;
    int key11_org;
    int key11_mod;
    int key12_org;
    int key12_mod;
    int key13_org;
    int key13_mod;
    int key14_org;
    int key14_mod;
    int key15_org;
    int key15_mod;
    int key16_org;
    int key16_mod;
    int TouchKey1;
    int TouchKey2;
    int TouchKey3;
    int TouchKey4;
    int TouchKey5;
    int TouchKey6;
    int TouchKey7;
    int TouchKey8;
    int TouchKey9;
    boolean Conv_getGameAction;
    int gGA_confirm;
    int gGA_up;
    int gGA_down;
    int gGA_left;
    int gGA_right;
    int gGA_1;
    int gGA_2;
    int gGA_3;
    int gGA_4;
    int gGA_5;
    int gGA_6;
    int gGA_7;
    int gGA_8;
    int gGA_9;
    int gGA_mod_01;
    int gGA_mod_02;
    int gGA_mod_03;
    int gGA_mod_04;
    int gGA_mod_05;
    int gGA_mod_06;
    int gGA_mod_07;
    int gGA_mod_08;
    int gGA_mod_09;
    int gGA_mod_10;
    int gGA_mod_11;
    int gGA_mod_12;
    int gGA_mod_13;
    int gGA_mod_14;
    Image img;
    boolean ScrRes;
    int RotateAngle;
    int ScreenTransMode;
    int ScrW;
    int ScrH;
    int OrgW;
    int OrgH;
    boolean ForceToFullScreen;

    protected ConvKeyCanvas() {
        super(false);
        ConvKeyCanvasInit();
    }

    protected ConvKeyCanvas(boolean flag) {
        super(flag);
        ConvKeyCanvasInit();
    }

    private void ConvKeyCanvasInit() {
        this.Key_Convert_Switch = false;
        this.Use_Touch_Key = false;
        this.vertical_line_1 = 80;
        this.vertical_line_2 = 160;
        this.horizontal_line_1 = 110;
        this.horizontal_line_2 = 220;
        this.key01_org = 35;
        this.key01_mod = 35;
        this.key02_org = 42;
        this.key02_mod = 42;
        this.key03_org = 48;
        this.key03_mod = 48;
        this.key04_org = 49;
        this.key04_mod = 49;
        this.key05_org = 50;
        this.key05_mod = 50;
        this.key06_org = 51;
        this.key06_mod = 51;
        this.key07_org = 52;
        this.key07_mod = 52;
        this.key08_org = 53;
        this.key08_mod = 53;
        this.key09_org = 54;
        this.key09_mod = 54;
        this.key10_org = 55;
        this.key10_mod = 55;
        this.key11_org = 56;
        this.key11_mod = 56;
        this.key12_org = 57;
        this.key12_mod = 57;
        this.key13_org = -6;
        this.key13_mod = -6;
        this.key14_org = -7;
        this.key14_mod = -7;
        this.key15_org = -8;
        this.key15_mod = -8;
        this.key16_org = -9;
        this.key16_mod = -9;
        this.TouchKey1 = 49;
        this.TouchKey2 = 50;
        this.TouchKey3 = 51;
        this.TouchKey4 = 52;
        this.TouchKey5 = 53;
        this.TouchKey6 = 54;
        this.TouchKey7 = 55;
        this.TouchKey8 = 56;
        this.TouchKey9 = 57;
        this.Conv_getGameAction = false;
        this.gGA_confirm = 8;
        this.gGA_up = 1;
        this.gGA_down = 6;
        this.gGA_left = 2;
        this.gGA_right = 5;
        this.gGA_1 = 9;
        this.gGA_2 = 1;
        this.gGA_3 = 10;
        this.gGA_4 = 2;
        this.gGA_5 = 8;
        this.gGA_6 = 5;
        this.gGA_7 = 11;
        this.gGA_8 = 6;
        this.gGA_9 = 12;
        this.gGA_mod_01 = -5;
        this.gGA_mod_02 = -1;
        this.gGA_mod_03 = -2;
        this.gGA_mod_04 = -3;
        this.gGA_mod_05 = -4;
        this.gGA_mod_06 = 49;
        this.gGA_mod_07 = 50;
        this.gGA_mod_08 = 51;
        this.gGA_mod_09 = 52;
        this.gGA_mod_10 = 53;
        this.gGA_mod_11 = 54;
        this.gGA_mod_12 = 55;
        this.gGA_mod_13 = 56;
        this.gGA_mod_14 = 57;
        this.img = null;
        this.ForceToFullScreen = true;
        this.ScrRes = true;
        this.RotateAngle = 6;
        this.ScreenTransMode = 3;
        this.OrgW = 176;
        this.OrgH = 208;
        if (this.ForceToFullScreen) {
            setFullScreenMode(true);
        }
        if (this.ScrRes) {
            this.ScrW = super.getWidth();
            this.ScrH = super.getHeight();
        } else {
            this.ScrW = 240;
            this.ScrH = 320;
        }
    }

    private int keyCodeTrnsfrm(int i) {
        if (this.Key_Convert_Switch) {
            if (i == this.key01_org) {
                return this.key01_mod;
            }
            if (i == this.key02_org) {
                return this.key02_mod;
            }
            if (i == this.key03_org) {
                return this.key03_mod;
            }
            if (i == this.key04_org) {
                return this.key04_mod;
            }
            if (i == this.key05_org) {
                return this.key05_mod;
            }
            if (i == this.key06_org) {
                return this.key06_mod;
            }
            if (i == this.key07_org) {
                return this.key07_mod;
            }
            if (i == this.key08_org) {
                return this.key08_mod;
            }
            if (i == this.key09_org) {
                return this.key09_mod;
            }
            if (i == this.key10_org) {
                return this.key10_mod;
            }
            if (i == this.key11_org) {
                return this.key11_mod;
            }
            if (i == this.key12_org) {
                return this.key12_mod;
            }
            if (i == this.key13_org) {
                return this.key13_mod;
            }
            if (i == this.key14_org) {
                return this.key14_mod;
            }
            if (i == this.key15_org) {
                return this.key15_mod;
            }
            if (i == this.key16_org) {
                return this.key16_mod;
            }
            return i;
        }
        return i;
    }

    protected void keyPressed(int i) {
        keyPress_m(keyCodeTrnsfrm(i));
    }

    protected void keyReleased(int i) {
        keyReleas_m(keyCodeTrnsfrm(i));
    }

    protected void keyRepeated(int i) {
        keyRepeat_m(keyCodeTrnsfrm(i));
    }

    public void keyPress_m(int i) {
    }

    public void keyReleas_m(int i) {
    }

    public void keyRepeat_m(int i) {
    }

    public int getGameAction(int i) {
        if (this.Conv_getGameAction) {
            if (i == this.gGA_mod_01) {
                return this.gGA_confirm;
            }
            if (i == this.gGA_mod_02) {
                return this.gGA_up;
            }
            if (i == this.gGA_mod_03) {
                return this.gGA_down;
            }
            if (i == this.gGA_mod_04) {
                return this.gGA_left;
            }
            if (i == this.gGA_mod_05) {
                return this.gGA_right;
            }
            if (i == this.gGA_mod_06) {
                return this.gGA_1;
            }
            if (i == this.gGA_mod_07) {
                return this.gGA_2;
            }
            if (i == this.gGA_mod_08) {
                return this.gGA_3;
            }
            if (i == this.gGA_mod_09) {
                return this.gGA_4;
            }
            if (i == this.gGA_mod_10) {
                return this.gGA_5;
            }
            if (i == this.gGA_mod_11) {
                return this.gGA_6;
            }
            if (i == this.gGA_mod_12) {
                return this.gGA_7;
            }
            if (i == this.gGA_mod_13) {
                return this.gGA_8;
            }
            if (i == this.gGA_mod_14) {
                return this.gGA_9;
            }
            return super.getGameAction(i);
        }
        return super.getGameAction(i);
    }

    public void pointerPressed(int x, int y) {
        if (this.Use_Touch_Key) {
            if (x < this.vertical_line_1) {
                if (y < this.horizontal_line_1) {
                    keyPress_m(this.TouchKey1);
                    return;
                } else if (y > this.horizontal_line_1 && y < this.horizontal_line_2) {
                    keyPress_m(this.TouchKey4);
                    return;
                } else if (y > this.horizontal_line_2) {
                    keyPress_m(this.TouchKey7);
                    return;
                }
            }
            if (x > this.vertical_line_1 && x < this.vertical_line_2) {
                if (y < this.horizontal_line_1) {
                    keyPress_m(this.TouchKey2);
                    return;
                } else if (y > this.horizontal_line_1 && y < this.horizontal_line_2) {
                    keyPress_m(this.TouchKey5);
                    return;
                } else if (y > this.horizontal_line_2) {
                    keyPress_m(this.TouchKey8);
                    return;
                }
            }
            if (x > this.vertical_line_2) {
                if (y < this.horizontal_line_1) {
                    keyPress_m(this.TouchKey3);
                    return;
                }
                if (y > this.horizontal_line_1 && y < this.horizontal_line_2) {
                    keyPress_m(this.TouchKey6);
                } else if (y > this.horizontal_line_2) {
                    keyPress_m(this.TouchKey9);
                }
            }
        }
    }

    public void pointerReleased(int x, int y) {
        if (this.Use_Touch_Key) {
            if (x < this.vertical_line_1) {
                if (y < this.horizontal_line_1) {
                    keyReleas_m(this.TouchKey1);
                    return;
                } else if (y > this.horizontal_line_1 && y < this.horizontal_line_2) {
                    keyReleas_m(this.TouchKey4);
                    return;
                } else if (y > this.horizontal_line_2) {
                    keyReleas_m(this.TouchKey7);
                    return;
                }
            }
            if (x > this.vertical_line_1 && x < this.vertical_line_2) {
                if (y < this.horizontal_line_1) {
                    keyReleas_m(this.TouchKey2);
                    return;
                } else if (y > this.horizontal_line_1 && y < this.horizontal_line_2) {
                    keyReleas_m(this.TouchKey5);
                    return;
                } else if (y > this.horizontal_line_2) {
                    keyReleas_m(this.TouchKey8);
                    return;
                }
            }
            if (x > this.vertical_line_2) {
                if (y < this.horizontal_line_1) {
                    keyReleas_m(this.TouchKey3);
                    return;
                }
                if (y > this.horizontal_line_1 && y < this.horizontal_line_2) {
                    keyReleas_m(this.TouchKey6);
                } else if (y > this.horizontal_line_2) {
                    keyReleas_m(this.TouchKey9);
                }
            }
        }
    }

    public int getWidth() {
        if (this.ScreenTransMode == 1) {
            return this.ScrH;
        }
        return this.ScrW;
    }

    public int getHeight() {
        if (this.ScreenTransMode == 1) {
            return this.ScrW;
        }
        return this.ScrH;
    }

    public void paint(Graphics arg0) {
        switch (this.ScreenTransMode) {
            case 0:
                pai_m(arg0);
                break;
            case 1:
                if (this.img == null) {
                    try {
                        this.img = Image.createImage(arg0.getClipHeight(), arg0.getClipWidth());
                        Graphics g = this.img.getGraphics();
                        g.setColor(0);
                        g.fillRect(0, 0, this.img.getWidth(), this.img.getHeight());
                    } catch (Exception e) {
                    }
                }
                Graphics g2 = this.img.getGraphics();
                g2.translate(arg0.getTranslateX(), arg0.getTranslateY());
                g2.setClip(0, 0, this.img.getWidth(), this.img.getHeight());
                pai_m(g2);
                arg0.drawRegion(this.img, 0, 0, this.img.getWidth(), this.img.getHeight(), this.RotateAngle, 0, 0, 20);
                break;
            case 2:
                if (this.img == null) {
                    try {
                        this.img = Image.createImage(this.OrgW, this.OrgH);
                        Graphics g3 = this.img.getGraphics();
                        g3.setColor(0);
                        g3.fillRect(0, 0, this.img.getWidth(), this.img.getHeight());
                    } catch (Exception e2) {
                    }
                }
                Graphics g4 = this.img.getGraphics();
                g4.translate(arg0.getTranslateX(), arg0.getTranslateY());
                g4.setClip(0, 0, this.img.getWidth(), this.img.getHeight());
                pai_m(g4);
                arg0.drawRegion(ZoomImage(this.img, this.ScrW, this.ScrH), 0, 0, this.ScrW, this.ScrH, 0, 0, 0, 20);
                break;
            case 3:
                if (this.img == null) {
                    try {
                        this.img = Image.createImage(this.OrgW, this.OrgH);
                        Graphics g5 = this.img.getGraphics();
                        g5.setColor(0);
                        g5.fillRect(0, 0, this.img.getWidth(), this.img.getHeight());
                    } catch (Exception e3) {
                    }
                }
                Graphics g6 = this.img.getGraphics();
                g6.translate(arg0.getTranslateX(), arg0.getTranslateY());
                g6.setClip(0, 0, this.img.getWidth(), this.img.getHeight());
                pai_m(g6);
                arg0.drawRegion(a(this.img, this.ScrW, this.ScrH), 0, 0, this.ScrW, this.ScrH, 0, 0, 0, 20);
                break;
            case 4:
                if (this.img == null) {
                    try {
                        this.img = Image.createImage(this.OrgW, this.OrgH);
                        Graphics g7 = this.img.getGraphics();
                        g7.setColor(0);
                        g7.fillRect(0, 0, this.img.getWidth(), this.img.getHeight());
                    } catch (Exception e4) {
                    }
                }
                Graphics g8 = this.img.getGraphics();
                g8.translate(arg0.getTranslateX(), arg0.getTranslateY());
                g8.setClip(0, 0, this.img.getWidth(), this.img.getHeight());
                pai_m(g8);
                arg0.drawRegion(this.img, 0, 0, this.OrgW, this.OrgH, 0, (this.ScrW - this.OrgW) / 2, (this.ScrH - this.OrgH) / 2, 20);
                break;
        }
    }

    public void pai_m(Graphics arg0) {
    }

    public void repai_m(int x, int y, int w, int h) {
        int x1 = 0;
        int y1 = 0;
        int w1 = 0;
        int h1 = 0;
        if (this.img != null) {
            switch (this.ScreenTransMode) {
                case 0:
                    x1 = x;
                    y1 = y;
                    w1 = w;
                    h1 = h;
                    break;
                case 1:
                    if (this.RotateAngle == 6) {
                        x1 = y;
                        y1 = (this.img.getWidth() - x) - w;
                        w1 = h;
                        h1 = w;
                    }
                    if (this.RotateAngle == 5) {
                        x1 = (this.img.getHeight() - y) - h;
                        y1 = x;
                        w1 = h;
                        h1 = w;
                        break;
                    }
                    break;
                case 2:
                case 3:
                    x1 = x * (this.ScrW / this.OrgW);
                    y1 = y * (this.ScrH / this.OrgH);
                    w1 = w * (this.ScrW / this.OrgW);
                    h1 = h * (this.ScrH / this.OrgH);
                    break;
                case 4:
                    x1 = x + ((this.ScrW - this.OrgW) / 2);
                    y1 = y + ((this.ScrH - this.OrgH) / 2);
                    w1 = w;
                    h1 = h;
                    break;
                default:
                    x1 = x;
                    y1 = y;
                    w1 = w;
                    h1 = h;
                    break;
            }
        } else {
            x1 = x;
            y1 = y;
            w1 = w;
            h1 = h;
        }
        repaint(x1, y1, w1, h1);
    }

    public void repai_m() {
        repaint();
    }

    public void flushGraphics() {
        super.flushGraphics();
    }

    public void flushGraphics(int x, int y, int w, int h) {
        int x1 = 0;
        int y1 = 0;
        int w1 = 0;
        int h1 = 0;
        if (this.img != null) {
            switch (this.ScreenTransMode) {
                case 0:
                    x1 = x;
                    y1 = y;
                    w1 = w;
                    h1 = h;
                    break;
                case 1:
                    if (this.RotateAngle == 6) {
                        x1 = y;
                        y1 = (this.img.getWidth() - x) - w;
                        w1 = h;
                        h1 = w;
                    }
                    if (this.RotateAngle == 5) {
                        x1 = (this.img.getHeight() - y) - h;
                        y1 = x;
                        w1 = h;
                        h1 = w;
                        break;
                    }
                    break;
                case 2:
                case 3:
                    x1 = x * (this.ScrW / this.OrgW);
                    y1 = y * (this.ScrH / this.OrgH);
                    w1 = w * (this.ScrW / this.OrgW);
                    h1 = h * (this.ScrH / this.OrgH);
                    break;
                case 4:
                    x1 = x + ((this.ScrW - this.OrgW) / 2);
                    y1 = y + ((this.ScrH - this.OrgH) / 2);
                    w1 = w;
                    h1 = h;
                    break;
                default:
                    x1 = x;
                    y1 = y;
                    w1 = w;
                    h1 = h;
                    break;
            }
        } else {
            x1 = x;
            y1 = y;
            w1 = w;
            h1 = h;
        }
        super.flushGraphics(x1, y1, w1, h1);
    }

    private static Image ZoomImage(Image src, int desW, int desH) {
        int srcW = src.getWidth();
        int srcH = src.getHeight();
        int[] srcBuf = new int[srcW * srcH];
        src.getRGB(srcBuf, 0, srcW, 0, 0, srcW, srcH);
        int[] tabY = new int[desH];
        int[] tabX = new int[desW];
        int sb = 0;
        int db = 0;
        int tems = 0;
        int temd = 0;
        int distance = srcH > desH ? srcH : desH;
        for (int i = 0; i <= distance; i++) {
            tabY[db] = sb;
            tems += srcH;
            temd += desH;
            if (tems > distance) {
                tems -= distance;
                sb++;
            }
            if (temd > distance) {
                temd -= distance;
                db++;
            }
        }
        int sb2 = 0;
        int db2 = 0;
        int tems2 = 0;
        int temd2 = 0;
        int distance2 = srcW > desW ? srcW : desW;
        for (int i2 = 0; i2 <= distance2; i2++) {
            tabX[db2] = (short) sb2;
            tems2 += srcW;
            temd2 += desW;
            if (tems2 > distance2) {
                tems2 -= distance2;
                sb2++;
            }
            if (temd2 > distance2) {
                temd2 -= distance2;
                db2++;
            }
        }
        int[] desBuf = new int[desW * desH];
        int dy = 0;
        int sy = 0;
        int oldy = -1;
        for (int i3 = 0; i3 < desH; i3++) {
            if (oldy == tabY[i3]) {
                System.arraycopy(desBuf, dy - desW, desBuf, dy, desW);
            } else {
                int dx = 0;
                for (int j = 0; j < desW; j++) {
                    desBuf[dy + dx] = srcBuf[sy + tabX[j]];
                    dx++;
                }
                sy += (tabY[i3] - oldy) * srcW;
            }
            oldy = tabY[i3];
            dy += desW;
        }
        Image desImg = Image.createRGBImage(desBuf, desW, desH, false);
        return desImg;
    }

    private Image a(int[] ai, int i1, int j1) {
        return Image.createRGBImage(ai, i1, j1, true);
    }

    private int[] a(Image image) {
        int i1 = image.getWidth();
        int j1 = image.getHeight();
        int[] ai = new int[i1 * j1];
        image.getRGB(ai, 0, i1, 0, 0, i1, j1);
        return ai;
    }

    private Image a(Image image, int i1, int j1) {
        int k1 = (image.getWidth() << 8) / i1;
        int l1 = (image.getHeight() << 8) / j1;
        int i2 = image.getWidth();
        int j2 = image.getHeight();
        int[] ai = new int[i1 * j1];
        int[] ai1 = a(image);
        int k2 = 0;
        int j5 = 0;
        for (int k5 = 0; k5 < j1; k5++) {
            int l5 = 0;
            int i6 = k2 >> 8;
            if (i6 >= j2 - 1) {
                i6 = j2 - 2;
            }
            int j6 = i2 * i6;
            for (int k6 = 0; k6 < i1; k6++) {
                int l6 = l5 >> 8;
                if (l6 >= i2 - 1) {
                    l6 = i2 - 2;
                }
                int l2 = ai1[j6 + l6];
                int i3 = ai1[j6 + l6 + 1];
                int j3 = ai1[j6 + i2 + l6];
                int k3 = ai1[j6 + i2 + l6 + 1];
                int l4 = l5 & 255;
                int i5 = k2 & 255;
                int l3 = (((l2 & (-16711936)) >> 8) * (256 - l4)) + (((i3 & (-16711936)) >> 8) * l4);
                int i4 = ((l2 & 16711935) * (256 - l4)) + ((i3 & 16711935) * l4);
                int j4 = (((j3 & (-16711936)) >> 8) * (256 - l4)) + (((k3 & (-16711936)) >> 8) * l4);
                int k4 = ((j3 & 16711935) * (256 - l4)) + ((k3 & 16711935) * l4);
                int j42 = ((((((((l3 & (-16711936)) >> 8) * (256 - i5)) + (((j4 & (-16711936)) >> 8) * i5)) >> 8) & 16711935) * 5) >> 2) | 16711680;
                int k42 = (((((((i4 >> 8) & 16711935) * (256 - i5)) + (((k4 >> 8) & 16711935) * i5)) >> 8) & 16711935) * 5) >> 2;
                if ((j42 & 256) == 256) {
                    j42 |= 255;
                }
                if ((k42 & 256) == 256) {
                    k42 |= 255;
                }
                if ((k42 & 16777216) == 16777216) {
                    k42 |= 16711680;
                }
                int i = j5;
                j5++;
                ai[i] = ((j42 << 8) & (-16711936)) + (k42 & 16711935);
                l5 += k1;
            }
            k2 += l1;
        }
        return a(ai, i1, j1);
    }

    private static final Image a(Image image, int i1, int j1, int k1, int l1) {
        Image image1 = Image.createImage(k1, l1);
        if (i1 + k1 > image.getWidth() || j1 + l1 > image.getHeight()) {
            System.out.println(new StringBuffer().append("Warning: attempting extract using (").append(i1).append(",").append(j1).append(",").append(k1).append(",").append(l1).append(") when image  is ").append("(").append(image.getWidth()).append(",").append(image.getHeight()).append(")").toString());
        }
        image1.getGraphics().drawImage(image, -i1, -j1, 0);
        return image1;
    }
}
