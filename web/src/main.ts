/**
 * main.ts — 原版《地心游记》完整游戏链路（主界面 + 全球大地图 + 基地研发/商店 + 挖掘实战）
 *
 * 完整链路：
 *  1. Title Screen (主界面/存档管理/探险手册)
 *  2. World Map (全球 24 大探索点 / 锦标挑战杯 / 古代遗迹发掘)
 *  3. Robot R&D Base (20 阶机体强化工作台 / 8 大功能水晶法术交易所)
 *  4. Excavation Stage (实战下潜 / 能量与破坚石 / 宝藏收集 / 8大水晶法术 / 安全撤离与结算)
 *  5. Data Persistence (基于 LocalStorage 的完整自动存档体系)
 */

import './style.css';
import {
  COLS, ROWS, TILE_SIZE,
  CrystalType, CRYSTAL_METAS,
  STAGE_LIST, UPGRADE_MATRIX,
  type StageInfo, type SaveData,
} from './core/Types';
import { GridEngine } from './core/GridEngine';
import { PlayerController } from './core/Player';
import { Camera } from './render/Camera';
import { CanvasRenderer } from './render/CanvasRenderer';
import { ParticleSystem } from './render/ParticleSystem';
import { SoundEffects } from './audio/SoundEffects';
import { SaveSystem } from './core/SaveSystem';

type AppScreen = 'title' | 'map' | 'base' | 'game';
type GamePhase = 'playing' | 'dead' | 'win' | 'evacuated';

class GameManager {
  private currentScreen: AppScreen = 'title';
  private saveData: SaveData;
  private currentStage: StageInfo = STAGE_LIST[3]; // 默认新手杯挑战赛

  // 挖掘引擎与核心实例
  private canvas!: HTMLCanvasElement;
  private particles!: ParticleSystem;
  private audio!: SoundEffects;
  private engine!: GridEngine;
  private player!: PlayerController;
  private camera!: Camera;
  private renderer!: CanvasRenderer;

  private phase: GamePhase = 'playing';
  private keysDown: Set<string> = new Set();
  private moveCooldown: number = 0;
  private lastTime: number = 0;

  // 商店模式 (buy 或 sell)
  private shopMode: 'buy' | 'sell' = 'buy';
  private mapFilterCat: string = 'all';

  // 快捷槽位引用
  private slotElements: Map<CrystalType, { root: HTMLElement; count: HTMLElement }> = new Map();

  constructor() {
    this.saveData = SaveSystem.load();
    this.initCanvasAndEngine();
    this.bindDOM();
    this.setupInput();
    this.switchScreen('title');
    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();

    requestAnimationFrame((t) => this.loop(t));
  }

  // ── 引擎与画布初始化 ──
  private initCanvasAndEngine(): void {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const worldW = COLS * TILE_SIZE;
    const worldH = ROWS * TILE_SIZE;

    this.particles = new ParticleSystem();
    this.audio = new SoundEffects();
    this.engine = new GridEngine(this.particles, this.audio);
    this.camera = new Camera(worldW, worldH);
    this.engine.setCamera(this.camera);

    this.player = new PlayerController(this.engine, this.currentStage, this.saveData);
    this.renderer = new CanvasRenderer(
      this.canvas, this.engine, this.player, this.camera, this.particles
    );

    this.player.setCallbacks(
      () => {
        this.updateInGameHUD();
      },
      () => this.onStageDead(),
      () => this.onStageWin(),
      () => {
        this.saveData.crystals = [...this.player.state.crystals];
        SaveSystem.save(this.saveData);
        this.updateInGameHUD();
      }
    );
  }

