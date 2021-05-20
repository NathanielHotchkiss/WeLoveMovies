const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

async function list(req, res) {
  const isShowing = req.query.is_showing;
  const moviesList =
    isShowing != false ? await service.listAllShowing() : await service.list();

  res.json({ data: moviesList });
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

async function listTheaters(req, res) {
  const movieId = req.params.movieId;
  res.json({ data: await service.listTheaters(movieId) });
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

async function listReviews(req, res) {
  const movieId = req.params.movieId;
  const result = await service.listReviews(movieId);
  res.json({ data: result });
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function read(req, res) {
  const { movie } = res.locals;
  res.json({ data: movie });
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

module.exports = {
  list: asyncErrorBoundary(list),
  listTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheaters),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
};
