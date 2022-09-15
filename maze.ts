export {};
const maze: string[][] = [
  ["a", "b", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a"],
  ["a", "c", "a", "d", "d", "e", "a", "c", "c", "c", "d", "a"],
  ["a", "c", "c", "d", "a", "e", "a", "d", "a", "d", "a", "a"],
  ["a", "a", "a", "a", "a", "e", "d", "d", "a", "d", "e", "a"],
  ["a", "c", "c", "d", "d", "d", "a", "a", "a", "a", "e", "a"],
  ["a", "c", "a", "a", "a", "a", "a", "d", "d", "d", "e", "a"],
  ["a", "d", "d", "d", "e", "e", "a", "c", "a", "a", "a", "a"],
  ["a", "a", "a", "e", "a", "e", "a", "c", "c", "d", "d", "a"],
  ["a", "d", "e", "e", "a", "d", "a", "a", "a", "a", "a", "a"],
  ["a", "a", "d", "a", "a", "d", "a", "c", "d", "d", "a", "a"],
  ["a", "d", "d", "d", "a", "d", "c", "c", "a", "d", "e", "b"],
  ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a"],
  ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a"],
];

type Coordinates = {
  row: number,
  col: number
}

// START HERE: Notice that you have to specify the starting point here.
findPath([{ row: 0, col: 1 }]);

/*
  Strategy: For each square, we will try to move to Bottom, Right, Left and Up recursively, and store the path for each recursion.
  If a recursion find a path that contain another B, it means the solution was found, then we print the path.
*/
function findPath(path: Coordinates[]): void {
  const { row, col }: Coordinates = path[path.length - 1];

  // Stop condition
  if (maze[row][col] === "b" && path.length > 1) {
    printPath(path);
    return;
  }

  move({ row: row + 1, col }, path);
  move({ row, col: col + 1 }, path);
  move({ row, col: col - 1 }, path);
  move({ row: row - 1, col }, path);
}

/*
  If a move is valid, inserts the move in the path array and call the recursion with the the position in the maze.
*/
function move({ row, col }: Coordinates, path: Coordinates[]): boolean {
  // prevent array out of bounds for the maze
  if (row < 0 || col < 0 || row > maze.length - 1 || col > maze[0].length - 1)
    return false;

  // Validate Move
  if (pathAlreadyExists({ row, col }, path)) return false;
  if (!isThreeLetterRuleValid({ row, col }, path)) return false;
  if (!isConsecutiveLetter({ row, col }, path) && maze[row][col] !== "b")
    return false;

  const newPath: Coordinates[] = [...path];
  newPath.push({ row, col });
  findPath(newPath);
  return true;
}

/*
  Check if the movement that you are trying to do is already in the path.
  Nodes that are already visited, can not be visited again.
*/
function pathAlreadyExists({ row, col }: Coordinates, path: Coordinates[]) {
  return path.some((tuple) => tuple.row === row && tuple.col === col);
}

/*
  You can only walk in three letters at once, unless it's the letter B
*/
function isThreeLetterRuleValid({ row, col }: Coordinates, path: Coordinates[]): boolean {
  try {
    if (maze[row][col] === "b" || path.length == 1) return true;
  } catch (error) {
    console.log(error);
  }

  const areLastThreeLettersInPathEqual: boolean =
    maze[path[path.length - 1].row][path[path.length - 1].col] ===
      maze[path[path.length - 2].row][path[path.length - 2].col] &&
    maze[path[path.length - 2].row][path[path.length - 2].col] ===
      maze[path[path.length - 3].row][path[path.length - 3].col];

  const isCurrentLetterAndLastLetterEqual: boolean =
    maze[row][col] ===
    maze[path[path.length - 1].row][path[path.length - 1].col];

  // Fails if there are 4 equal consecutive letters
  if (
    path.length > 3 &&
    isCurrentLetterAndLastLetterEqual &&
    areLastThreeLettersInPathEqual
  ) {
    return false;
  }

  // A path letter must be different then the previous 3 path letters
  if (
    path.length > 3 &&
    !isCurrentLetterAndLastLetterEqual &&
    areLastThreeLettersInPathEqual
  ) {
    return true;
  }

  // The letter you will move must be equal to the previous letter
  if (isCurrentLetterAndLastLetterEqual) {
    return true;
  }

  return false;
}

/*
  Returns true if the movement is a sibling compared to the last movement in the path.
  Only movements through siblings letters or equal letters are valid within the maze.
  Example: Leter D can only move to letters C, D or E
*/
function isConsecutiveLetter({ row: nextRow, col: nextCol }: Coordinates, path: Coordinates[]): boolean {
  const letters: string[] = ["a", "b", "c", "d", "e"];
  const { row: prevRow, col: prevCol }: Coordinates = path[path.length - 1];

  const prevLetter: string = maze[prevRow][prevCol];
  const nextLetter: string = maze[nextRow][nextCol];

  const prevLetterIndex: number = letters.indexOf(prevLetter);
  const nextLetterIndex: number = letters.indexOf(nextLetter);

  if (letters[prevLetterIndex] === letters[nextLetterIndex]) {
    return true;
  }

  if (
    prevLetterIndex > 0 &&
    letters[prevLetterIndex - 1] === letters[nextLetterIndex]
  ) {
    return true;
  }

  if (
    prevLetterIndex < letters.length - 1 &&
    letters[prevLetterIndex + 1] === letters[nextLetterIndex]
  ) {
    return true;
  }

  return false;
}

function printPath(path: Coordinates[]): string {
  console.log("FOUND PATH: ");
  console.log(path);
  let pathStr: string = "";

  path.forEach((node, index) => {
    const letter: string = maze[node.row][node.col];
    if (letter === "b" && index != 0) {
      pathStr = pathStr + "-";
    } else if (pathStr.length % 4 === 1 && pathStr !== "") {
      pathStr = pathStr + "-";
    }
    pathStr = pathStr + letter;
  });

  console.log(pathStr);
  return pathStr;
}
