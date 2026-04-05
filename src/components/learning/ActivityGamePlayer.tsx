"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type PhaserType from "phaser";
import type { ChoiceRound, GameDefinition, MemoryRound, SortRound, TapRound } from "@/lib/gameCatalog";

type ActivityGamePlayerProps = {
  game: GameDefinition;
  onGameComplete?: (result: { score: number; xp: number }) => void;
};

type StatusState = {
  score: number;
  timeLeft: number;
  round: number;
  totalRounds: number;
  message: string;
  finished: boolean;
};

type MemoryCard = {
  pairId: string;
  label: string;
};

function hexToNumber(hex: string) {
  return parseInt(hex.replace("#", ""), 16);
}

function shuffleArray<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
}

function getRoundCount(game: GameDefinition) {
  return game.rounds.length;
}

function createLearningScene(
  Phaser: typeof PhaserType,
  game: GameDefinition,
  setStatus: Dispatch<SetStateAction<StatusState>>,
  onGameComplete?: (result: { score: number; xp: number }) => void,
) {
  type ButtonContainer = PhaserType.GameObjects.Container & {
    background?: PhaserType.GameObjects.Shape;
    label?: PhaserType.GameObjects.Text;
  };

  return class LearningScene extends Phaser.Scene {
    private score = 0;
    private timeLeft = game.timeLimit;
    private roundIndex = 0;
    private timerEvent?: PhaserType.Time.TimerEvent;
    private promptText?: PhaserType.GameObjects.Text;
    private hintText?: PhaserType.GameObjects.Text;
    private scoreText?: PhaserType.GameObjects.Text;
    private timerText?: PhaserType.GameObjects.Text;
    private progressText?: PhaserType.GameObjects.Text;
    private roundObjects: PhaserType.GameObjects.GameObject[] = [];
    private inputLocked = false;
    private completionReported = false;

    constructor() {
      super("learning-activity-scene");
    }

    create() {
      this.drawBackground();
      this.createHud();
      this.startTimer();
      this.renderRound();
    }

    private drawBackground() {
      const background = this.add.graphics();
      background.fillStyle(hexToNumber(game.theme.secondary), 1);
      background.fillRoundedRect(0, 0, 960, 560, 32);

      const blobColors = [
        { color: hexToNumber(game.theme.primary), alpha: 0.45, x: 120, y: 90, radius: 110 },
        { color: hexToNumber(game.theme.accent), alpha: 0.22, x: 860, y: 120, radius: 95 },
        { color: 0xffffff, alpha: 0.6, x: 780, y: 420, radius: 120 },
        { color: hexToNumber(game.theme.primary), alpha: 0.28, x: 180, y: 460, radius: 130 },
      ];

      blobColors.forEach((blob) => {
        background.fillStyle(blob.color, blob.alpha);
        background.fillCircle(blob.x, blob.y, blob.radius);
      });

      for (let index = 0; index < 12; index += 1) {
        const sparkle = this.add.circle(
          Phaser.Math.Between(50, 910),
          Phaser.Math.Between(50, 510),
          Phaser.Math.Between(4, 8),
          0xffffff,
          0.65,
        );

        this.tweens.add({
          targets: sparkle,
          alpha: { from: 0.25, to: 0.85 },
          y: sparkle.y - Phaser.Math.Between(10, 24),
          duration: Phaser.Math.Between(1200, 2200),
          yoyo: true,
          repeat: -1,
        });
      }
    }

    private createHud() {
      const header = this.add.rectangle(480, 70, 870, 110, 0xffffff, 0.82);
      header.setStrokeStyle(3, hexToNumber(game.theme.primary), 0.8);

      this.add.text(90, 36, game.title, {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "28px",
        fontStyle: "bold",
        color: "#224127",
      });

      this.promptText = this.add.text(90, 70, "", {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "22px",
        fontStyle: "bold",
        color: "#36543b",
        wordWrap: { width: 540 },
      });

      this.hintText = this.add.text(90, 136, game.instructions, {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "17px",
        color: "#547158",
        wordWrap: { width: 700 },
      });

      this.scoreText = this.add.text(760, 34, "Score: 0", {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "21px",
        fontStyle: "bold",
        color: "#214028",
      });

      this.timerText = this.add.text(760, 68, `Time: ${this.timeLeft}s`, {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "21px",
        fontStyle: "bold",
        color: "#214028",
      });

      this.progressText = this.add.text(
        760,
        102,
        `Round: ${this.roundIndex + 1}/${game.rounds.length}`,
        {
          fontFamily: "Trebuchet MS, Verdana, sans-serif",
          fontSize: "18px",
          color: "#456548",
        },
      );
    }

    private startTimer() {
      this.timerEvent = this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
          this.timeLeft -= 1;
          this.syncStatus();

          if (this.timeLeft <= 0) {
            this.finishGame("Time is up. Press play again for another round.");
          }
        },
      });
    }

    private syncStatus(message?: string, finished = false) {
      this.scoreText?.setText(`Score: ${this.score}`);
      this.timerText?.setText(`Time: ${Math.max(this.timeLeft, 0)}s`);
      this.progressText?.setText(
        `Round: ${Math.min(this.roundIndex + 1, game.rounds.length)}/${game.rounds.length}`,
      );

      setStatus({
        score: this.score,
        timeLeft: Math.max(this.timeLeft, 0),
        round: Math.min(this.roundIndex + 1, game.rounds.length),
        totalRounds: game.rounds.length,
        message: message ?? game.instructions,
        finished,
      });
    }

    private showMessage(message: string, tint = "#36543b") {
      this.hintText?.setColor(tint);
      this.hintText?.setText(message);
      this.syncStatus(message);
    }

    private clearRoundObjects() {
      this.roundObjects.forEach((object) => object.destroy());
      this.roundObjects = [];
      this.inputLocked = false;
    }

    private renderRound() {
      if (this.roundIndex >= game.rounds.length) {
        this.finishGame(`Amazing work. Final score: ${this.score}`);
        return;
      }

      this.clearRoundObjects();

      if (game.mode === "choice") {
        this.renderChoiceRound(game.rounds[this.roundIndex]);
        return;
      }

      if (game.mode === "tap") {
        this.renderTapRound(game.rounds[this.roundIndex]);
        return;
      }

      if (game.mode === "sort") {
        this.renderSortRound(game.rounds[this.roundIndex]);
        return;
      }

      this.renderMemoryRound(game.rounds[this.roundIndex]);
    }

    private renderChoiceRound(round: ChoiceRound) {
      this.promptText?.setText(round.prompt);
      this.showMessage("Tap the best answer.");

      round.options.forEach((option, index) => {
        const button = this.createChoiceButton(480, 240 + index * 90, 560, 64, option.label);

        button.on("pointerdown", () => {
          if (this.inputLocked) {
            return;
          }

          this.inputLocked = true;

          if (option.correct) {
            button.background?.setFillStyle(hexToNumber(game.theme.primary), 1);
            this.registerCorrect("Brilliant choice!", 12, button.x, button.y);
            this.time.delayedCall(550, () => {
              this.roundIndex += 1;
              this.renderRound();
            });
          } else {
            button.background?.setFillStyle(0xffc0c0, 1);
            this.timeLeft = Math.max(this.timeLeft - 3, 0);
            this.showMessage("Try the next clue carefully. Time penalty: -3s", "#b35d5d");
            this.inputLocked = false;
            this.syncStatus("Try the next clue carefully. Time penalty: -3s");
          }
        });
      });
    }

    private renderTapRound(round: TapRound) {
      this.promptText?.setText(round.prompt);
      this.showMessage("Tap every correct bubble.");

      let remainingCorrect = round.targets.filter((target) => target.correct).length;
      const positions = [
        { x: 220, y: 280 },
        { x: 400, y: 250 },
        { x: 590, y: 290 },
        { x: 760, y: 250 },
        { x: 320, y: 390 },
        { x: 640, y: 390 },
      ];

      round.targets.forEach((target, index) => {
        const position = positions[index % positions.length];
        const bubble = this.createBubble(position.x, position.y, target.label);

        bubble.on("pointerdown", () => {
          if (this.inputLocked) {
            return;
          }

          if (target.correct) {
            remainingCorrect -= 1;
            this.score += 8;
            this.spawnSparkles(bubble.x, bubble.y);
            bubble.disableInteractive();
            bubble.alpha = 0.45;
            bubble.background?.setFillStyle(hexToNumber(game.theme.primary), 0.95);
            this.showMessage(`Nice hit. ${remainingCorrect} to go.`);
            this.syncStatus(`Nice hit. ${remainingCorrect} to go.`);

            if (remainingCorrect <= 0) {
              this.registerCorrect("Round complete!", 4, bubble.x, bubble.y);
              this.inputLocked = true;
              this.time.delayedCall(600, () => {
                this.roundIndex += 1;
                this.renderRound();
              });
            }
          } else {
            bubble.background?.setFillStyle(0xffc0c0, 0.95);
            this.timeLeft = Math.max(this.timeLeft - 2, 0);
            this.showMessage("Oops. That one does not fit. Time penalty: -2s", "#b35d5d");
            this.syncStatus("Oops. That one does not fit. Time penalty: -2s");
          }
        });
      });
    }

    private renderSortRound(round: SortRound) {
      this.promptText?.setText(round.prompt);
      this.showMessage("Drag each card into the matching zone.");

      const zoneY = 430;
      const leftZone = this.createDropZone(270, zoneY, round.categories[0], 0xfff9ea);
      const rightZone = this.createDropZone(690, zoneY, round.categories[1], 0xecfff0);
      const zones = [
        { category: round.categories[0], zone: leftZone },
        { category: round.categories[1], zone: rightZone },
      ];
      let placedCount = 0;

      round.items.forEach((item, index) => {
        const card = this.createDraggableCard(
          240 + (index % 2) * 280,
          250 + Math.floor(index / 2) * 86,
          item.label,
        );
        const startX = card.x;
        const startY = card.y;

        card.setData("category", item.category);
        this.input.setDraggable(card);

        card.on("drag", (_pointer: PhaserType.Input.Pointer, dragX: number, dragY: number) => {
          if (this.inputLocked) {
            return;
          }

          card.x = dragX;
          card.y = dragY;
        });

        card.on("dragend", () => {
          if (this.inputLocked) {
            return;
          }

          const matchedZone = zones.find(({ zone }) => zone.getBounds().contains(card.x, card.y));

          if (!matchedZone) {
            this.tweens.add({
              targets: card,
              x: startX,
              y: startY,
              duration: 250,
              ease: "Sine.easeOut",
            });
            return;
          }

          if (matchedZone.category === card.getData("category")) {
            placedCount += 1;
            this.score += 10;
            card.disableInteractive();
            card.x = matchedZone.zone.x;
            card.y = matchedZone.zone.y + Phaser.Math.Between(-22, 22);
            card.background?.setFillStyle(hexToNumber(game.theme.primary), 1);
            this.spawnSparkles(card.x, card.y);
            this.showMessage(`Great sorting. ${round.items.length - placedCount} card(s) left.`);
            this.syncStatus(`Great sorting. ${round.items.length - placedCount} card(s) left.`);

            if (placedCount === round.items.length) {
              this.inputLocked = true;
              this.time.delayedCall(650, () => {
                this.roundIndex += 1;
                this.renderRound();
              });
            }
          } else {
            this.timeLeft = Math.max(this.timeLeft - 2, 0);
            this.showMessage("That bin does not match. Time penalty: -2s", "#b35d5d");
            this.syncStatus("That bin does not match. Time penalty: -2s");
            this.tweens.add({
              targets: card,
              x: startX,
              y: startY,
              duration: 280,
              ease: "Back.easeOut",
            });
          }
        });
      });
    }

    private renderMemoryRound(round: MemoryRound) {
      this.promptText?.setText(round.prompt);
      this.showMessage("Flip two cards and find the matching pair.");

      const deck = shuffleArray(
        round.pairs.flatMap((pair) => [
          { pairId: pair.pairId, label: pair.left },
          { pairId: pair.pairId, label: pair.right },
        ]),
      );
      let firstCard: (ButtonContainer & { cardData: MemoryCard; matched: boolean; revealed: boolean }) | null = null;
      let matchedPairs = 0;

      deck.forEach((cardData, index) => {
        const column = index % 4;
        const row = Math.floor(index / 4);
        const card = this.createMemoryCard(210 + column * 180, 260 + row * 120, cardData) as ButtonContainer & {
          cardData: MemoryCard;
          matched: boolean;
          revealed: boolean;
        };

        card.cardData = cardData;
        card.matched = false;
        card.revealed = false;

        card.on("pointerdown", () => {
          if (this.inputLocked || card.matched || card.revealed) {
            return;
          }

          this.revealCard(card);

          if (!firstCard) {
            firstCard = card;
            return;
          }

          this.inputLocked = true;

          if (firstCard.cardData.pairId === card.cardData.pairId) {
            firstCard.matched = true;
            card.matched = true;
            matchedPairs += 1;
            this.score += 14;
            this.spawnSparkles(card.x, card.y);
            this.showMessage("Perfect match!");
            this.syncStatus("Perfect match!");

            firstCard = null;
            this.inputLocked = false;

            if (matchedPairs === round.pairs.length) {
              this.time.delayedCall(650, () => {
                this.roundIndex += 1;
                this.renderRound();
              });
            }
          } else {
            this.time.delayedCall(700, () => {
              if (firstCard) {
                this.hideCard(firstCard);
              }
              this.hideCard(card);
              firstCard = null;
              this.inputLocked = false;
            });
          }
        });
      });
    }

    private createChoiceButton(x: number, y: number, width: number, height: number, label: string) {
      const background = this.add.rectangle(0, 0, width, height, 0xffffff, 0.95);
      background.setStrokeStyle(3, hexToNumber(game.theme.primary), 0.8);

      const text = this.add.text(0, 0, label, {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#27452b",
        align: "center",
        wordWrap: { width: width - 32 },
      });
      text.setOrigin(0.5);

      const button = this.add.container(x, y, [background, text]) as ButtonContainer;
      button.setSize(width, height);
      button.setInteractive({ useHandCursor: true });
      button.background = background;
      button.label = text;

      button.on("pointerover", () => {
        background.setFillStyle(hexToNumber(game.theme.secondary), 1);
        button.y -= 2;
      });
      button.on("pointerout", () => {
        background.setFillStyle(0xffffff, 0.95);
        button.y += 2;
      });

      this.roundObjects.push(button);
      return button;
    }

    private createBubble(x: number, y: number, label: string) {
      const background = this.add.circle(0, 0, 52, hexToNumber(game.theme.accent), 0.92);
      background.setStrokeStyle(4, 0xffffff, 0.95);

      const text = this.add.text(0, 0, label, {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 80 },
      });
      text.setOrigin(0.5);

      const bubble = this.add.container(x, y, [background, text]) as ButtonContainer;
      bubble.setSize(104, 104);
      bubble.setInteractive({ useHandCursor: true });
      bubble.background = background;
      bubble.label = text;

      this.tweens.add({
        targets: bubble,
        y: y - 10,
        duration: 1200 + Phaser.Math.Between(0, 500),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      this.roundObjects.push(bubble);
      return bubble;
    }

    private createDropZone(x: number, y: number, label: string, color: number) {
      const zone = this.add.rectangle(x, y, 260, 120, color, 0.96);
      zone.setStrokeStyle(4, hexToNumber(game.theme.primary), 0.85);

      const text = this.add.text(x, y, label, {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#315035",
        align: "center",
      });
      text.setOrigin(0.5);

      this.roundObjects.push(zone, text);
      return zone;
    }

    private createDraggableCard(x: number, y: number, label: string) {
      const background = this.add.rectangle(0, 0, 220, 60, 0xffffff, 0.96);
      background.setStrokeStyle(3, hexToNumber(game.theme.primary), 0.82);

      const text = this.add.text(0, 0, label, {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#2a482f",
        align: "center",
        wordWrap: { width: 180 },
      });
      text.setOrigin(0.5);

      const card = this.add.container(x, y, [background, text]) as ButtonContainer;
      card.setSize(220, 60);
      card.setInteractive({ useHandCursor: true, draggable: true });
      card.background = background;
      card.label = text;
      this.roundObjects.push(card);
      return card;
    }

    private createMemoryCard(x: number, y: number, cardData: MemoryCard) {
      const background = this.add.rectangle(0, 0, 150, 88, 0xffffff, 0.96);
      background.setStrokeStyle(3, hexToNumber(game.theme.primary), 0.82);

      const text = this.add.text(0, 0, "?", {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "30px",
        fontStyle: "bold",
        color: "#36543b",
        align: "center",
      });
      text.setOrigin(0.5);

      const card = this.add.container(x, y, [background, text]) as ButtonContainer;
      card.setSize(150, 88);
      card.setInteractive({ useHandCursor: true });
      card.setData("memoryLabel", cardData.label);
      card.background = background;
      card.label = text;
      this.roundObjects.push(card);
      return card;
    }

    private revealCard(card: ButtonContainer & { cardData: MemoryCard; revealed: boolean }) {
      card.revealed = true;
      card.background?.setFillStyle(hexToNumber(game.theme.primary), 1);
      card.label?.setText(card.cardData.label);
      card.label?.setFontSize(18);
    }

    private hideCard(card: ButtonContainer & { revealed: boolean; matched: boolean }) {
      if (card.matched) {
        return;
      }

      card.revealed = false;
      card.background?.setFillStyle(0xffffff, 0.96);
      card.label?.setText("?");
      card.label?.setFontSize(30);
    }

    private registerCorrect(message: string, points: number, x: number, y: number) {
      this.score += points;
      this.showMessage(message);
      this.syncStatus(message);
      this.spawnSparkles(x, y);
    }

    private spawnSparkles(x: number, y: number) {
      for (let index = 0; index < 8; index += 1) {
        const star = this.add.circle(x, y, Phaser.Math.Between(4, 7), 0xffffff, 0.9);
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const distance = Phaser.Math.Between(26, 70);

        this.tweens.add({
          targets: star,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          alpha: 0,
          scale: 0.1,
          duration: 480,
          onComplete: () => star.destroy(),
        });
      }
    }

    private finishGame(message: string) {
      this.timerEvent?.remove(false);
      this.clearRoundObjects();
      this.inputLocked = true;
      this.promptText?.setText("Great job!");
      this.hintText?.setColor("#2f6a41");
      this.hintText?.setText(message);

      const panel = this.add.rectangle(480, 330, 520, 180, 0xffffff, 0.96);
      panel.setStrokeStyle(4, hexToNumber(game.theme.primary), 0.85);

      const title = this.add.text(480, 280, "Level Complete", {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "34px",
        fontStyle: "bold",
        color: "#224127",
      });
      title.setOrigin(0.5);

      const scoreText = this.add.text(480, 334, `Final score: ${this.score}`, {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "28px",
        fontStyle: "bold",
        color: "#35573a",
      });
      scoreText.setOrigin(0.5);

      const note = this.add.text(480, 382, "Press Play Again below to try for an even bigger score.", {
        fontFamily: "Trebuchet MS, Verdana, sans-serif",
        fontSize: "18px",
        color: "#56725a",
        align: "center",
        wordWrap: { width: 420 },
      });
      note.setOrigin(0.5);

      this.roundObjects.push(panel, title, scoreText, note);
      this.syncStatus(message, true);

       if (!this.completionReported) {
        this.completionReported = true;
        const xp = Math.max(10, this.score);
        onGameComplete?.({
          score: this.score,
          xp,
        });
      }
    }
  };
}

