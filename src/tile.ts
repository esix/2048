import { IPosition, type ITileState } from "./local_storage_manager";


export default class Tile {
  public x: number;
  public y: number;
  public value: number;
  public previousPosition: IPosition | null;
  public mergedFrom: [Tile, Tile] | null;

  public constructor(position: IPosition, value: number) {
    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;

    this.previousPosition = null;
    this.mergedFrom = null; // Tracks tiles that merged together
  }

  public savePosition(): void {
    this.previousPosition = {x: this.x, y: this.y};
  }

  public updatePosition(position: IPosition): void {
    this.x = position.x;
    this.y = position.y;
  }

  public serialize(): ITileState {
    return {
      position: {
        x: this.x,
        y: this.y
      },
      value: this.value,
    };
  }
}
