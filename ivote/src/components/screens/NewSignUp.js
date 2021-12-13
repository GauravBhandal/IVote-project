import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

function NewSignUp() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [adhar, setAdhar] = useState("");
  const [email, setEmail] = useState("");

  const uploadField = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return M.toast({
        html: "Inavalid Email",
        classes: "#d32f2f red darken-2",
      });
    }
    if (number.length != 10) {
      return M.toast({
        html: "Inavalid Phone Number",
        classes: "#d32f2f red darken-2",
      });
    }
    if (adhar.length != 12) {
      return M.toast({
        html: "Inavalid Adhar Number",
        classes: "#d32f2f red darken-2",
      });
    }
    fetch("/api/user/signup", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        number,
        email,
        adhar,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
        } else {
          M.toast({ html: data.message, classes: "#43a047 green darken-1" });
          history.push("/signin");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>iVote</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <input
          type="number"
          placeholder="Adhar"
          value={adhar}
          onChange={(e) => setAdhar(e.target.value)}
        />

        <button
          className="btn waves-effect waves-light #1e88e5 blue darken-1"
          onClick={() => uploadField()}
        >
          Add Data
        </button>
        <h5>
          <Link to="/signin"> Already registered ? </Link>
        </h5>
      </div>
    </div>
  );
}

export default NewSignUp;
