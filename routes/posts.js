const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");

// 게시글 작성
router.post("/", async (req, res) => {
  const { user, password, title, content } = req.body;
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  try {
    await Post.create({ user, password, title, content });
    res.status(200).json({ message: "게시글을 생성하였습니다." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 게시글 조회
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: "desc" })
      .select("-password -__v")
      .exec();
    const data = {
      data: posts.map((a) => {
        return {
          postId: a._id,
          user: a.user,
          title: a.title,
          content: a.content,
          createdAt: a.createdAt,
        };
      }),
    };
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

// 게시글 상세 조회
router.get("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  if (Object.values(req.params).length === 0) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  try {
    const post = await Post.findOne({ _id: _postId })
      .select("-password")
      .exec();
    const data = {
      data: {
        postId: post._id,
        user: post.user,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
      },
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 게시글 수정
router.put("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { password, title, content } = req.body;

  if (
    Object.keys(req.body).length === 0 ||
    Object.values(req.params).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  try {
    const existPost = await Post.findById(_postId);
    if (existPost.password === password) {
      await Post.updateOne(
        { _id: _postId },
        { $set: { password: password, title: title, content: content } }
      );
      res.status(200).json({ message: "게시글을 수정하였습니다." });
    } else {
      res.status(400).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (error) {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 삭제
router.delete("/:_postId", async (req, res) => {
  const { _postId } = req.params;
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
    const existPost = await Post.findById(_postId);
    if (existPost.password === password) {
      await Post.deleteOne({ _id: _postId });
      res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } else {
      res.status(400).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (error) {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
  }
});

module.exports = router;
