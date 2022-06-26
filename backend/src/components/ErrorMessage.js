import React from "react";

const ErrorMessage = (props) => {

    return (
      <div>
        <h2>{props.error.message}</h2>
      </div>
    )
}
export default ErrorMessage