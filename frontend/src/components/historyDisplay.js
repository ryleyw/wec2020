import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  table: {
      minWidth: 650,
      marginBottom: '100px'
  }
}));



export default function History(props) {
    const classes = useStyles();
    var rows = []
    if(props.history != null) {
        var position = props.history.length-1;
        for(var i = 0; i < props.history.length; i++) {
            position = props.history.length-1-i
            rows.push(
                createData(props.history[position].Date, props.history[position].Type, props.history[position].Amount, props.history[position].Title)  
            )     
        }
    }

    function createData(date, type, amount, title) {
        if(type=="Withdrawl") {
            type = "D"
        } else {
            type = "C"
        }
        return {date, type, amount, title};
    }
    return (
        <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">{row.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
}