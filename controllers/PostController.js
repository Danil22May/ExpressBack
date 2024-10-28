import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    res.json(error);
  }
};

export const getById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndUpdate(
      postId,
      {
        $inc: { viewsCount: 1 },
      },
      {
        new: true,
      }
    );
    if (!post) {
      return res.status(500).json({ message: "cannot get post" });
    }
    res.json(post);
  } catch (error) {
    res.json(error);
  }
};

export const destroy = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await PostModel.deleteOne({
      _id: postId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    res.json(result);
  } catch (error) {
    res.json(error);
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't add post",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );
    console.log("Hello");
    res.json({
      message: "Updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Cannot update post",
    });
  }
};
