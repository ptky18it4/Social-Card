/* eslint-disable jsx-a11y/img-redundant-alt */
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { format } from "date-format-parse";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ImageDefault from "../../../images/Image 1.png";
import IconPen from "../../../images/pencil-alt-solid.svg";
import IconTrash from "../../../images/trash-alt-regular.svg";
import IconTrashModal from "../../../images/trash-can-regular.svg";
import UploadImage from "../../../images/upload-solid-blue.svg";
import {
  addStateAsync,
  deletePostAsync,
  getAllPostAsync,
  getStateAsync,
  updatePostByIdAsync,
} from "../../api/ActionPostAsync";
import { deletePost, revertPost } from "../postSlice";
// web.cjs is required for IE11 support
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import { STATE_DELETE } from "../../../constants/constants";
import { validateCreatePost } from "../../helper/validate";

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
  // height: 306,
  height: 379,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  padding: 0,
};
const styleDelete = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 514,
  height: 306,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  padding: 0,
};
const PostItem = ({
  id,
  avatar,
  name,
  description,
  image,
  like,
  createdAt,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertDelete, setAlertDelete] = useState(false);
  const [nameUpdate, setNameUpdate] = useState(name);
  const [descriptionUpdate, setDescriptionUpdate] = useState(description);
  const [selectedAvatarUpdate, setSelectedAvatarUpdate] = useState(avatar);
  useState();
  const [isAvatarPickedUpdate, setIsAvatarPickedUpdate] = useState(false);
  const [selectedImageUpdate, setSelectedImageUpdate] = useState(image);
  const [isImagePickedUpdate, setIsImagePickedUpdate] = useState(false);

  const resetState = () => {
    setSelectedAvatarUpdate(avatar);
    setIsAvatarPickedUpdate(false);
    setSelectedImageUpdate(image);
    setIsImagePickedUpdate(false);
    setNameUpdate(name);
    setDescriptionUpdate(description);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAlertDelete = () => setAlertDelete(true);
  const handleCloseAlertDelete = () => setAlertDelete(false);

  const handleEdit = () => {
    handleOpen();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deletePost({ id: id }));
    dispatch(deletePostAsync({ id: id }));
    dispatch(
      revertPost({
        status: STATE_DELETE,
      })
    );
    dispatch(
      addStateAsync({
        status: STATE_DELETE,
      })
    );
    handleCloseAlertDelete();
    setTimeout(() => {
      // window.location.reload();
      dispatch(getAllPostAsync());
      dispatch(getStateAsync());
    }, 500);
  };

  const handleOnChangeName = (e) => {
    setNameUpdate(e.target.value);
  };

  const handleOnChangeDesc = (e) => {
    setDescriptionUpdate(e.target.value);
  };

  const handleOnChangeAvatar = (e) => {
    setSelectedAvatarUpdate(e.target.files[0]);
    setIsAvatarPickedUpdate(true);
  };

  const handleOnChangeImage = (e) => {
    setSelectedImageUpdate(e.target.files[0]);
    setIsImagePickedUpdate(true);
  };
  const handleCancel = () => {
    setOpen(false);
    resetState();
  };
  const formDataAvatar = new FormData();
  formDataAvatar.append("upload_preset", "social");
  formDataAvatar.append("file", selectedAvatarUpdate);

  const formDataImage = new FormData();
  formDataImage.append("upload_preset", "social");
  formDataImage.append("file", selectedImageUpdate);
  const onSubmit = async () => {
    if (
      !validateCreatePost(selectedAvatarUpdate, nameUpdate, descriptionUpdate)
    ) {
      alert("Bạn trẻ vui lòng nhập đầy đủ hộ tôi 😜");
    } else {
      alert("OKE RỒI NHEN BẠN TRẺ 😜");
      if (isAvatarPickedUpdate || isImagePickedUpdate) {
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
            updatePostByIdAsync({
              id: id,
              avatar: resAvatar ? resAvatar.data.url : "",
              name: nameUpdate,
              description: descriptionUpdate,
              image: resImage ? resImage.data.url : "",
            })
          );
        } catch (error) {
          console.log("Error: ", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        dispatch(
          updatePostByIdAsync({
            id: id,
            avatar: selectedAvatarUpdate,
            name: nameUpdate,
            description: descriptionUpdate,
            image: selectedImageUpdate,
          })
        );
      }

      dispatch(getAllPostAsync());
      setOpen(false);
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="item" key={id}>
        <div className="item-container">
          <div className="item-top">
            <img
              className="avatar"
              src={avatar ? `${avatar}` : ImageDefault}
              alt="Avatar"
            />
            <div className="post-copyright">
              <p className="post-copyright-author__name">{name}</p>
              <p className="post-copyright__created">
                {format(createdAt, "DD/MM/YYYY")}
              </p>
            </div>
            <div className="post-item__options">
              <img onClick={handleEdit} src={IconPen} alt="icon-update" />
              <img
                onClick={handleAlertDelete}
                src={IconTrash}
                alt="icon-trash"
              />
            </div>
          </div>

          <Link
            to={`/detail/${id}`}
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <div className="item-bottom">
              <p className="post-content__description">{descriptionUpdate}</p>
              <img
                className="post-content__image"
                src={image ? `${image}` : ImageDefault}
                alt="post image"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* For edit */}
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
            <h2 className="modal-header">Update card</h2>
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
                <span
                  id="avatar-name"
                  className="modal-upload__avatar__label__name"
                >
                  {typeof selectedAvatarUpdate === "string"
                    ? selectedAvatarUpdate
                        .substring(selectedAvatarUpdate.lastIndexOf("/"))
                        .substring(1)
                    : isAvatarPickedUpdate === true
                    ? selectedAvatarUpdate.name
                    : "Upload image"}
                </span>
              </label>
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
                value={nameUpdate}
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
                name="description"
                className="modal-input__description"
                value={descriptionUpdate}
                onChange={handleOnChangeDesc}
              />
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
                <img src={UploadImage} alt="" />
                <span>
                  {typeof selectedImageUpdate === "string" &&
                  selectedImageUpdate !== ""
                    ? selectedImageUpdate
                        .substring(selectedImageUpdate.lastIndexOf("/"))
                        .substring(1)
                    : isImagePickedUpdate === true
                    ? selectedImageUpdate.name
                    : "Upload image"}
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
              <button onClick={onSubmit} className="btn btn-update">
                {isLoading ? (
                  <CircularProgress style={{ width: "20px", height: "20px" }} />
                ) : (
                  "Update"
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

      {/* For delete */}
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={alertDelete}
        onClose={handleCloseAlertDelete}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={alertDelete}>
          <Box sx={styleDelete} className="modal">
            <h2 className="modal-header">Your about to delete a item</h2>

            <div className="modal-trash">
              <img src={IconTrashModal} alt="icon delete" />
              <p className="modal-trash__description">
                This will delete your item form list
                <br />
                Are you sure?
              </p>
            </div>

            <hr className="divider" />

            <div className="options">
              <button onClick={handleDelete} className="btn btn-delete">
                Delete
              </button>
              <button
                onClick={handleCloseAlertDelete}
                className="btn btn-cancel btn-disable"
              >
                Cancel
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default PostItem;
