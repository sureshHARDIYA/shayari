const has = require("lodash/has");
const map = require("lodash/map");
const Post = require("../models/post");
const Tag = require("../models/tag");

const resolver = {
  // Queries
  posts: () => {
    return Post.find()
      .sort([['createdAt', 'descending']])
      .populate("owner tags")
      .then(posts => posts)
      .catch(err => err);
  },
  post: args => {
    return Post.findById(args.id)
      .populate("owner tags")
      .then(post => post)
      .catch(err => err);
  },
  tags: () => {
    return Tag.find()
      .then(tags => tags)
      .catch(err => err);
  },
  tag: args => {
    return Tag.findById(args.id)
      .then(tag => tag)
      .catch(err => err);
  },

  // Mutations
  addPost: async (args, context, parent) => {
    args.owner = context.user._id;

    if (has(args, "tags")) {
      const bodyTags = args.tags;
      delete args.tags;
      const createTags = await Tag.findOneOrCreate(bodyTags);
      tagIDs = map(createTags, "_id");
      args["tags"] = tagIDs;
      return await Post.create(args);
    }

    return await Post.create(args);
  },

  updatePost: (args, context, parent) => {
    return Post.findById(args.id)
      .then(post => {
        if (post.owner == context.user._id.toString())
          return Post.findOneAndUpdate({ _id: args.id }, args, { new: true });
      })
      .catch(err => err);
  },
  deletePost: (args, context, parent) => {
    return Post.findById(args.id)
      .then(post => {
        if (post.owner == context.user._id.toString())
          return Post.findOneAndDelete({ _id: args.id });
      })
      .catch(err => err);
  },

  deleteTag: (args, context, parent) => {
    return Tag.findById(args.id)
      .then(post => Tag.findOneAndDelete({ _id: args.id }))
      .catch(err => err);
  },
  addPostTag: (args, context, parent) => {
    return Post.findById(args.postId)
      .then(post => {
        if (post) {
          if (post.owner == context.user._id.toString()) {
            post.tags.push(args.tagId);
            return post.save();
          }
        }
      })
      .catch(err => err);
  },
  removePostTag: (args, context, parent) => {
    return Post.findById(args.postId)
      .then(post => {
        if (post) {
          if (post.owner == context.user._id.toString()) {
            post.tags.splice(post.tags.indexOf(args.tagId), 1);
            return post.save();
          }
        }
      })
      .catch(err => err);
  },
  createTag: args => {
    return Tag.create(args)
      .then(tag => tag)
      .catch(err => err);
  }
};

module.exports = resolver;
