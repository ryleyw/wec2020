import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import Total from '../components/totalDisplay';
import History from '../components/historyDisplay';
import Grid from '@material-ui/core/Grid'
import { Container } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  switchButton: {
    width: '150px'
  },
}));

export default function AccountSwitch(props) {
    const classes = useStyles();
    const [accountType, setAccountType] = useState(0);

    return (
        <Grid alignItems="center" justify="center" >
       
            <Container justify='center' className={classes.root}>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button className={classes.switchButton}>Chequing</Button>
                <Button className={classes.switchButton}>Savings</Button>
                </ButtonGroup>
            </Container>
            <Container justify='center'>
                <Total />
                <History />
            </Container>
        </Grid>

    );
}