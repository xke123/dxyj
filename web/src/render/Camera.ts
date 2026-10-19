export class Camera {
  public x: number = 0;
  public y: number = 0;
  public targetX: number = 0;
  public targetY: number = 0;
  public viewportWidth: number = 800;
  public viewportHeight: number = 600;

  // 屏幕震颤系统
  public shakeX: number = 0;
  public shakeY: number = 0;
  private shakeIntensity: number = 0;
  private shakeTimer: number = 0;

  private worldWidth: number;
  private worldHeight: number;
  private smoothSpeed: number = 0.14;

  constructor(worldWidth: number, worldHeight: number) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }

  public resize(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  public setWorldSize(worldWidth: number, worldHeight: number): void {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }

  // 触发屏幕震屏
  public triggerShake(intensity: number = 8, duration: number = 0.25): void {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeTimer = Math.max(this.shakeTimer, duration);
  }

  public follow(targetX: number, targetY: number): void {
    this.targetX = targetX - this.viewportWidth / 2;
    this.targetY = targetY - this.viewportHeight * 0.42;

    const maxX = Math.max(0, this.worldWidth - this.viewportWidth);
    const maxY = Math.max(0, this.worldHeight - this.viewportHeight);

    if (this.worldWidth <= this.viewportWidth) {
      this.targetX = (this.worldWidth - this.viewportWidth) / 2;
    } else {
      this.targetX = Math.max(0, Math.min(this.targetX, maxX));
    }
    this.targetY = Math.max(0, Math.min(this.targetY, maxY));
  }

  public update(dt: number = 0.016): void {
    // 平滑插值追踪
    this.x += (this.targetX - this.x) * this.smoothSpeed;
    this.y += (this.targetY - this.y) * this.smoothSpeed;

    // 震屏衰减计算
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      this.shakeX = (Math.random() - 0.5) * 2 * this.shakeIntensity;
      this.shakeY = (Math.random() - 0.5) * 2 * this.shakeIntensity;
      this.shakeIntensity *= 0.92;
      if (this.shakeTimer <= 0) {
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeIntensity = 0;
      }
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }
  }

  // 获取带震屏偏移的最终摄像机坐标
  public getRenderX(): number {
    return this.x + this.shakeX;
  }

  public getRenderY(): number {
    return this.y + this.shakeY;
  }
}
