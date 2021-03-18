const Pool = require("pg").Pool;
const pool = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

const insertTrack = async (trackId) => {
  const query = {
    text: "CALL insert_track ($1)",
    values: [trackId],
  };

  try {
    return await pool.query(query);
  } catch (err) {
    throw err;
  }
};

const insertPosition = async (lat, lon, heading, trackId) => {
  const query = {
    text: "CALL insert_position ($1, $2, $3, $4)",
    values: [lat, lon, heading, trackId],
  };

  try {
    return await pool.query(query);
  } catch (err) {
    throw err;
  }
};

const getTracks = async () => {
  const query = {
    text: "SELECT * FROM tracks",
  };

  try {
    return await pool.query(query);
  } catch (err) {
    throw err;
  }
};

const getPositionsByTrackId = async (trackId) => {
  const query = {
    text: "SELECT * FROM positions WHERE track_id = ($1)",
    values: [trackId],
  };

  try {
    return await pool.query(query);
  } catch (err) {
    throw err;
  }
};

const deleteTrack = async (trackId) => {
  const query = {
    text: "CALL delete_track ($1)",
    values: [trackId],
  };

  try {
    return await pool.query(query);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  insertTrack,
  insertPosition,
  getTracks,
  getPositionsByTrackId,
  deleteTrack,
};
