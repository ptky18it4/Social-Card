/* eslint-disable jsx-a11y/alt-text */
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import IconSearch from "../../images/search-solid.png";
import {
  addStateAsync,
  createPostAsync,
  getAllPostAsync,
  getStateAsync,
  removeStateAsync,
  revertCreatePostAsync,
  revertDeletePostAsync,
} from "../api/ActionPostAsync";
import { findPostByNameAndDescription, revertPost } from "./postSlice";

// web.cjs is required for IE11 support
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { animated, useSpring } from "react-spring";
import { STATE_ADD } from "../../constants/constants";
import { validateCreatePost } from "../helper/validate";
import { STATE_DELETE } from "./../../constants/constants";
const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 514,
  height: 379,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  padding: 0,
};

const Nav = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isAvatarPicked, setIsAvatarPicked] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isImagePicked, setIsImagePicked] = useState(false);
  const [search, setSearch] = useState("");
  const currentState = useSelector((state) => state.posts.revert.at(-1));
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChangeName = (e) => {
    setName(e.target.value);
  };

  const handleOnChangeDesc = (e) => {
    setDescription(e.target.value);
  };

  const handleOnChangeAvatar = (e) => {
    setSelectedAvatar(e.target.files[0]);
    setIsAvatarPicked(true);
  };

  const handleOnChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
    setIsImagePicked(true);
  };

  const handleOnChangeSearch = (e) => {
    setSearch(e.target.value);
    dispatch(findPostByNameAndDescription(e.target.value));
  };

  const clearState = () => {
    setSelectedAvatar();
    setIsAvatarPicked(false);
    setSelectedImage();
    setIsImagePicked(false);
    setName("");
    setDescription("");
  };

  const handleCancel = () => {
    setOpen(false);
    clearState();
  };

  const handleRevert = () => {
    dispatch(getStateAsync());
    if (currentState === STATE_ADD) {
      dispatch(revertCreatePostAsync());
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else if (currentState === STATE_DELETE) {
      dispatch(revertDeletePostAsync());
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else if (currentState === undefined) {
      alert("Còn gì nữa đâu mà revert ☺️");
    }
    dispatch(removeStateAsync());
    dispatch(getAllPostAsync());
    dispatch(getStateAsync());
  };

  const formDataAvatar = new FormData();
  formDataAvatar.append("upload_preset", "social");
  formDataAvatar.append("file", selectedAvatar);

  const formDataImage = new FormData();
  formDataImage.append("upload_preset", "social");
  formDataImage.append("file", selectedImage);

  const onSubmit = async () => {
    if (!validateCreatePost(selectedAvatar, name, description)) {
      alert("Bạn trẻ vui lòng nhập đầy đủ hộ tôi 😜");
    } else {
      alert("OKE RỒI NHEN BẠN TRẺ 😜");
      try {
        setIsLoading(true);
        const resImage = await axios
          .post(
            "https://api.cloudinary.com/v1_1/fast-boy-reliable/upload",
            formDataImage,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .catch((e) => {
            console.error("Error upload image: ", e);
          });

        const resAvatar = await axios
          .post(
            "https://api.cloudinary.com/v1_1/fast-boy-reliable/upload",
            formDataAvatar,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .catch((e) => {
            console.error("Error upload avatar: ", e);
          });

        dispatch(
          createPostAsync({
            avatar: resAvatar.data.url,
            name: name,
            description: description,
            image: resImage ? resImage.data.url : "",
          })
        );
        dispatch(
          revertPost({
            status: STATE_DELETE,
          })
        );
        dispatch(
          addStateAsync({
            status: STATE_ADD,
          })
        );

        dispatch(getAllPostAsync());
        setOpen(false);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setIsLoading(false);
        clearState();
        dispatch(getAllPostAsync());
        dispatch(getStateAsync());
      }
    }
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div>
      <div className="nav">
        <div className="nav-container">
          <button onClick={handleRevert} className="btn btn-revert">
            Revert
          </button>
          <button onClick={handleOpen} className="btn btn-add">
            Add New
          </button>
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search name..."
              value={search}
              onChange={handleOnChangeSearch}
            />

            {/* <button onClick={handleSearch} className="search-button"></button> */}
            <img src={IconSearch} alt="" className="search-button" />
          </div>
        </div>
      </div>

      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="modal">
            {/* <form
              action="#"
              onSubmit={onSubmit}
              // method="post"
              id="#"
              encType="multipart/form-data"
            > */}
            <h2 className="modal-header">Add new card</h2>
            <div className="modal-upload__avatar">
              <label
                htmlFor="input-avatar"
                id="label-avatar"
                className="modal-avatar"
              >
                Avatar
                <sup>&nbsp;*</sup>
              </label>
              <label
                htmlFor="upload-avatar"
                className="modal-upload-input__avatar"
              >
                <svg
                  id="upload-avatar__file"
                  className="modal-upload__avatar__file"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="19.997"
                  viewBox="0 0 20 19.997"
                >
                  <path
                    id="upload-solid"
                    d="M11.562,15.072H8.438a.935.935,0,0,1-.938-.937V7.572H4.074A.78.78,0,0,1,3.523,6.24L9.465.295a.757.757,0,0,1,1.066,0L16.477,6.24a.78.78,0,0,1-.551,1.332H12.5v6.563A.935.935,0,0,1,11.562,15.072ZM20,14.76v4.375a.935.935,0,0,1-.937.938H.937A.935.935,0,0,1,0,19.135V14.76a.935.935,0,0,1,.937-.937H6.25v.313a2.189,2.189,0,0,0,2.188,2.187h3.125a2.189,2.189,0,0,0,2.188-2.187v-.312h5.313A.935.935,0,0,1,20,14.76ZM15.156,18.2a.781.781,0,1,0-.781.781A.784.784,0,0,0,15.156,18.2Zm2.5,0a.781.781,0,1,0-.781.781A.784.784,0,0,0,17.656,18.2Z"
                    transform="translate(0 -0.075)"
                    fill="#064ebc"
                  />
                </svg>
              </label>
              <span
                id="avatar-name"
                className="modal-upload__avatar__label__name"
              >
                {isAvatarPicked === true ? selectedAvatar.name : "Upload image"}
              </span>
              <input
                id="upload-avatar"
                type="file"
                name="avatar"
                className="modal-input__avatar"
                onChange={handleOnChangeAvatar}
                accept="image/png, image/jpg, image/jpeg"
              />
            </div>
            <div className="modal-name">
              <label
                htmlFor="input-name"
                id="label-name"
                className="modal-header__name"
              >
                Name
                <sup>&nbsp;*</sup>
              </label>
              <input
                id="input-name"
                type="text"
                name="name"
                className="modal-input__name"
                value={name}
                onChange={handleOnChangeName}
              />
            </div>
            <div className="modal-description">
              <label
                htmlFor="input-description"
                id="label-description"
                className="modal-header__description"
              >
                Description
                <sup>*</sup>
              </label>
              <textarea
                rows="4"
                cols="50"
                maxLength="500"
                id="input-description"
                type="text"
                value={description}
                name="description"
                className="modal-input__description"
                onChange={handleOnChangeDesc}
              ></textarea>
            </div>
            <div className="modal-upload__image">
              <label
                htmlFor="input-image"
                id="input-image"
                className="modal-image"
              >
                Image
              </label>
              <label
                htmlFor="upload-image"
                className="modal-upload-input__image"
              >
                <svg
                  id="upload-avatar__file"
                  className="modal-upload__avatar__file"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="19.997"
                  viewBox="0 0 20 19.997"
                >
                  <path
                    id="upload-solid"
                    d="M11.562,15.072H8.438a.935.935,0,0,1-.938-.937V7.572H4.074A.78.78,0,0,1,3.523,6.24L9.465.295a.757.757,0,0,1,1.066,0L16.477,6.24a.78.78,0,0,1-.551,1.332H12.5v6.563A.935.935,0,0,1,11.562,15.072ZM20,14.76v4.375a.935.935,0,0,1-.937.938H.937A.935.935,0,0,1,0,19.135V14.76a.935.935,0,0,1,.937-.937H6.25v.313a2.189,2.189,0,0,0,2.188,2.187h3.125a2.189,2.189,0,0,0,2.188-2.187v-.312h5.313A.935.935,0,0,1,20,14.76ZM15.156,18.2a.781.781,0,1,0-.781.781A.784.784,0,0,0,15.156,18.2Zm2.5,0a.781.781,0,1,0-.781.781A.784.784,0,0,0,17.656,18.2Z"
                    transform="translate(0 -0.075)"
                    fill="#064ebc"
                  />
                </svg>
                <span>
                  {isImagePicked === true ? selectedImage.name : "Upload image"}
                </span>
              </label>
              <input
                id="upload-image"
                type="file"
                name="image"
                onChange={handleOnChangeImage}
                className="modal-input__image"
                accept="image/png, image/jpg, image/jpeg"
              />
            </div>
            <hr className="divider" />
            <div className="options">
              <button onClick={onSubmit} className="btn btn-save">
                {isLoading ? (
                  <CircularProgress style={{ width: "20px", height: "20px" }} />
                ) : (
                  "Save"
                )}
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-cancel btn-disable"
              >
                Cancel
              </button>
            </div>
            {/* </form> */}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Nav;
