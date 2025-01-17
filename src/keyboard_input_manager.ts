

export const UP = 0;
export const RIGHT = 1;
export const DOWN = 2;
export const LEFT = 3;
export type IDirection = 0 | 1 | 2 | 3;

type IEvent = 'move' | 'restart' | 'keepPlaying';

export default class KeyboardInputManager {
  private events: {
    move?: ((direction: IDirection) => void)[],
    restart?: (() => void)[],
    keepPlaying?: (() => void)[],
  };
  private eventTouchstart: string;
  private eventTouchmove: string;
  private eventTouchend: string;

  public constructor() {
    this.events = {};

    this.eventTouchstart = "touchstart";
    this.eventTouchmove = "touchmove";
    this.eventTouchend = "touchend";

    this.listen();
  }

  public on(event: 'move', callback: (direction: IDirection) => void): void;
  public on(event: 'restart', callback: () => void): void;
  public on(event: 'keepPlaying', callback: () => void): void;
  public on(event: IEvent, callback: unknown): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback as () => void);
  }

  private emit(event: 'move', data: number): void;
  private emit(event: 'restart', data: unknown): void;
  private emit(event: 'keepPlaying', data: unknown): void;
  private emit(event: IEvent, data: number): void {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach((callback: any): void => {
        callback(data);
      });
    }
  }

  private listen(): void {
    const map: { [key: number]: number } = {
      38: 0, // Up
      39: 1, // Right
      40: 2, // Down
      37: 3, // Left
      75: 0, // Vim up
      76: 1, // Vim right
      74: 2, // Vim down
      72: 3, // Vim left
      87: 0, // W
      68: 1, // D
      83: 2, // S
      65: 3  // A
    };

    // Respond to direction keys
    document.addEventListener("keydown", (event): void => {
      const modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
      const mapped = map[event.which];

      if (!modifiers) {
        if (mapped !== undefined) {
          event.preventDefault();
          this.emit("move", mapped);
        }
      }

      // R key restarts the game
      if (!modifiers && event.which === 82) {
        this.restart(event);
      }
    });

    // Respond to button presses
    this.bindButtonPress(".retry-button", this.restart);
    this.bindButtonPress(".restart-button", this.restart);
    this.bindButtonPress(".keep-playing-button", this.keepPlaying);

    // Respond to swipe events
    let touchStartClientX: number, touchStartClientY: number;
    const gameContainer = document.getElementsByClassName("game-container")[0];

    gameContainer.addEventListener(this.eventTouchstart, (event: any): void => {
      if (event.touches.length > 1) {
        return; // Ignore if touching with more than 1 finger
      }

      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;

      event.preventDefault();
    });

    gameContainer.addEventListener(this.eventTouchmove, (event: any): void=> {
      event.preventDefault();
    });

    gameContainer.addEventListener(this.eventTouchend, (event: any): void=> {
      if (event.touches.length > 0) {
        return; // Ignore if still touching with one or more fingers
      }

      const touchEndClientX: number = event.changedTouches[0].clientX;
      const touchEndClientY: number = event.changedTouches[0].clientY;

      const dx = touchEndClientX - touchStartClientX;
      const absDx = Math.abs(dx);

      const dy = touchEndClientY - touchStartClientY;
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 10) {
        // (right : left) : (down : up)
        this.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
      }
    });
  }

  private restart(event: KeyboardEvent): void {
    event.preventDefault();
    this.emit("restart", null);
  }

  private keepPlaying(event: any): void {
    event.preventDefault();
    this.emit("keepPlaying", null);
  }

  private bindButtonPress(selector: string, fn: any): void {
    const button = document.querySelector(selector)!;
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
  }
}
