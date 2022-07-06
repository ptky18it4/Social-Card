import { createSlice } from "@reduxjs/toolkit";

import {
  createPostAsync,
  getAllPostAsync,
  getPostByIdAsync,
  deletePostAsync,
  updatePostByIdAsync,
  revertPostAsync,
} from "../api/ActionPostAsync";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    deleted: [],
    newlyAdded: [],
    searchs: [],
    postDetail: {},
  },
  reducers: {
    addPost: (state, action) => {
      state.newlyAdded.push(action.payload);
      state.searchs.push(action.payload);
    },
    deletePost: (state, action) => {
      const index = state.searchs.findIndex(function (i) {
        return i._id === action.payload.id;
      });
      if (index !== -1) {
        let itemDeleted = JSON.parse(
          JSON.stringify(state.searchs.splice(index, 1))
        );
        state.deleted.push(...itemDeleted);
      }
    },
    revertItemDeleted: (state, action) => {
      if (Array.isArray(state.searchs) && state.deleted.length !== 0) {
        state.searchs = state.searchs.concat(state.deleted.pop());
        return state.deleted.pop().id;
      }
    },
    findPostByNameAndDescription: (state, action) => {
      const searchKey = action.payload;
      const result = state.posts.filter(
        (post) =>
          post.description.toLowerCase().includes(searchKey.toLowerCase()) ||
          post.name.toLowerCase().includes(searchKey.toLowerCase())
      );
      state.searchs = result;
    },
  },
  extraReducers: {
    [createPostAsync.fulfilled]: (state, action) => {
      return action.payload.posts;
    },
    [getAllPostAsync.fulfilled]: (state, action) => {
      state.posts = action.payload.posts;
      state.searchs = action.payload.posts;
    },
    [getPostByIdAsync.fulfilled]: (state, action) => {
      state.postDetail = action.payload;
    },
    // Delete
    [deletePostAsync.fulfilled]: (state, action) => {
      state.deleted.filter((post) => post.id !== action.payload.id);
    },
    [updatePostByIdAsync.fulfilled]: (state, action) => {
      return action.payload.posts;
    },
    [revertPostAsync.fulfilled]: (state, action) => {
      // state.posts = action.payload.posts;
      state.searchs = action.payload.posts;
    },
  },
});

export const {
  addPost,
  deletePost,
  revertItemDeleted,
  revertItemDeletedById,
  findPostByNameAndDescription,
} = postSlice.actions;

export const findAllPosts = (state) => state.posts.posts;

export const findPostById = (state) => state.posts.postDetail;

export const findPostsDeleted = (state) => state.posts.deleted;
export const findSearchList = (state) => state.posts.searchs;
export default postSlice.reducer;
