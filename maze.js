"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var maze = [
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
// START HERE: Notice that you have to specify the starting point here.
findPath([{ row: 0, col: 1 }]);
/*
  Strategy: For each square, we will try to move to Bottom, Right, Left and Up recursively, and store the path for each recursion.
  If a recursion find a path that contain another B, it means the solution was found, then we print the path.
*/
function findPath(path) {
    var _a = path[path.length - 1], row = _a.row, col = _a.col;
    // Stop condition
    if (maze[row][col] === "b" && path.length > 1) {
        printPath(path);
        return;
    }
    move({ row: row + 1, col: col }, path);
    move({ row: row, col: col + 1 }, path);
    move({ row: row, col: col - 1 }, path);
    move({ row: row - 1, col: col }, path);
}
/*
  If a move is valid, inserts the move in the path array and call the recursion with the the position in the maze.
*/
function move(_a, path) {
    var row = _a.row, col = _a.col;
    // prevent array out of bounds for the maze
    if (row < 0 || col < 0 || row > maze.length - 1 || col > maze[0].length - 1)
        return false;
    // Validate Move
    if (pathAlreadyExists({ row: row, col: col }, path))
        return false;
    if (!isThreeLetterRuleValid({ row: row, col: col }, path))
        return false;
    if (!isConsecutiveLetter({ row: row, col: col }, path) && maze[row][col] !== "b")
        return false;
    var newPath = __spreadArray([], path, true);
    newPath.push({ row: row, col: col });
    findPath(newPath);
    return true;
}
/*
  Check if the movement that you are trying to do is already in the path.
  Nodes that are already visited, can not be visited again.
*/
function pathAlreadyExists(_a, path) {
    var row = _a.row, col = _a.col;
    return path.some(function (tuple) { return tuple.row === row && tuple.col === col; });
}
/*
  You can only walk in three letters at once, unless it's the letter B
*/
function isThreeLetterRuleValid(_a, path) {
    var row = _a.row, col = _a.col;
    try {
        if (maze[row][col] === "b" || path.length == 1)
            return true;
    }
    catch (error) {
        console.log(error);
    }
    var areLastThreeLettersInPathEqual = maze[path[path.length - 1].row][path[path.length - 1].col] ===
        maze[path[path.length - 2].row][path[path.length - 2].col] &&
        maze[path[path.length - 2].row][path[path.length - 2].col] ===
            maze[path[path.length - 3].row][path[path.length - 3].col];
    var isCurrentLetterAndLastLetterEqual = maze[row][col] ===
        maze[path[path.length - 1].row][path[path.length - 1].col];
    // Fails if there are 4 equal consecutive letters
    if (path.length > 3 &&
        isCurrentLetterAndLastLetterEqual &&
        areLastThreeLettersInPathEqual) {
        return false;
    }
    // A path letter must be different then the previous 3 path letters
    if (path.length > 3 &&
        !isCurrentLetterAndLastLetterEqual &&
        areLastThreeLettersInPathEqual) {
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
function isConsecutiveLetter(_a, path) {
    var nextRow = _a.row, nextCol = _a.col;
    var letters = ["a", "b", "c", "d", "e"];
    var _b = path[path.length - 1], prevRow = _b.row, prevCol = _b.col;
    var prevLetter = maze[prevRow][prevCol];
    var nextLetter = maze[nextRow][nextCol];
    var prevLetterIndex = letters.indexOf(prevLetter);
    var nextLetterIndex = letters.indexOf(nextLetter);
    if (letters[prevLetterIndex] === letters[nextLetterIndex]) {
        return true;
    }
    if (prevLetterIndex > 0 &&
        letters[prevLetterIndex - 1] === letters[nextLetterIndex]) {
        return true;
    }
    if (prevLetterIndex < letters.length - 1 &&
        letters[prevLetterIndex + 1] === letters[nextLetterIndex]) {
        return true;
    }
    return false;
}
function printPath(path) {
    console.log("FOUND PATH: ");
    console.log(path);
    var pathStr = "";
    path.forEach(function (node, index) {
        var letter = maze[node.row][node.col];
        if (letter === "b" && index != 0) {
            pathStr = pathStr + "-";
        }
        else if (pathStr.length % 4 === 1 && pathStr !== "") {
            pathStr = pathStr + "-";
        }
        pathStr = pathStr + letter;
    });
    console.log(pathStr);
    return pathStr;
}
