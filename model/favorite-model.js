const pool = require("../config/db");

// 좋아요
const GetFavoriteCount_model = async (perfumeId) => {
  try {
    const query = `SELECT 'like' FROM perfume WHERE perfumeId = ?;`;
    const [rows] = await pool.execute(query, [perfumeId]);
    return rows.length > 0 ? rows[0] : false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const FindLikePerfume = async (userId, perfumeId) => {
  try {
    const query = `SELECT * FROM favorite WHERE userId = ? WHERE perfumeId = ?`;
    const [rows] = await pool.execute(query, [userId, perfumeId]);
    return rows.length > 0 ? rows[0] : false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const AddFavorite_model = async (userId, perfumeId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const query = `INSERT INTO favorite (userId, perfumeId) VALUES (?, ?);`;
    await connection.query(query, [userId, perfumeId]);

    const likeCountQuery = `UPDATE perfume SET 'like' = 'like' + 1 WHERE perfumeId = ?`;
    await connection.query(likeCountQuery, [perfumeId]);
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    return false;
  } finally {
    connection.release();
  }
};

const DeleteFavorite_model = async (userId, perfumeId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const query = `DELETE FROM favorite WHERE userId = ? AND perfumeId = ?`;
    await connection.query(query, [userId, perfumeId]);
    const deleteLikeCountQuery = `UPDATE perfume SET 'like' = 'like' -1 WHERE perfumeId = ?`;
    await connection.query(deleteLikeCountQuery, [perfumeId]);
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    return false;
  } finally {
    connection.release();
  }
};
module.exports = {
  GetFavoriteCount_model,
  FindLikePerfume,
  AddFavorite_model,
  DeleteFavorite_model,
};
