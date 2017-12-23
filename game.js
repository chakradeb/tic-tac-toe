const Game = function(){
  this.players = [];
  this.winningCombinations = [
    [1, 3, 2],
    [4, 5, 6],
    [7, 8, 9],
    [1, 5, 9],
    [3, 5, 7],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9]
  ];
  this.movesAlreadyTaken = [];
  this.turn = 2;
  this.mode = "";
}

const addPlayer = function(player){
  this.players.push(player);
}
