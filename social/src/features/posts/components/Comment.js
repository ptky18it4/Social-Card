import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { updatePostByIdAsync } from "../../api/ActionPostAsync";
import { validateCreateComment } from "../../helper/validate";

const Comment = () => {
  const [content, setContent] = useState("");
  const params = useParams();
  const dispatch = useDispatch();
  const handleMessageChange = (event) => {
    setContent(event.target.value);
  };

  const handleComment = () => {
    if (!validateCreateComment(content)) {
      alert("Bạn trẻ nhập comment hộ tôi 😜");
    } else {
      dispatch(updatePostByIdAsync({ id: params.id, content: content }));
      setContent("");
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="comment">
        <div className="comment-container">
          <h5 className="header">Post a new coment</h5>
          <div className="textarea">
            <textarea
              autoFocus
              className="content"
              value={content}
              id="comment"
              name="comment"
              onChange={handleMessageChange}
              placeholder="Add comment..."
            ></textarea>
            <button className="btn btn-post" onClick={handleComment}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
