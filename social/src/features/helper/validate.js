const INPUT_AVATAR = 0;
const INPUT_NAME = 1;
const INPUT_DESC = 2;
const REGEX_IMAGE = /(\.jpg|\.jpeg|\.png)$/i;
const REGEX_INPUT = /^\s*$/;
export function validateCreatePost(...fields) {
  //[input]: AVATAR
  let validAvatar = false;
  let validName = false;
  let validDesc = false;

  if (fields[INPUT_AVATAR] === undefined) {
    document
      .getElementById("avatar-name")
      .classList.add("modal-upload__avatar__label__name__invalid");
    document
      .getElementById("label-avatar")
      .classList.add("modal-avatar-invalid");
    document
      .getElementById("upload-avatar__file")
      .classList.add("modal-upload__avatar__file__invalid");
  } else {
    if (typeof fields[INPUT_AVATAR] !== "string") {
      if (
        !REGEX_IMAGE.exec(".".concat(fields[INPUT_AVATAR].type.substring(6)))
      ) {
        alert(
          "Please upload avatar file having extensions .jpeg/.jpg/.png/ only."
        );
        document
          .getElementById("avatar-name")
          .classList.add("modal-upload__avatar__label__name__invalid");
        document
          .getElementById("label-avatar")
          .classList.add("modal-avatar-invalid");
        document
          .getElementById("upload-avatar__file")
          .classList.add("modal-upload__avatar__file__invalid");
        validAvatar = false;
      } else {
        document
          .getElementById("label-avatar")
          .classList.remove("modal-avatar-invalid");
        document
          .getElementById("upload-avatar__file")
          .classList.remove("modal-upload__avatar__file__invalid");
        document
          .getElementById("avatar-name")
          .classList.remove("modal-upload__avatar__label__name__invalid");
        validAvatar = true;
      }
    } else {
      validAvatar = true;
    }
  }

  const testName = REGEX_INPUT.test(fields[INPUT_NAME].trim());
  const testDesc = REGEX_INPUT.test(fields[INPUT_DESC].trim());
  // [input]: Name
  if (testName) {
    document
      .getElementById("label-name")
      .classList.add("modal-header__name-invalid");
    document
      .getElementById("input-name")
      .classList.add("modal-input__name-invalid");
  } else {
    document
      .getElementById("label-name")
      .classList.remove("modal-header__name-invalid");
    document
      .getElementById("input-name")
      .classList.remove("modal-input__name-invalid");
    validName = true;
  }

  // [input]: Description
  if (testDesc) {
    document
      .getElementById("label-description")
      .classList.add("modal-header__description-invalid");
    document
      .getElementById("input-description")
      .classList.add("modal-input__description-invalid");
  } else {
    document
      .getElementById("label-description")
      .classList.remove("modal-header__description-invalid");
    document
      .getElementById("input-description")
      .classList.remove("modal-input__description-invalid");
    validDesc = true;
  }
  if (validAvatar && validName && validDesc) {
    return true;
  } else {
    return false;
  }
}

export function validateCreateComment(comment) {
  const testComment = REGEX_INPUT.test(comment.trim());
  if (testComment) {
    document.getElementById("comment").classList.add("content-invalid");
    return false;
  } else {
    document.getElementById("comment").classList.remove("content-invalid");
    return true;
  }
}
