import Tile from "./tile";

export default class Grid {
  size: any;
  cells: any;

  constructor(size: any, previousState?: any) {
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();
  }

  // Build a grid of the specified size
  public empty(): any[][] {
    var cells = [];

    for (var x = 0; x < this.size; x++) {
      var row: any = cells[x] = [];

      for (var y = 0; y < this.size; y++) {
        row.push(null);
      }
    }

    return cells;
  }

  public fromState(state: any): any[][] {
    var cells = [];

    for (var x = 0; x < this.size; x++) {
      var row: any[] = cells[x] = [];

      for (var y = 0; y < this.size; y++) {
        var tile = state[x][y];
        row.push(tile ? new Tile(tile.position, tile.value) : null);
      }
    }

    return cells;
  }

  // Find the first available random position
  public randomAvailableCell() {
    var cells = this.availableCells();

    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }

  public availableCells(): any[] {
    var cells: any[] = [];

    this.eachCell(function (x: any, y: any, tile: any) {
      if (!tile) {
        cells.push({x: x, y: y});
      }
    });

    return cells;
  }

  // Call callback for every cell
  public eachCell(callback: (x: number, y: number, tile: Tile) => void) {
    for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  }

  // Check if there are any cells available
  public cellsAvailable() {
    return !!this.availableCells().length;
  }

  // Check if the specified cell is taken
  public cellAvailable(cell: any) {
    return !this.cellOccupied(cell);
  }

  public cellOccupied(cell: any) {
    return !!this.cellContent(cell);
  }

  public cellContent(cell: any) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y];
    } else {
      return null;
    }
  }

  // Inserts a tile at its position
  public insertTile(tile: any) {
    this.cells[tile.x][tile.y] = tile;
  }

  public removeTile(tile: any) {
    this.cells[tile.x][tile.y] = null;
  }

  public withinBounds(position: any) {
    return position.x >= 0 && position.x < this.size &&
      position.y >= 0 && position.y < this.size;
  }

  public serialize(): { size: any, cells: any[][] } {
    var cellState = [];

    for (var x = 0; x < this.size; x++) {
      var row: any[] = cellState[x] = [];

      for (var y = 0; y < this.size; y++) {
        row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
      }
    }

    return {
      size: this.size,
      cells: cellState
    };
  }
}
