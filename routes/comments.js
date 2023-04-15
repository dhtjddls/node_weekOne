const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment");
module.exports = router;

// 댓글 생성
router.post("/:_postId/comments", async (req, res) => {
  const { _postId } = req.params;
  const { user, password, content } = req.body;
  if (content === "" || undefined) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }
  if (Object.values(req.params).length === 0) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  try {
    await Comment.create({
      postId: _postId,
      user: user,
      password: password,
      content: content,
    });
    res.status(200).json({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 댓글 조회
router.get("/:_postId/comments", async (req, res) => {
  if (Object.values(req.params).length === 0) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  try {
    const comments = await Comment.find({
      postId: req.params._postId,
    })
      .sort({ createdAt: "desc" })
      .select("-postId -password -__v");
    const data = {
      data: comments.map((a) => {
        return {
          commentId: a._id,
          user: a.user,
          content: a.content,
          createdAt: a.createdAt,
        };
      }),
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 댓글 수정
router.put("/:_postId/comments/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password, content } = req.body;
  if (
    Object.keys(req.body).length === 0 ||
    Object.values(req.params).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  if (content === "" || undefined) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }

  try {
    const existComment = await Comment.findById(_commentId);
    if (existComment.password === password) {
      await Comment.updateOne(
        { _id: _commentId },
        { $set: { password: password, content: content } }
      );
      res.status(200).json({ message: "댓글을 수정하였습니다." });
    } else {
      res.status(400).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (error) {
    res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  }
});

// 댓글 삭제
router.delete("/:_postId/comments/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password } = req.body;

  if (
    Object.keys(req.body).length === 0 ||
    Object.values(req.params).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  try {
    const existComment = await Comment.findById(_commentId);
    if (existComment.password === password) {
      await Comment.deleteOne({ _id: _commentId });
      res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } else {
      res.status(400).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (error) {
    res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  }
});
