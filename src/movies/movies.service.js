const knex = require("../db/connection.js");

function list() {
  return knex("movies").select("*");
}

function listAllShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ is_showing: true })
    .groupBy("m.movie_id");
}

function listTheaters() {
  return knex("movies_theaters as mt")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*")
    .groupBy("t.theater_id");
}

function insertCritic(movies) {
  return movies.map((movie) => {
    return {
      review_id: movie.review_id,
      content: movie.content,
      score: movie.score,
      created_at: movie.created_at,
      updated_at: movie.updated_at,
      critic_id: movie.critic_id,
      movie_id: movie.movie_id,
      critic: {
        critic_id: movie.c_critic_id,
        preferred_name: movie.preferred_name,
        surname: movie.surname,
        organization_name: movie.organization_name,
      },
    };
  });
}

function listReviews(movieId) {
  return knex("movies")
    .join("reviews", "movies.movie_id", "reviews.movie_id")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select(
      "movies.*",
      "reviews.*",
      "critics.critic_id as c_critic_id",
      "critics.preferred_name",
      "critics.surname",
      "critics.organization_name"
    )
    .where({ "reviews.movie_id": movieId })
    .then(insertCritic);
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

module.exports = {
  list,
  listAllShowing,
  listTheaters,
  listReviews,
  read,
};
