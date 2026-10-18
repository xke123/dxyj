package zdxz;

import javax.microedition.lcdui.Display;
import javax.microedition.midlet.MIDlet;

/* loaded from: 地心探险(地心游记).jar:zdxz/zdxz.class */
public class zdxz extends MIDlet {
    final String b = "zdxz7";
    b a = new b(this);

    public final void destroyApp(boolean z) {
    }

    public final void pauseApp() {
    }

    public final void a() {
        notifyDestroyed();
    }

    public final void startApp() {
        Display.getDisplay(this).setCurrent(this.a);
    }
}
