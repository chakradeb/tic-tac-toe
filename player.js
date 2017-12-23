const Player = function(name){
  this.name = name;
  this.playerId = 'X';
  this.timesWin = 0;
  this.data=[];
};


const invalidMove = function(move,alreadyChoosen){
  if(alreadyChoosen.includes(move)) return true;
  return ![1,2,3,4,5,6,7,8,9].includes(move);
};


const play = function(player,alreadyChoosen,playerData){
  let move = +readline.keyIn();
  while(invalidMove(move,alreadyChoosen)){
    console.log("invalidMove");
    move = +readline.keyIn();
  }
  this.data.push(move);
  return move;
};

Player.prototype.play = play;
module.exports=Player;
