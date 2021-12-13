import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  Avatar,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableContainer: {
    borderRadius: 15,
    margin: "10px 10px",
    maxWidth: 950,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
  },
  avatar: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
  },
  name: {
    fontWeight: "bold",
  },
  status: {
    fontWeight: "bold",
    fontSize: "0.75rem",
    color: "white",
    backgroundColor: "gray",
    borderRadius: 8,
    padding: "3px 10px",
    display: "inline-block",
  },
}));
const ParticipantsList = (props) => {
  const history = useHistory();

  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const classes = useStyles();
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch(`/voters/${id}`, {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("jwt"),
      //   },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result);
      });
  }, []);

  const voteSubmit = (postId) => {
    fetch("/api/user/addVote", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voteId: postId,
        userId: JSON.parse(localStorage.getItem("user"))._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: "UPDATE", payload: { VotedList: result.VotedList } });
        localStorage.setItem("user", JSON.stringify(result));
        history.push("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaderCell}>Name</TableCell>
            <TableCell className={classes.tableHeaderCell}>Party</TableCell>
            <TableCell className={classes.tableHeaderCell}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.participants &&
            data.participants.map((row) => (
              <TableRow
                key={row._id}
                //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                // onClick={() => alert(row._id)}
              >
                <TableCell>
                  <Grid container style={{ alignItems: "center" }}>
                    <Grid item lg={2}>
                      <Avatar
                        alt={row.username}
                        src="."
                        className={classes.avatar}
                      />
                    </Grid>
                    <Grid
                      item
                      lg={10}
                      className={classes.name}
                      style={{ paddingLeft: "10px" }}
                    >
                      <Typography color="primary" variant="subtitle2">
                        {row.username}
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Typography>{row.partyname}</Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#8bc34a", color: "white" }}
                    onClick={() => voteSubmit(id)}
                  >
                    Vote
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ParticipantsList;
