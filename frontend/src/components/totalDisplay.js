import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    alignContent: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
    border: 'solid black',
    borderWidth: '1px',
    borderRadius: '5px',
    fontSize: '64pt',
    
  },
  paperStyle:{
      width: '50%'
  }
}));

export default function Total(props) {
  const classes = useStyles();
  const [total, setTotal] = useState(props.amount); 

  return (
      <div>

      
        <div>Account Total</div>
        <div className={classes.root}>
        {props.amount}
        </div>
    </div>
  );
}
