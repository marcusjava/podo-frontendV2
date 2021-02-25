import React from "react";
import spinner from "../../images/gifs/spinner2.gif";

const Spinner = ({ width = 200 }) => {
  return (
    <div>
      <img
        src={spinner}
        alt="Loading"
        style={{
          width: width,
          margin: "auto",
          display: "block",
        }}
      />
    </div>
  );
};

export default Spinner;
