var turn = 1;
var win = {"X":0,"O":0}
var winningCombinations = [
  [1, 3, 2],
  [4, 5, 6],
  [7, 8, 9],
  [1, 5, 9],
  [3, 5, 7],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9]
];
var allMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var movesTaken;
var player;
var bot;
var board;
var gameResult;
var mode;
let remainingPossibleMoves = [];

function checkReload(){
  let key = event.keyCode;
  if(key==114){
    load();
  }
}

function load() {
  movesTaken = [];
  player = [];
  bot = [];
  mode = "";
  turn = 2;
  remainingPossibleMoves = [];
  remainingPossibleMoves.push(...winningCombinations);
  // remainingPossibleMoves = shuffleWinningCombinations(remainingPossibleMoves);
  gameResult = document.getElementById('gameResult');
  gameResult.innerText = "";
  board = document.getElementById('gameBoard');
  buttons = document.getElementsByClassName('button');
  board.addEventListener('click', putValue);
  [...buttons].forEach((button)=>{
    button.innerText = "";
  });
}

let popElement = function(list,element) {
  let count = 0;
  if(!list.includes(element)){
    return undefined;
  }
  while(list[count]!=element){
    count++;
  }
  list.splice(count,1);
  return element;
}

let shuffleWinningCombinations = function(array){
  let givenArray = array;
  let shuffledArray = [];
  while(givenArray.length>0){
    let index = Math.floor(Math.random()*(givenArray.length));
    shuffledArray.push(givenArray[index]);
    popElement(givenArray,givenArray[index]);
  }
  return shuffledArray;
}

let removeOccupiedPossibilities = function(){
  let occupiedSets = [];
  remainingPossibleMoves.forEach(function(setsToWin){
    if(isSubset(movesTaken,setsToWin)){
      occupiedSets.push(setsToWin);
    }
  });
  occupiedSets.forEach(function(setOccupied){
    popElement(remainingPossibleMoves,setOccupied);
  })
}

var isSubset = function(superset, subset) {
  return subset.every(function(element) {
    return superset.includes(element);
  })
};

var hasWon = function(playerData) {
  let currentPlayer = playerData[turn];
  let checkSubset = function(set) {
    return isSubset(currentPlayer[0],set);
  }
  return winningCombinations.some(checkSubset) && currentPlayer;
};

function updateMove(button, pos) {
  var moves = {
    1: [player, 'X',"Player"],
    2: [bot, 'O',"Computer"]
  }
  turn = 3 - turn;
  button.innerText = moves[turn][1];
  moves[turn][0].push(+pos);
  return hasWon(moves);
}

function showResult(won) {
  if(won){
    gameResult.innerHTML = `<div class='win'></div>${won[2]} won`;
    win[won[1]]++;
    document.getElementById("player").innerText = `${win.X} Times`;
    document.getElementById("ai").innerText = `${win.O} Times`;
    board.removeEventListener('click', putValue);
    return true;
  }
  if (movesTaken.sort().join('') == allMoves.join('')) {
    gameResult.innerText = "Match Draw";
    return true;
  }
}

var putValue = function(event) {
  if(player.length==0&&bot.length==0){
    mode = decideMode();
  }
  id = event.srcElement.id;
  if (!(+id > 0 && +id < 10))
    return;
  var won = "";
  gameResult.innerText = "";
  if (movesTaken.includes(+id)) {
    gameResult.innerHTML = "<div class='invalid'></div>Invalid Move";
  } else {
    movesTaken.push(+id);
    removeOccupiedPossibilities();
    var button = document.getElementById(id);
    won = updateMove(button, id);
  }
  var final = showResult(won);
  if (turn == 1 && !final) {
    var dummyEvent = {
      srcElement: {
        id: mode()
      }
    };
    putValue(dummyEvent);
  }
}

let findMissingElements = function(subset, superset) {
  return superset.filter(function(element) {
    return !subset.includes(element);
  })
}

let mostMatch = function(subset, superset) {
  let match = 0;
  let matchSet = [];
  superset.forEach(function(supersetElement) {
    let matchCount = 0;
    subset.forEach(function(subsetElement) {
      if (supersetElement.includes(subsetElement)) {
        matchCount++;
      }
    });
    if (matchCount > match) {
      match = matchCount;
      matchSet = supersetElement;
    }
  });
  return matchSet;
}

let decideMove = function(){
  let botsMove;
  let lastMove = player[player.length-1];
  if(lastMove%2==1){
    botsMove = bestPossibleMove(lastMove);
  }else{
    botsMove = findMissingElements(movesTaken,allMoves)[0];
  }
  return botsMove;
}

let easyModeBot = function() {
  let botsMove = Math.floor(Math.random() * 9) + 1;
  if (movesTaken.includes(botsMove)) {
    return easyModeBot(movesTaken);
  }
  return botsMove + "";
}

let mediumModeBot = function() {
  let possibleMove = mostMatch(player, remainingPossibleMoves);
  let botsMove = findMissingElements(player, possibleMove)[0];
  if (movesTaken.includes(botsMove)) {
    botsMove = findMissingElements(movesTaken, allMoves)[0];
  }
  if (player.length == 1) {
    if (movesTaken.includes(5)) {
      botsMove = 1;
    } else {
      botsMove = 5;
    }
  }
  return botsMove + "";
}

let hardModeBot = function(){
  let botsMove;
  if(player.length == 1 && player.includes(5)){
    botsMove = 1;
  }else if(player.length == 1){
    botsMove = 5;
  }else{
    let playersPossibleMove = mostMatch(player, remainingPossibleMoves);
    let botsPossibleMove = mostMatch(bot,remainingPossibleMoves);
    let playersMovesToWin = findMissingElements(player,playersPossibleMove);
    let botsMovesToWin = findMissingElements(bot,botsPossibleMove);
    if(botsMovesToWin.length==1){
      botsMove = botsMovesToWin[0];
    }else if(playersMovesToWin.length==1){
      botsMove = playersMovesToWin[0];
    }else{
      let count = 0;
      while(count<botsMovesToWin.length){
        botsMove = botsMovesToWin[count];
        if(movesTaken.includes(botsMove)){
          count++;
        }else{
          break;
        }
      }
    }
  }
  return botsMove + "";
}

let decideMode = function(){
  if(document.getElementById("Easy").checked){
    mode = easyModeBot;
  }
  if(document.getElementById("Medium").checked){
    mode = mediumModeBot;
  }
  if(document.getElementById("Hard").checked){
    mode = hardModeBot;
  }
  return mode;
}
