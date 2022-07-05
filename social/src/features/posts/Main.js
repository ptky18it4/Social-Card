import React, { useEffect } from "react";
import Empty from "./components/Empty";
import Nav from "./Nav";
import PostItem from "./components/PostItem";
import PostDetail from "./PostDetail";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findAllPosts, findSearchList, getAllPostAsync } from "./postSlice";
const Main = () => {
  const posts = useSelector(findAllPosts);
  const searchs = useSelector(findSearchList);

  return (
    <div>
      <div className="main">
        <div className="main-container">
          <h1 className="main-header">LIST SOCIAL CARD</h1>
          <Nav />

          <div className="main-list">
            {/* Post item section */}
            {searchs.length !== 0 ? (
              searchs
                .filter((item) => item.deleted === false)
                .map((item) => (
                  <PostItem
                    key={item._id}
                    name={item.name}
                    id={item._id}
                    description={item.description}
                    avatar={item.avatar}
                    image={item.image}
                    createdAt={item.createdAt}
                  />
                ))
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
