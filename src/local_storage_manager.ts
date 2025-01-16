export default class LocalStorageManager {
  private bestScoreKey: string;
  private gameStateKey: string;
  private storage: Storage;

  public constructor() {
    this.bestScoreKey = "bestScore";
    this.gameStateKey = "gameState";
    this.storage = window.localStorage;
  }

  // Best score getters/setters
  public getBestScore() {
    return +this.storage.getItem(this.bestScoreKey) || 0;
  }

  public setBestScore(score: number): void {
    this.storage.setItem(this.bestScoreKey, String(score));
  }

  // Game state getters/setters and clearing
  public getGameState() {
    var stateJSON = this.storage.getItem(this.gameStateKey);
    return stateJSON ? JSON.parse(stateJSON) : null;
  }

  public setGameState(gameState: any): void {
    this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
  }

  public clearGameState(): void {
    this.storage.removeItem(this.gameStateKey);
  }
}
