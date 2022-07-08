const { db } = require("../config/db");
const { ErrorHandler } = require("../middlewares/errorHandler");

const getMovieCinema = async (query) => {
  try {
    const { location, cinema_date, movie_id } = query;

    const queryProperty = Object.keys(query);
    let filterQuery = [];
    let params = [movie_id];
    let sqlQuery = "select c.id,c.price as price,name,city,address,time,date from cinemas c join cinema_locations cl on cl.cinema_id =c.id join cinema_times ct on ct.cinema_id = c.id where c.movies_id = $1 ";

    const queryList = ["location", "cinema_date"];
    const queryFilter = queryProperty.filter((val) => queryList.includes(val));
    const filterLength = queryFilter.length;
    if (filterLength) {
      sqlQuery += " AND";
      for (const key of queryFilter) {
        switch (key) {
          case "location":
            filterQuery.push(" lower(city) = lower($" + (params.length + 1) + ")", " AND");
            params.push(location);
            break;
          case "cinema_date":
            filterQuery.push(" date = $" + (params.length + 1), " AND");
            params.push(cinema_date);
            break;
          default:
            throw new ErrorHandler({ status: 404, message: "key not found" });
        }
      }
      filterQuery.pop();
      sqlQuery += filterQuery.join("");
    }

    const result = await db.query(sqlQuery, params);
    if (!result.rowCount) {
      throw new ErrorHandler({ status: 404, message: "No Cinemas Found" });
    }

    return {
      data: result.rows,
    };
  } catch (error) {
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

const getCinemaSeat = async (query) => {
  const { movie_id, cinema_id } = query;
  try {
    const sqlQuery = "select transaction_id,seat from (select id from screening where cinema_id = $1 and movie_id = $2) as s join transactions t on t.screening_id = s.id join tickets ti on t.id=ti.transaction_id where t.status='PAID'";
    const result = await db.query(sqlQuery, [cinema_id, movie_id]);
    return {
      data: result.rows,
    };
  } catch (error) {
    const status = error.status || 500;
    throw new ErrorHandler({ status, message: error.message });
  }
};

module.exports = { getMovieCinema, getCinemaSeat };
