const brain = require("./botBrain.js");

const Bot = function(difficulty){
  this.name = 'BOT';
  this.playerId = 'O';
  this.timesWin = 0;
  this.data=[];
  this.difficulty = difficulty;
};

const changeMode = function(difficulty){
  this.difficulty = difficulty;
}

const invalidMove = function(move,alreadyChoosen){
  if(alreadyChoosen.includes(move)) return true;
  return ![1,2,3,4,5,6,7,8,9].includes(move);
};


const play = function(bot,alreadyChoosen,playerData){
  let move = brain.determineMove(this.data,playerData,alreadyChoosen);
  while(invalidMove(move,alreadyChoosen)){
    move = brain.determineMove(this.data,playerData,alreadyChoosen);
  }
  this.data.push(move);
  return move;
};

Bot.prototype.play = play;
module.exports=Bot;
