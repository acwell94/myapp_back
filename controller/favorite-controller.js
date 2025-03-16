// 좋아요 갯수 가져오기

const { GetFavoriteCount_model } = require("../model/favorite-model");

const getLikeCountByPerfumeId = async (req, res) => {
  const { perfumeId } = req.query;

  try {
    const targetData = await GetFavoriteCount_model(perfumeId);
    if (targetData) {
      return res.status(200).json({ message: "호출 완료", data: targetData });
    } else {
      return res.status(200).json({ message: "데이터 없음", data: [] });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "서버 에러" });
  }
};

module.exports = { getLikeCountByPerfumeId };
