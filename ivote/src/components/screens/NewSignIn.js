import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";
function NewSignIn() {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [showOpt, setShowOpt] = useState(false);
  const [otp, setOtp] = useState("");
  const [adhar, setAdhar] = useState("");
  const postData = () => {
    if (adhar.length !== 12) {
      return M.toast({
        html: "Inavalid Adhar",
        classes: "#d32f2f red darken-2",
      });
    }
    fetch("/api/user/signin", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adhar,
      }),
    }).then((res) => {
      if (res) {
        setShowOpt(true);
      }
    });
  };

  const submitOpt = () => {
    if (otp.length !== 6) {
      return M.toast({
        html: "Inavalid OTP",
        classes: "#d32f2f red darken-2",
      });
    }
    fetch("/api/user/signin/verify", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adhar,
        otp,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.data));
          dispatch({ type: "USER", payload: data.data });
          M.toast({ html: "Signed In  ", classes: "#43a047 green darken-1" });
          history.push("/");
        }
        console.log(data, "daata");
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>iVote</h2>

        <input
          type="number"
          placeholder="Enter adhar number"
          value={adhar}
          onChange={(e) => setAdhar(e.target.value)}
          disabled={showOpt}
        />
        {showOpt && (
          <input
            type="text"
            placeholder="Enter adhar number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        {showOpt ? (
          <button
            className="btn waves-effect waves-light #1e88e5 blue darken-1"
            onClick={() => submitOpt()}
          >
            Login
          </button>
        ) : (
          <button
            className="btn waves-effect waves-light #1e88e5 blue darken-1"
            onClick={() => postData()}
          >
            Send OTP
          </button>
        )}
      </div>
    </div>
  );
}

export default NewSignIn;
