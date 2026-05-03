module.exports = class Review {
  id = null;
  user = null;
  game = null;
  score = null;
  message = null;
  createdAt = null;
  updatedAt = null;

  constructor(data) {
    this.id = data.rev_id;
    this.score = data.rev_score;
    this.message = data.rev_message;
    this.createdAt = data.rev_created_at;
    this.updatedAt = data.rev_updated_at;
  }

  setUser(user) {
    this.user = user;
  }

  setGame(game) {
    this.game = game;
  }

};