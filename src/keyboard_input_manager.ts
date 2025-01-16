export default class KeyboardInputManager {
  private events: any;
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

  public on(event: any, callback: any) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  private emit(event: any, data: any) {
    var callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(function (callback: any) {
        callback(data);
      });
    }
  }

  private listen() {
    var self = this;

    var map: { [key: number]: number } = {
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
    document.addEventListener("keydown", function (event) {
      var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
        event.shiftKey;
      var mapped = map[event.which];

      if (!modifiers) {
        if (mapped !== undefined) {
          event.preventDefault();
          self.emit("move", mapped);
        }
      }

      // R key restarts the game
      if (!modifiers && event.which === 82) {
        self.restart.call(self, event);
      }
    });

    // Respond to button presses
    this.bindButtonPress(".retry-button", this.restart);
    this.bindButtonPress(".restart-button", this.restart);
    this.bindButtonPress(".keep-playing-button", this.keepPlaying);

    // Respond to swipe events
    var touchStartClientX: any, touchStartClientY: any;
    var gameContainer = document.getElementsByClassName("game-container")[0];

    gameContainer.addEventListener(this.eventTouchstart, function (event: any) {
      if (event.touches.length > 1) {
        return; // Ignore if touching with more than 1 finger
      }

      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;

      event.preventDefault();
    });

    gameContainer.addEventListener(this.eventTouchmove, function (event: any) {
      event.preventDefault();
    });

    gameContainer.addEventListener(this.eventTouchend, function (event: any) {
      if (event.touches.length > 0) {
        return; // Ignore if still touching with one or more fingers
      }

      var touchEndClientX, touchEndClientY;

      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;

      var dx = touchEndClientX - touchStartClientX;
      var absDx = Math.abs(dx);

      var dy = touchEndClientY - touchStartClientY;
      var absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 10) {
        // (right : left) : (down : up)
        self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
      }
    });
  }

  private restart(event: any) {
    event.preventDefault();
    this.emit("restart", null);
  }

  private keepPlaying(event: any) {
    event.preventDefault();
    this.emit("keepPlaying", null);
  }

  private bindButtonPress(selector: any, fn: any) {
    var button = document.querySelector(selector);
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
  }
}
