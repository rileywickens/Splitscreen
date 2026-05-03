module.exports = class Game {
  id = null;
  slug = null;
  name = null;
  image = null;
  genres = [];
  ratings = [];
  platforms = [];
  age_rating = null;
  publishers = [];
  developers = [];
  tags = [];
  release_date = null;

  //Title, Pictue, Genres, Ratings, Platforms, Age_ratings, release date, developers, publishers, gamemodes
  constructor(data) {
    this.id = data.gme_id;
    this.slug = data.gme_slug;
    this.name = data.gme_name;
    this.image = data.gme_image;
  }

  addGenre(genre) {
    this.genres.push(genre);
  }

  addRating(rating) {
    this.ratings.push(rating);
  }

  addPlatform(platform) {
    this.platforms.push(platform);
  }

  setAgeRating(ageRating) {
    this.age_rating = ageRating;
  }

  addPublisher(publisher) {
    this.publishers.push(publisher);
  }

  addDeveloper(developer) {
    this.developers.push(developer);
  }

  addTag(tag) {
    this.tags.push(tag);
  }

  setReleaseDate(release_date) {
    this.release_date = release_date;
  }

  toJSON() {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      image: this.image,
      genres: this.genres,
      ratings: this.ratings,
      platforms: this.platforms,
      age_rating: this.age_rating,
      publishers: this.publishers,
      developers: this.developers,
      tags: this.tags,
      release_date: this.release_date
    }
  }
};