package zdxz;

import java.io.IOException;
import java.util.TimerTask;

/* loaded from: 地心探险(地心游记).jar:zdxz/c.class */
public final class c extends TimerTask {
    b a;

    public c(b bVar) {
        this.a = bVar;
    }

    @Override // java.util.TimerTask, java.lang.Runnable
    public final void run() throws IOException {
        this.a.T();
    }
}
