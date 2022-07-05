import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = "http://192.168.0.119:8800/api";
// const API_URL = "http://localhost:8800/api";
export const createPostAsync = createAsyncThunk(
  "posts/createPostAsync",
  async (payload) => {
    console.log("PAYLOAD: ", payload);
    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        description: payload.description,
        image: payload.image,
        avatar: payload.avatar,
      }),
    });
    if (res.ok) {
      const post = await res.json();
      return { post };
    }
  }
);

export const getAllPostAsync = createAsyncThunk(
  "posts/getAllPostAsync",
  async () => {
    const res = await fetch(`${API_URL}/posts`);
    if (res.ok) {
      const posts = await res.json();
      return { posts };
    }
  }
);

export const deletePostAsync = createAsyncThunk(
  "delete/deletePostAsync",
  async (payload) => {
    const res = await fetch(`${API_URL}/posts/${payload.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      return { id: payload.id };
    }
  }
);

export const revertPostAsync = createAsyncThunk(
  "revert/revertPostAsync",
  async (payload) => {
    const res = await fetch(`${API_URL}/posts/`, {
      method: "PATCH",
    });
    if (res.ok) {
      return "{ id: payload.id };";
    }
  }
);

export const getPostByIdAsync = createAsyncThunk(
  "posts/getPostByIdAsync",
  async (payload) => {
    const res = await fetch(`${API_URL}/posts/${payload.id}`);
    if (res.ok) {
      const post = await res.json();
      return post;
    }
  }
);

export const updatePostByIdAsync = createAsyncThunk(
  "posts/updatePostAsync",
  async (payload) => {
    const res = await fetch(`${API_URL}/posts/${payload.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.nameUpdate,
        description: payload.descriptionUpdate,
        likes: payload.likes,
        content: payload.content,
        image: payload.image,
        avatar: payload.avatar,
      }),
    });
    if (res.ok) {
      const post = await res.json();
      return { post };
    }
  }
);

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
      return 0;
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
