import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
}));

export default function History(props) {
    const classes = useStyles();
    const [history, setHistory] = useState("temp")
    
    return (
        <div className={classes.root}>
            {history}
        </div>
  );
}