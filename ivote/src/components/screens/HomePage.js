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
} from "@material-ui/core";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

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
function HomePage() {
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem("user")));
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/voters/", {
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
  console.log(users, "users");
  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaderCell}>Name</TableCell>
            <TableCell className={classes.tableHeaderCell}>
              Description
            </TableCell>
            <TableCell className={classes.tableHeaderCell}>Date</TableCell>
            <TableCell className={classes.tableHeaderCell}>
              Participants
            </TableCell>
            <TableCell className={classes.tableHeaderCell}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row._id}
              //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() =>
                users?.VotedList?.find((val) => val === row._id)
                  ? M.toast({
                      html: "Already Voted!",
                      classes: "#d32f2f red darken-2",
                    })
                  : history.push(`/voters/${row._id}`)
              }
            >
              <TableCell>
                <Grid container style={{ alignItems: "center" }}>
                  <Grid item lg={2}>
                    <Avatar alt={row.name} src="." className={classes.avatar} />
                  </Grid>
                  <Grid
                    item
                    lg={10}
                    className={classes.name}
                    style={{ paddingLeft: "10px" }}
                  >
                    <Typography color="primary" variant="subtitle2">
                      {row.name}
                    </Typography>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell>
                <Typography>{row.details}</Typography>
              </TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.participants.length}</TableCell>
              <TableCell>
                {users?.VotedList?.find((val) => val === row._id) ? (
                  <Typography
                    className={classes.status}
                    style={{ backgroundColor: "green" }}
                  >
                    Already Voted
                  </Typography>
                ) : (
                  <Typography
                    className={classes.status}
                    style={{ backgroundColor: "orange" }}
                  >
                    Pending
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default HomePage;
