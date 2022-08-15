const Post = require('../models/post');

exports.createPost = async (req, res, next) => {
  try {
    const url = `${req.protocol}://${req.get('host')}`;
    console.log("url: ", url);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: `${url}/images/${req.file.filename}`,
      creator: req.userData.userId
    });
    const createdPost = await post.save();

    res.status(201).json({
      message: "Post added successfully",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Creating a post failed!"
    });
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = `${req.protocol}://${req.get('host')}`;
      imagePath = `${url}/images/${req.file.filename}`;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    
    console.log("[UPDATE post route] post:", post);
    const result = await Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post);
    console.log("[Update post route] result:", result);

    if (result.matchedCount >= 1) {
      res.status(200).json({
        message: "Update successfull!"
      });
    } else {
      res.status(401).json({
        message: "Not authorized!"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Couldn't update post!"
    });
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pagesize);
    const currentPage = Number(req.query.page);
    const postQuery = Post.find();
    
    if (!!pageSize && !!currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }

    const posts = await postQuery;
    const count = await Post.count();
    
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: posts,
      maxPosts: count
    });
  } catch (error) {
    res.status(500).json({
      message: "Fetching posts failed"
    });
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Fetching post failed"
    });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id, creator: req.userData.userId });
    if (result.deletedCount >= 1) {
      res.status(200).json({
        message: "Deletion successfull!"
      });
    } else {
      res.status(401).json({
        message: "Not authorized!"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Deletion failed"
    });
  }
};