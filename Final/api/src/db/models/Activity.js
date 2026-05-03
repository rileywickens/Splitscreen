module.exports = class Activity {
  id = null;
  user = null;
  game = null;
  action = null;

  constructor(data) {
    this.id = data.rev_id;
    this.action = data.act_action;
  }

  setUser(user) {
    this.user = user;
  }

  setGame(game) {
    this.game = game;
  }

};