export default function ActivityGamePlayer({ game, onGameComplete }: ActivityGamePlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [restartSeed, setRestartSeed] = useState(0);
  const [status, setStatus] = useState<StatusState>({
    score: 0,
    timeLeft: game.timeLimit,
    round: 1,
    totalRounds: getRoundCount(game),
    message: game.instructions,
    finished: false,
  });

  useEffect(() => {
    const mountNode = containerRef.current;
    let phaserGame: PhaserType.Game | null = null;
    let isCancelled = false;

    if (!mountNode) {
      return;
    }

    setStatus({
      score: 0,
      timeLeft: game.timeLimit,
      round: 1,
      totalRounds: getRoundCount(game),
      message: game.instructions,
      finished: false,
    });

    const loadGame = async () => {
      const Phaser = (await import("phaser")).default;

      if (isCancelled || !mountNode) {
        return;
      }

      const LearningScene = createLearningScene(Phaser, game, setStatus, onGameComplete);

      phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        parent: mountNode,
        width: 960,
        height: 560,
        backgroundColor: game.theme.secondary,
        scene: [LearningScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });
    };

    void loadGame();

    return () => {
      isCancelled = true;
      phaserGame?.destroy(true);
      if (mountNode) {
        mountNode.innerHTML = "";
      }
    };
  }, [game, onGameComplete, restartSeed]);

  return (
    <div className="space-y-6">
      <section
        className="rounded-[1.8rem] border border-white/70 p-5 shadow-[0_18px_40px_rgba(95,120,92,0.14)]"
        style={{
          background: `linear-gradient(145deg, ${game.theme.secondary}, #ffffff 58%, ${game.theme.primary}55)`,
        }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-[#224127]">{game.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5c735f]">{game.intro}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/85 px-4 py-3 text-center shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#799278]">Score</div>
              <div className="mt-1 text-2xl font-bold text-[#214028]">{status.score}</div>
            </div>
            <div className="rounded-2xl bg-white/85 px-4 py-3 text-center shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#799278]">Timer</div>
              <div className="mt-1 text-2xl font-bold text-[#214028]">{status.timeLeft}s</div>
            </div>
            <div className="rounded-2xl bg-white/85 px-4 py-3 text-center shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#799278]">Round</div>
              <div className="mt-1 text-2xl font-bold text-[#214028]">
                {status.round}/{status.totalRounds}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white/75 px-4 py-3 text-sm leading-7 text-[#506552] shadow-sm">
          {status.message}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-[#d8e6d2] bg-white/90 p-3 shadow-[0_24px_60px_rgba(96,124,89,0.16)]">
        <div
          ref={containerRef}
          className="min-h-[320px] rounded-[1.6rem] bg-[linear-gradient(180deg,#fbfef9_0%,#eef7ea_100%)]"
        />
      </section>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setRestartSeed((seed) => seed + 1)}
          className="inline-flex min-w-40 items-center justify-center rounded-full border border-[#cfe0c7] bg-[linear-gradient(135deg,#ffffff_0%,#f0f9eb_100%)] px-6 py-3 text-sm font-semibold text-[#2d4e31] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Play Again
        </button>
        <div className="text-center text-sm text-[#5e735e]">
          {status.finished ? "You finished the game." : "Keep playing before the timer runs out."}
        </div>
      </div>
    </div>
  );
}
