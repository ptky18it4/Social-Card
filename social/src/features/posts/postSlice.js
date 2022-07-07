import { createSlice } from "@reduxjs/toolkit";

import {
  addStateAsync,
  createPostAsync,
  deletePostAsync,
  getAllPostAsync,
  getPostByIdAsync,
  getStateAsync,
  removeStateAsync,
  revertCreatePostAsync,
  revertDeletePostAsync,
  updatePostByIdAsync,
} from "../api/ActionPostAsync";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    deleted: [],
    newlyAdded: [],
    searchs: [],
    postDetail: {},
    revert: [],
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
      try {
        if (index !== -1) {
          let itemDeleted = JSON.parse(
            JSON.stringify(state.searchs.splice(index, 1))
          );
          state.deleted.push(...itemDeleted);
        }
      } catch (e) {
        console.log("Error deleted store");
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
    revertPost: (state, action) => {
      state.revert.push(action.payload.status);
    },
  },
  extraReducers: {
    [createPostAsync.fulfilled]: (state, action) => {
      return action.payload.posts;
    },
    [getAllPostAsync.fulfilled]: (state, action) => {
      // state.posts = action.payload.posts;
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
    [revertDeletePostAsync.fulfilled]: (state, action) => {
      // state.posts = action.payload.posts;
      state.searchs = action.payload.posts;
    },
    [revertCreatePostAsync.fulfilled]: (state, action) => {
      // state.posts = action.payload.posts;
      state.searchs = action.payload.posts;
    },
    [getStateAsync.fulfilled]: (state, action) => {
      state.revert = action.payload.state[0].status;
    },
    [addStateAsync.fulfilled]: (state, action) => {
      state.revert = action.payload.state;
    },
    [removeStateAsync.fulfilled]: (state, action) => {
      state.revert = action.payload.states;
    },
  },
});

export const {
  addPost,
  deletePost,
  revertItemDeleted,
  revertItemDeletedById,
  findPostByNameAndDescription,
  revertPost,
} = postSlice.actions;

export const findAllPosts = (state) => state.posts.posts;

export const findPostById = (state) => state.posts.postDetail;
export const findPostsDeleted = (state) => state.posts.deleted;
export const findSearchList = (state) => state.posts.searchs;

export default postSlice.reducer;