  // ── DOM 事件绑定与屏幕路由 ──
  private bindDOM(): void {
    // 1. 主界面按钮
    document.getElementById('btn-start-expedition')?.addEventListener('click', () => {
      this.switchScreen('map');
    });
    document.getElementById('btn-open-base')?.addEventListener('click', () => {
      this.switchScreen('base');
    });
    document.getElementById('btn-open-guide')?.addEventListener('click', () => {
      document.getElementById('modal-guide')?.classList.remove('modal-hidden');
    });
    document.getElementById('btn-close-guide')?.addEventListener('click', () => {
      document.getElementById('modal-guide')?.classList.add('modal-hidden');
    });
    document.getElementById('btn-reset-save')?.addEventListener('click', () => {
      if (confirm('确定要清除所有探险记录并重置初始档案吗？')) {
        this.saveData = SaveSystem.reset();
        this.renderTitleStats();
        alert('游戏档案已重置！');
      }
    });

    // 2. 大地图按钮与分类切换
    document.getElementById('btn-map-back-title')?.addEventListener('click', () => {
      this.switchScreen('title');
    });
    document.getElementById('btn-map-to-base')?.addEventListener('click', () => {
      this.switchScreen('base');
    });

    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        catBtns.forEach((b) => b.classList.remove('active'));
        const target = e.currentTarget as HTMLElement;
        target.classList.add('active');
        this.mapFilterCat = target.getAttribute('data-cat') || 'all';
        this.renderStageGrid();
      });
    });

    // 3. 基地按钮与商店标签
    document.getElementById('btn-base-back-map')?.addEventListener('click', () => {
      this.switchScreen('map');
    });
    document.getElementById('btn-upgrade-robot')?.addEventListener('click', () => {
      this.upgradeRobot();
    });
    document.getElementById('tab-buy')?.addEventListener('click', () => {
      this.shopMode = 'buy';
      document.getElementById('tab-buy')?.classList.add('active');
      document.getElementById('tab-sell')?.classList.remove('active');
      this.renderCrystalShop();
    });
    document.getElementById('tab-sell')?.addEventListener('click', () => {
      this.shopMode = 'sell';
      document.getElementById('tab-sell')?.classList.add('active');
      document.getElementById('tab-buy')?.classList.remove('active');
      this.renderCrystalShop();
    });

    // 4. 挖掘实战界面的安全撤离与结算按钮
    document.getElementById('btn-evacuate')?.addEventListener('click', () => {
      this.evacuateCurrentStage();
    });
    document.getElementById('btn-overlay-map')?.addEventListener('click', () => {
      this.switchScreen('map');
    });
    document.getElementById('btn-overlay-base')?.addEventListener('click', () => {
      this.switchScreen('base');
    });
    document.getElementById('btn-overlay-retry')?.addEventListener('click', () => {
      this.startStage(this.currentStage);
    });

    this.createItemBar();
  }

  // ── 屏幕切换控制器 ──
  public switchScreen(screen: AppScreen): void {
    this.currentScreen = screen;
    const screens = ['screen-title', 'screen-map', 'screen-base', 'screen-game'];
    screens.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        if (id === `screen-${screen}`) {
          el.classList.remove('screen-hidden');
        } else {
          el.classList.add('screen-hidden');
        }
      }
    });

    if (screen === 'title') {
      this.renderTitleStats();
    } else if (screen === 'map') {
      this.renderMapHeader();
      this.renderStageGrid();
    } else if (screen === 'base') {
      this.renderBaseWorkshop();
      this.renderCrystalShop();
    } else if (screen === 'game') {
      document.getElementById('overlay')?.classList.add('overlay-hidden');
    }
  }

  // ── 渲染主界面状态 ──
  private renderTitleStats(): void {
    const lvlEl = document.getElementById('title-robot-lvl');
    const coinsEl = document.getElementById('title-coins');
    const exploredEl = document.getElementById('title-explored');

    if (lvlEl) lvlEl.textContent = `Lv.${this.saveData.level}`;
    if (coinsEl) coinsEl.textContent = this.saveData.coins.toLocaleString();
    if (exploredEl) {
      exploredEl.textContent = `${this.saveData.completedStages.length} / ${STAGE_LIST.length}`;
    }
  }

  // ── 渲染大地图头部状态 ──
  private renderMapHeader(): void {
    const coinsEl = document.getElementById('map-coins');
    const lvlEl = document.getElementById('map-robot-lvl');
    if (coinsEl) coinsEl.textContent = this.saveData.coins.toLocaleString();
    if (lvlEl) lvlEl.textContent = `Lv.${this.saveData.level}`;
  }

  // ── 渲染全球大地图 24 个关卡卡片 ──
  private renderStageGrid(): void {
    const container = document.getElementById('stage-grid');
    if (!container) return;
    container.innerHTML = '';

    const filtered = STAGE_LIST.filter((s) => {
      if (this.mapFilterCat === 'all') return true;
      if (this.mapFilterCat === 'cup') return s.category === 'cup';
      if (this.mapFilterCat === 'ruin') return s.category === 'ruin';
      if (this.mapFilterCat === 'special') return s.category === 'special' || s.category === 'base';
      return true;
    });

    filtered.forEach((stage) => {
      const isCleared = this.saveData.completedStages.includes(stage.id);
      const isBase = stage.category === 'base';

      const card = document.createElement('div');
      card.className = `stage-card ${isCleared ? 'cleared' : ''} ${isBase ? 'base-entry' : ''}`;

      card.innerHTML = `
        ${isCleared ? '<span class="cleared-badge">已完成 🏆</span>' : ''}
        <div class="stage-top">
          <div class="stage-icon">${stage.icon}</div>
          <div class="stage-info">
            <h4 class="stage-name">${stage.name}</h4>
            <p class="stage-desc">${stage.desc}</p>
          </div>
        </div>
        <div class="stage-meta">
          <span class="depth-tag">${stage.depthM < 0 ? '无限深度' : stage.depthM === 0 ? '基地' : `${stage.depthM}M`}</span>
          <span class="prize-tag">${stage.prize > 0 ? `💰 +${stage.prize.toLocaleString()}` : '商业中心'}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (isBase) {
          this.switchScreen('base');
        } else {
          this.startStage(stage);
        }
      });

      container.appendChild(card);
    });
  }

  // ── 渲染基地机体强化工坊 ──
  private renderBaseWorkshop(): void {
    const coinsEl = document.getElementById('base-coins');
    const bagEl = document.getElementById('base-bag');
    const levelTag = document.getElementById('robot-level-tag');
    const upgradeCostEl = document.getElementById('upgrade-cost');
    const btnUpgrade = document.getElementById('btn-upgrade-robot') as HTMLButtonElement;

    if (coinsEl) coinsEl.textContent = this.saveData.coins.toLocaleString();

    const currLvl = this.saveData.level;
    const currSpec = UPGRADE_MATRIX[currLvl - 1];
    const nextSpec = currLvl < 20 ? UPGRADE_MATRIX[currLvl] : null;

    if (levelTag) levelTag.textContent = `Lv. ${currLvl} / 20`;

    // 属性差异对比
    const hpDiff = document.getElementById('stat-hp-diff');
    const bagDiff = document.getElementById('stat-bag-diff');
    const powerDiff = document.getElementById('stat-power-diff');

    if (hpDiff) {
      hpDiff.innerHTML = nextSpec
        ? `${currSpec.maxHp} HP <span class="arrow">➜</span> ${nextSpec.maxHp} HP`
        : `${currSpec.maxHp} HP (满级)`;
    }
    if (bagDiff) {
      bagDiff.innerHTML = nextSpec
        ? `${currSpec.backpack}格 <span class="arrow">➜</span> ${nextSpec.backpack}格`
        : `${currSpec.backpack}格 (满级)`;
    }
    if (powerDiff) {
      powerDiff.innerHTML = nextSpec
        ? `${currSpec.power} <span class="arrow">➜</span> ${nextSpec.power}`
        : `${currSpec.power} (满级)`;
    }

    const totalCrystals = this.saveData.crystals.reduce((a, b) => a + b, 0);
    if (bagEl) bagEl.textContent = `${totalCrystals} / ${currSpec.backpack}`;

    // 升级费用与按钮状态
    if (nextSpec) {
      if (upgradeCostEl) upgradeCostEl.textContent = `${nextSpec.cost.toLocaleString()} 金币`;
      if (btnUpgrade) {
        btnUpgrade.disabled = this.saveData.coins < nextSpec.cost;
        btnUpgrade.textContent = this.saveData.coins < nextSpec.cost ? '资金不足无法强化' : '⚡ 立即强化升级';
      }
    } else {
      if (upgradeCostEl) upgradeCostEl.textContent = '已达最高科技等级';
      if (btnUpgrade) {
        btnUpgrade.disabled = true;
        btnUpgrade.textContent = '⭐ 已达成终极机体';
      }
    }
  }

  // ── 研发机体升级逻辑 ──
  private upgradeRobot(): void {
    if (this.saveData.level >= 20) return;
    const nextSpec = UPGRADE_MATRIX[this.saveData.level];
    if (this.saveData.coins < nextSpec.cost) {
      alert('可用资金不足，请前往地下挖掘宝藏或通关挑战赛获取金币！');
      return;
    }

    this.saveData.coins -= nextSpec.cost;
    this.saveData.level++;
    SaveSystem.save(this.saveData);
    this.audio.playRelicFound();
    this.renderBaseWorkshop();
  }

  // ── 渲染基地水晶买卖交易所 ──
  private renderCrystalShop(): void {
    const container = document.getElementById('crystal-trade-list');
    if (!container) return;
    container.innerHTML = '';

    const currSpec = UPGRADE_MATRIX[this.saveData.level - 1];
    const totalCrystals = this.saveData.crystals.reduce((a, b) => a + b, 0);
    const isBagFull = totalCrystals >= currSpec.backpack;

    const metas = Object.values(CRYSTAL_METAS);
    metas.forEach((meta) => {
      const held = this.saveData.crystals[meta.id] ?? 0;
      const isBuy = this.shopMode === 'buy';
      const price = isBuy ? meta.buyPrice : meta.sellPrice;
      const canAct = isBuy ? (!isBagFull && this.saveData.coins >= price) : (held > 0);

      const row = document.createElement('div');
      row.className = 'trade-row';

      row.innerHTML = `
        <div class="trade-row-left">
          <span class="trade-icon">${meta.icon}</span>
          <div class="trade-info">
            <span class="trade-name">${meta.name}</span>
            <span class="trade-desc">${meta.desc}</span>
            <span class="trade-stock">当前持有: ${held} 枚</span>
          </div>
        </div>
        <div class="trade-row-right">
          <span class="trade-price gold">${price.toLocaleString()} 金币</span>
          <button class="trade-action-btn ${isBuy ? 'buy' : 'sell'}" ${!canAct ? 'disabled' : ''}>
            ${isBuy ? '+ 购买' : '- 出售'}
          </button>
        </div>
      `;

      row.querySelector('button')?.addEventListener('click', () => {
        if (isBuy) {
          if (this.saveData.coins >= price && !isBagFull) {
            this.saveData.coins -= price;
            this.saveData.crystals[meta.id]++;
            SaveSystem.save(this.saveData);
            this.audio.playRelicFound();
            this.renderBaseWorkshop();
            this.renderCrystalShop();
          }
        } else {
          if (held > 0) {
            this.saveData.coins += price;
            this.saveData.crystals[meta.id]--;
            SaveSystem.save(this.saveData);
            this.audio.playRelicFound();
            this.renderBaseWorkshop();
            this.renderCrystalShop();
          }
        }
      });

      container.appendChild(row);
    });
  }

  // ── 进入选定关卡开始挖掘 ──
  public startStage(stage: StageInfo): void {
    this.currentStage = stage;
    this.phase = 'playing';
    this.switchScreen('game');

    this.engine.buildInitialWorld();
    this.engine.scrolledRows = 0;
    this.engine.floatingTexts = [];

    // 以当前存档属性实例化机器人
    this.player = new PlayerController(this.engine, stage, this.saveData);
    this.player.setCallbacks(
      () => this.updateInGameHUD(),
      () => this.onStageDead(),
      () => this.onStageWin(),
      () => {
        this.saveData.crystals = [...this.player.state.crystals];
        SaveSystem.save(this.saveData);
        this.updateInGameHUD();
      }
    );

    this.renderer = new CanvasRenderer(
      this.canvas, this.engine, this.player, this.camera, this.particles
    );

    this.updateInGameHUD();
  }

  // ── 主动安全撤离地面 ──
  private evacuateCurrentStage(): void {
    if (this.phase !== 'playing') return;
    this.phase = 'evacuated';

    const sessionCoins = this.player.state.sessionCoins;
    this.saveData.coins += sessionCoins;
    this.saveData.crystals = [...this.player.state.crystals];
    SaveSystem.save(this.saveData);

    const titleEl = document.getElementById('overlay-title');
    const bodyEl = document.getElementById('overlay-body');
    const overlayEl = document.getElementById('overlay');

    if (titleEl) {
      titleEl.textContent = '🚁 安全撤离返回地面';
      titleEl.className = 'evac';
    }
    if (bodyEl) {
      bodyEl.innerHTML = `
        <p>机器人已安全返回地表基座</p>
        <p class="bonus">本次采集带回资金：<strong>+${sessionCoins.toLocaleString()}</strong> 金币</p>
        <p>当前总资金：<strong>${this.saveData.coins.toLocaleString()}</strong> 金币</p>
      `;
    }
    overlayEl?.classList.remove('overlay-hidden');
  }

  // ── 关卡通关胜利结算 ──
  private onStageWin(): void {
    this.phase = 'win';

    const sessionCoins = this.player.state.sessionCoins;
    const prize = this.currentStage.prize;
    const totalGained = sessionCoins + prize;

    this.saveData.coins += totalGained;
    this.saveData.crystals = [...this.player.state.crystals];

    if (!this.saveData.completedStages.includes(this.currentStage.id)) {
      this.saveData.completedStages.push(this.currentStage.id);
    }
    SaveSystem.save(this.saveData);

    const titleEl = document.getElementById('overlay-title');
    const bodyEl = document.getElementById('overlay-body');
    const overlayEl = document.getElementById('overlay');

    if (titleEl) {
      titleEl.textContent = '🏆 关卡发掘成功！';
      titleEl.className = 'win';
    }
    if (bodyEl) {
      bodyEl.innerHTML = `
        <p>抵达目标深度 <strong>${this.currentStage.depthM}M</strong>，获得荣誉标志！</p>
        <p class="bonus">关卡完成奖金：<strong>+${prize.toLocaleString()}</strong></p>
        <p>地底挖掘收集：<strong>+${sessionCoins.toLocaleString()}</strong></p>
        <p>累计总资产：<strong>${this.saveData.coins.toLocaleString()}</strong> 金币</p>
      `;
    }
    overlayEl?.classList.remove('overlay-hidden');
  }

  // ── 关卡力竭倒下失败结算 ──
  private onStageDead(): void {
    this.phase = 'dead';

    const lost = this.player.state.sessionCoins;
    this.saveData.crystals = [...this.player.state.crystals];
    SaveSystem.save(this.saveData);

    const titleEl = document.getElementById('overlay-title');
    const bodyEl = document.getElementById('overlay-body');
    const overlayEl = document.getElementById('overlay');

    if (titleEl) {
      titleEl.textContent = '⚠️ 能量耗尽！';
      titleEl.className = 'dead';
    }
    if (bodyEl) {
      bodyEl.innerHTML = `
        <p>机器人能量耗尽，被紧急防卫程序传送回地面！</p>
        <p class="penalty">本次挖掘收集的 <strong>${lost.toLocaleString()}</strong> 金币已丢失！</p>
        <p>总账户资产：<strong>${this.saveData.coins.toLocaleString()}</strong> 金币</p>
      `;
    }
    overlayEl?.classList.remove('overlay-hidden');
  }

  // ── 快捷槽位挂载 ──
  private createItemBar(): void {
    const itemBarEl = document.getElementById('item-bar');
    if (!itemBarEl) return;
    itemBarEl.innerHTML = '';
    this.slotElements.clear();

    const metas = Object.values(CRYSTAL_METAS);
    metas.forEach((meta) => {
      const slot = document.createElement('div');
      slot.className = 'item-slot';
      slot.style.setProperty('--slot-color', meta.color);
      slot.style.setProperty('--slot-glow', `${meta.color}66`);
      slot.setAttribute('title', `${meta.name} [按键 ${meta.key}]: ${meta.desc}`);

      slot.innerHTML = `
        <span class="item-key">${meta.key}</span>
        <span class="item-icon">${meta.icon}</span>
        <span class="item-name">${meta.shortName}</span>
        <span class="item-count" id="slot-count-${meta.id}">0</span>
      `;

      slot.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.phase === 'playing') {
          this.player.useCrystal(meta.id);
          this.updateInGameHUD();
        }
      });

      itemBarEl.appendChild(slot);
      this.slotElements.set(meta.id, {
        root: slot,
        count: slot.querySelector(`#slot-count-${meta.id}`) as HTMLElement,
      });
    });
  }

  // ── 局内 HUD 更新 ──
  private updateInGameHUD(): void {
    const p = this.player.state;
    const hpPct = Math.max(0, (p.hp / p.maxHp) * 100);

    const hpFillEl = document.getElementById('hp-fill');
    const hpTextEl = document.getElementById('hp-text');
    const coinsEl = document.getElementById('coins-val');
    const depthEl = document.getElementById('depth-val');
    const targetDepthEl = document.getElementById('target-depth-val');
    const bagValEl = document.getElementById('bag-val');

    if (hpFillEl) {
      hpFillEl.style.width = `${hpPct}%`;
      hpFillEl.style.backgroundColor =
        hpPct > 50 ? '#22c55e' : hpPct > 25 ? '#eab308' : '#ef4444';
    }
    if (hpTextEl) hpTextEl.textContent = `${p.hp}/${p.maxHp}`;
    if (coinsEl) {
      coinsEl.textContent = `+${p.sessionCoins.toLocaleString()} (${(this.saveData.coins + p.sessionCoins).toLocaleString()})`;
    }
    if (depthEl) depthEl.textContent = `${Math.floor(p.depth)}m`;
    if (targetDepthEl) {
      targetDepthEl.textContent = this.currentStage.depthM < 0 ? '无限' : `${this.currentStage.depthM}m`;
    }

    const totalCrystals = this.player.getTotalCrystals();
    if (bagValEl) bagValEl.textContent = `${totalCrystals}/${p.maxBackpack}`;

    this.slotElements.forEach((slot, type) => {
      const count = p.crystals[type] ?? 0;
      slot.count.textContent = `x${count}`;
      if (count > 0) {
        slot.root.classList.remove('disabled');
        slot.root.classList.add('active');
      } else {
        slot.root.classList.add('disabled');
        slot.root.classList.remove('active');
      }
    });
  }

  // ── 键盘与触控按键监听 ──
  private setupInput(): void {
    window.addEventListener('keydown', (e) => {
      this.keysDown.add(e.code);

      if (this.currentScreen === 'game' && this.phase === 'playing') {
        if (e.code === 'Space' || e.code === 'KeyJ' || e.code === 'KeyK') {
          e.preventDefault();
          this.player.digFacing();
          return;
        }

        if (e.code === 'Escape') {
          this.evacuateCurrentStage();
          return;
        }

        const keyMap: Record<string, CrystalType> = {
          'Digit1': CrystalType.RED,
          'Digit2': CrystalType.YELLOW,
          'Digit3': CrystalType.BLUE,
          'Digit4': CrystalType.GREEN,
          'Digit5': CrystalType.BLACK,
          'Digit6': CrystalType.FLASH,
          'Digit7': CrystalType.EARTHQUAKE,
          'Digit8': CrystalType.ENERGY_BLUE,
          'Numpad1': CrystalType.RED,
          'Numpad2': CrystalType.YELLOW,
          'Numpad3': CrystalType.BLUE,
          'Numpad4': CrystalType.GREEN,
          'Numpad5': CrystalType.BLACK,
          'Numpad6': CrystalType.FLASH,
          'Numpad7': CrystalType.EARTHQUAKE,
          'Numpad8': CrystalType.ENERGY_BLUE,
        };

        if (e.code in keyMap) {
          e.preventDefault();
          this.player.useCrystal(keyMap[e.code]);
          this.updateInGameHUD();
        }
      }
    });

    window.addEventListener('keyup', (e) => this.keysDown.delete(e.code));

    // 虚拟方向按键
    const btns: Array<[string, number, number]> = [
      ['btn-up',    0, -1], ['btn-down', 0,  1],
      ['btn-left', -1,  0], ['btn-right', 1,  0],
    ];
    for (const [id, dx, dy] of btns) {
      const el = document.getElementById(id);
      if (!el) continue;
      let interval: number;
      const start = (ev: Event) => {
        ev.preventDefault();
        if (this.phase === 'playing') {
          this.player.tryMove(dx, dy);
          interval = window.setInterval(() => this.player.tryMove(dx, dy), 140);
        }
      };
      const stop = () => clearInterval(interval);
      el.addEventListener('pointerdown', start);
      el.addEventListener('pointerup', stop);
      el.addEventListener('pointerleave', stop);
    }

    document.getElementById('btn-dig')?.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      if (this.phase === 'playing') this.player.digFacing();
    });
  }

  private handleResize(): void {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    this.canvas.width  = vw;
    this.canvas.height = vh;
    this.camera.viewportWidth  = vw;
    this.camera.viewportHeight = vh;
  }

  // ── 主循环 ──
  private loop(now: number): void {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    if (this.currentScreen === 'game') {
      if (this.phase === 'playing') {
        this.handlePlayerContinuousInput(dt);
        this.player.update(dt);
        this.engine.updatePhysics(dt,
          this.player.state.gridX,
          this.player.state.gridY,
          () => this.player.onCrush()
        );
        this.engine.updateFloatingTexts(dt);
        this.particles.update(dt);

        this.camera.follow(
          this.player.state.x + TILE_SIZE / 2,
          this.player.state.y + TILE_SIZE / 2
        );
        this.camera.update(dt);
        this.updateInGameHUD();
      } else {
        this.particles.update(dt);
        this.camera.update(dt);
      }

      this.renderer.render();
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  private handlePlayerContinuousInput(dt: number): void {
    this.moveCooldown -= dt;
    if (this.moveCooldown > 0) return;

    const moved =
      (this.keysDown.has('ArrowUp')    || this.keysDown.has('KeyW')) ? this.player.tryMove(0, -1) :
      (this.keysDown.has('ArrowDown')  || this.keysDown.has('KeyS')) ? this.player.tryMove(0,  1) :
      (this.keysDown.has('ArrowLeft')  || this.keysDown.has('KeyA')) ? this.player.tryMove(-1, 0) :
      (this.keysDown.has('ArrowRight') || this.keysDown.has('KeyD')) ? this.player.tryMove(1,  0) :
      false;

    if (moved) this.moveCooldown = 0.13;
  }
}

window.addEventListener('DOMContentLoaded', () => new GameManager());
