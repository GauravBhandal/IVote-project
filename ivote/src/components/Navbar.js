import React, { useContext, useRef, useEffect, useState } from "react";
import "../App.css";
import { UserContext } from "../App";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
function Navbar() {
  const searchmodal = useRef(null);
  const [search, setSearch] = useState("");
  const [userdetails, setUserdetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  // componentDidMount() = () => {
  //   const M = window.M;
  //   document.addEventListener('DOMContentLoaded', function () {
  //   var elems = document.querySelectorAll('.sidenav');
  //   var instances = M.Sidenav.init(elems, {});
  //   });
  //   }
  useEffect(() => {
    M.AutoInit();
  }, []);
  useEffect(() => {
    M.Modal.init(searchmodal.current);
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="5">
          <button
            className="btn waves-effect waves-light #d32f2f red darken-2"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            LogOut
          </button>{" "}
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Login</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Register</Link>
        </li>,
      ];
    }
  };
  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserdetails(result.user);
      });
  };
  return (
    <div>
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/signin"} className="brand-logo left">
            iVote
          </Link>
          <a
            href=""
            data-target="mobile-demo"
            className="right sidenav-trigger"
          >
            <i class="material-icons">menu</i>
          </a>
          <ul id="nav-mobile" className="right hide-on-small-and-down">
            {renderList()}
          </ul>
        </div>
        <div
          id="modal1"
          className="modal"
          ref={searchmodal}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="search User"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul className="collection">
              {userdetails.map((item) => {
                return (
                  <Link
                    to={
                      item._id !== state._id
                        ? "/profile/" + item._id
                        : "/profile"
                    }
                    onClick={() => {
                      M.Modal.getInstance(searchmodal.current).close();
                      setSearch("");
                    }}
                  >
                    {" "}
                    <li className="collection-item">{item.email}</li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => {
                setSearch("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        {renderList()}
      </ul>
    </div>
  );
}

export default Navbar;
