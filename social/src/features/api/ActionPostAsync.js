import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/constants";

export const createPostAsync = createAsyncThunk(
  "posts/createPostAsync",
  async (payload) => {
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
      const posts = await res.json();
      return { posts };
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
        name: payload.name,
        description: payload.description,
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
