import React from "react";
import EmptyImage from "../../../images/image-empty.svg";

const Empty = () => {
  return (
    <div>
      {/* Empty section */}
      <div className="main-empty">
        <img src={EmptyImage} alt="" />
        <p className="main-empty__header">No Results Found</p>
        <p className="main-empty__description">
          No content matched your criteria. Try searching for something else.
        </p>
      </div>
    </div>
  );
};

export default Empty;
