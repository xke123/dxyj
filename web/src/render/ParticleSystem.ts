export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  shape: 'rect' | 'circle' | 'spark';
}

export class ParticleSystem {
  private particles: Particle[] = [];

  // 生成方块碎裂粒子群
  public emitBlockShatter(x: number, y: number, color: string, count: number = 14): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // 向上轻微爆裂
        size: 3 + Math.random() * 5,
        color: color,
        alpha: 1.0,
        decay: 0.015 + Math.random() * 0.025,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      });
    }
  }

  // 生成宝藏/钥匙发光光晕粒子
  public emitSparkle(x: number, y: number, color: string = '#ffd700', count: number = 20): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 3.0;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        size: 2 + Math.random() * 4,
        color: color,
        alpha: 1.0,
        decay: 0.012 + Math.random() * 0.02,
        rotation: 0,
        vRot: 0,
        shape: 'spark',
      });
    }
  }

  // 预警颤抖时的落石碎屑/粉尘预警粒子
  public emitDust(x: number, y: number, color: string = '#ffd54f'): void {
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 32,
        y: y + Math.random() * 6,
        vx: (Math.random() - 0.5) * 1.2,
        vy: 1.5 + Math.random() * 2.5,
        size: 1.5 + Math.random() * 2.5,
        color: color,
        alpha: 0.85,
        decay: 0.038,
        rotation: 0,
        vRot: 0,
        shape: 'circle',
      });
    }
  }

  public update(dt: number): void {
    const gravity = 4.0;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * 60 * dt;
      p.y += p.vy * 60 * dt;
      p.vy += gravity * dt;
      p.rotation += p.vRot;
      p.alpha -= p.decay * 60 * dt;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'spark') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }
}
