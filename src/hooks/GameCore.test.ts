import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { TileState, useGameCore } from "./GameCore";

describe("hook for GameCore", () => {
  const initGameCoreHook = () => {
    return renderHook(() =>
      useGameCore({
        gridSize: "4x4",
        tilesResolutionDelay: 100,
      })
    );
  };

  const getUniqueTiles = (tiles: TileState[]) =>
    tiles.filter(
      (tile, idx) =>
        tiles.findIndex(({ value }) => value === tile.value) === idx
    );

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("should have a initial state", () => {
    const { result } = initGameCoreHook();
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.tiles).toBeInstanceOf(Array);
    expect(result.current.tiles).toHaveLength(16);
  });

  it("should be able to select a tile", () => {
    const { result } = initGameCoreHook();

    const tile = result.current.tiles[0];
    expect(tile.state).toBe("hidden");
    act(() => {
      result.current.onSelectTile({ id: tile.id });
    });

    expect(result.current.tiles[0].id).toBe(tile.id);
    expect(result.current.tiles[0].state).toBe("selected");
  });

  it("should be able to select a pair of tiles", () => {
    const { result } = initGameCoreHook();

    // select two different tiles
    const firstTile = () => getUniqueTiles(result.current.tiles)[0];
    const secondTile = () => getUniqueTiles(result.current.tiles)[1];

    act(() => {
      result.current.onSelectTile({ id: firstTile().id });
    });
    expect(firstTile().state).toEqual("selected");
    expect(secondTile().state).toEqual("hidden");

    act(() => {
      result.current.onSelectTile({ id: secondTile().id });
    });
    expect(firstTile().state).toEqual("selected");
    expect(secondTile().state).toEqual("selected");

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(firstTile().state).toEqual("hidden");
    expect(secondTile().state).toEqual("hidden");
  });

  it("should be able to pair a set of tiles", () => {
    const { result } = initGameCoreHook();

    const pairOfTiles = () =>
      result.current.tiles.filter((tile) => tile.value === 7);
    expect(pairOfTiles()).toHaveLength(2);

    pairOfTiles().forEach(({ id }) => {
      act(() => {
        result.current.onSelectTile({ id });
      });
    });

    expect(pairOfTiles()[0].state).toBe("selected");
    expect(pairOfTiles()[1].state).toBe("selected");

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(pairOfTiles()[0].state).toBe("paired");
    expect(pairOfTiles()[1].state).toBe("paired");
  });

  it("should ignore selected the same tile twice", async () => {
    const { result } = initGameCoreHook();

    [1, 2].forEach(() => {
      act(() => {
        result.current.onSelectTile({ id: result.current.tiles[0].id });
      });
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.tiles[0].state).toBe("selected");
  });

  it("should return false when trying to select a tile that is not hidden", () => {
    const { result } = initGameCoreHook();

    const pairOfTiles = () =>
      result.current.tiles.filter((tile) => tile.value === 7);

    act(() => {
      expect(result.current.onSelectTile({ id: pairOfTiles()[0].id })).toBe(
        true
      );
    });
    act(() => {
      expect(result.current.onSelectTile({ id: pairOfTiles()[0].id })).toBe(
        false
      );
    });
    act(() => {
      expect(result.current.onSelectTile({ id: pairOfTiles()[1].id })).toBe(
        true
      );
    });
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(pairOfTiles()[0].state).toBe("paired");
    act(() => {
      expect(result.current.onSelectTile({ id: pairOfTiles()[0].id })).toBe(
        false
      );
    });
  });

  it("should have a signal for Game Over and resettable", () => {
    const { result } = initGameCoreHook();
    expect(result.current.isGameOver).toBe(false);

    const sortedTiles = result.current.tiles.sort((a, b) => a.value - b.value);
    sortedTiles.forEach(({ id }) => {
      act(() => {
        result.current.onSelectTile({ id });
      });
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    });

    result.current.tiles.forEach(({ state }) => {
      expect(state).toBe("paired");
    });
    expect(result.current.isGameOver).toBe(true);

    act(() => {
      result.current.restartGame();
    });
    expect(result.current.isGameOver).toBe(false);
  });
});
