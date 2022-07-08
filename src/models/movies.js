const { db } = require("../config/db");
const { ErrorHandler } = require("../middlewares/errorHandler");

const postMovie = async (body, image) => {
  const { title, genre, duration, casts, synopsis, director, release_date, cinema_price, cinema_name, cinema_city, cinema_address, cinema_time, cinema_date } = body;
  try {
    const movieQuery = "INSERT INTO movies(title,genre,duration,casts,synopsis,director,release_date,image) values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id";
    const movie = await db.query(movieQuery, [title, genre, duration, casts, synopsis, director, release_date, image]);
    const movieId = movie.rows[0].id;
    const cinemaQuery = "INSERT INTO cinemas(movies_id,price,name) values($1,$2,$3) returning id";
    const cinema = await db.query(cinemaQuery, [movieId, cinema_price, cinema_name]);
    const cinemaId = cinema.rows[0].id;
    const resultQuery = "with cl as(INSERT INTO cinema_locations(city,address,cinema_id) values($1,$2,$3) returning *),ct as(INSERT INTO cinema_times(cinema_id,time,date) values($3,$4,$5) returning *) select * from cl,ct";
    const result = await db.query(resultQuery, [cinema_city, cinema_address, cinemaId, cinema_time, cinema_date]);
    return {
      data: result.rows[0],
      message: "Movie successfully created",
    };
  } catch (error) {
    throw new ErrorHandler({ status: error.status || 500, message: error.message });
  }
};

const getMovieNow = async () => {
  try {
    const sqlQuery =
      "SELECT distinct on(m.id)c.movies_id ,title,genre,duration,casts,synopsis,director,date(release_date) as release_date,image,c.price as price, c.name as cinema_name,cl.city as cinema_city,cl.address as cinema_address,ct.time as cinema_time,ct.date as cinema_date FROM movies m join cinemas c on c.movies_id = m.id join cinema_locations cl on cl.cinema_id = c.id join cinema_times ct on ct.cinema_id = c.id WHERE date_part('day',release_date) between date_part('day',release_date) and date_part('day',release_date)+30 GROUP by date(release_date),m.id,m.title,m.genre,m.duration,m.casts,m.synopsis,m.director,m.image,c.name,c.price,cl.city,cl.address,ct.time,ct.date,c.movies_id ";
    const result = await db.query(sqlQuery);
    if (!result.rowCount) throw new ErrorHandler({ status: 404, message: "Movies not found" });
    return {
      data: result.rows,
    };
  } catch (error) {
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

const getMovieUpcoming = async (query) => {
  const { month = 8 } = query;
  try {
    const sqlQuery =
      "SELECT distinct on(m.id)c.movies_id,title,genre,duration,casts,synopsis,director,date(release_date),image,c.price as price, c.name as cinema_name,cl.city as cinema_city,cl.address as cinema_address,ct.time as cinema_time,ct.date as cinema_date FROM movies m join cinemas c on c.movies_id = m.id join cinema_locations cl on cl.cinema_id = c.id join cinema_times ct on ct.cinema_id = c.id WHERE date_part('month',release_date) = $1 GROUP by date(release_date),m.title,m.genre,m.duration,m.casts,m.synopsis,c.movies_id ,m.director,m.image,c.name,c.price,cl.city,cl.address,ct.time,ct.date,m.id";

    const result = await db.query(sqlQuery, [month]);
    if (!result.rowCount) throw new ErrorHandler({ status: 404, message: "Movies not found" });
    return {
      data: result.rows,
    };
  } catch (error) {
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

const getMovieDetail = async (id) => {
  try {
    let sqlQuery =
      "SELECT m.id,title,genre,duration,casts,synopsis,director,release_date,image,c.price as price, c.name as cinema_name,cl.city as cinema_city,cl.address as cinema_address,ct.time as cinema_time,ct.date as cinema_date FROM movies m join cinemas c on c.movies_id = m.id join cinema_locations cl on cl.cinema_id = c.id join cinema_times ct on ct.cinema_id = c.id WHERE m.id = $1";

    const result = await db.query(sqlQuery, [id]);
    if (!result.rowCount) {
      throw new ErrorHandler({ status: 404, message: "Movie Not Found" });
    }

    return {
      data: result.rows[0],
    };
  } catch (error) {
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

module.exports = { postMovie, getMovieNow, getMovieUpcoming, getMovieDetail };
