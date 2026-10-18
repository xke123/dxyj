# 地心游记 (Core Explorer)

经典功能机时代（Java ME / Pocket PC）经典单机小游戏 **《地心游记》**（又名《地心探险》，英文名 *Core Explorer*）的游戏资料整理、逆向分析与源码存档。

## 核心文档

1. 👉 **[《地心游记》资料全集 (地心游记_资料全集.md)](file:///Users/xiaoke/Documents/Codes/GitHub/dxyj/%E5%9C%B0%E5%BF%83%E6%B8%B8%E8%AE%B0_%E8%B5%84%E6%96%99%E5%85%A8%E9%9B%86.md)**
   * 包含游戏背景、制作团队、凡尔纳世界观、8大水晶物价、24大关卡与秘境、20级机器人升级全数值、J2ME技术架构与现代模拟器运行指南。
2. 👉 **[《地心游记》逆向工程深度分析报告 (地心游记_逆向工程分析报告.md)](file:///Users/xiaoke/Documents/Codes/GitHub/dxyj/%E5%9C%B0%E5%BF%83%E6%B8%B8%E8%AE%B0_%E9%80%86%E5%90%91%E5%B7%A5%E7%A8%8B%E5%88%86%E6%9E%90%E6%8A%A5%E5%91%8A.md)**
   * 采用 REA + JADX 对字节码进行逆向工程，详尽解密了四向递归连通块消除算法、岩石耐久步进、首创的无头 `.boq` PNG 动态拼装压缩技术以及 RMS 存档二进制结构。

---

## 项目结构与资产

* `地心探险(地心游记).jar`：原版 J2ME 游戏程序（MIDP-2.0 / CLDC-1.0，94.9 KB）
* [decompiled_src/](file:///Users/xiaoke/Documents/Codes/GitHub/dxyj/decompiled_src)
  * `sources/zdxz/`：100% 完整反编译的 Java 源代码（包含 `zdxz.java`, `b.java`, `e.java` 等核心类）
  * `resources/`：从 JAR 包中完整提取并校验的原始图片、图标、切片与 `.boq` 图集
* `地心游记_资料全集.md`：游戏全要素百科资料
* `地心游记_逆向工程分析报告.md`：底层算法与架构逆向工程分析报告
* [设定/](file:///Users/xiaoke/Documents/Codes/GitHub/dxyj/设定/README.md)：**【新游戏重构设定全集】** 包含白纸化地球、盗墓贼推理探索、七大秘宝与人类之光的完整叙事与机制文档。
