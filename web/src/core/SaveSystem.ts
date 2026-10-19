/**
 * SaveSystem.ts — 原版《地心游记》数据持久化系统（对标 J2ME RMS 存储）
 */

import { type SaveData } from './Types';

const STORAGE_KEY = 'dxyj_player_save_v1';

export const DEFAULT_SAVE: SaveData = {
  coins: 15000, // 初始备用金，方便新玩家测试基地与关卡
  level: 1,
  crystals: [2, 1, 1, 1, 1, 1, 1, 1], // 开局配备水晶
  completedStages: ['stage_02', 'stage_00', 'stage_01'], // 基地与新手训练关默认解锁
  endlessRecord: 0,
};

export class SaveSystem {
  public static load(): SaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          coins: typeof parsed.coins === 'number' ? parsed.coins : DEFAULT_SAVE.coins,
          level: typeof parsed.level === 'number' ? Math.max(1, Math.min(20, parsed.level)) : 1,
          crystals: Array.isArray(parsed.crystals) && parsed.crystals.length === 8
            ? parsed.crystals
            : [...DEFAULT_SAVE.crystals],
          completedStages: Array.isArray(parsed.completedStages)
            ? parsed.completedStages
            : [...DEFAULT_SAVE.completedStages],
          endlessRecord: typeof parsed.endlessRecord === 'number' ? parsed.endlessRecord : 0,
        };
      }
    } catch (e) {
      console.warn('Failed to load save from localStorage:', e);
    }
    return { ...DEFAULT_SAVE, crystals: [...DEFAULT_SAVE.crystals], completedStages: [...DEFAULT_SAVE.completedStages] };
  }

  public static save(data: SaveData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  public static reset(): SaveData {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear save:', e);
    }
    return { ...DEFAULT_SAVE, crystals: [...DEFAULT_SAVE.crystals], completedStages: [...DEFAULT_SAVE.completedStages] };
  }
}
