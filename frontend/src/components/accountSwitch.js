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
    const [accountType, setAccountType] = useState(true);
    const [loading, setLoading] = useState(props.loading);

    function switchChequing() {
        setAccountType(true)
    }

    function switchSavings() {
        setAccountType(false)
    }

    return (
        <Grid alignItems="center" justify="center" >
            <Container justify='center' className={classes.root}>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                    <Button className={classes.switchButton} onClick={switchChequing}>Chequing</Button>
                    <Button className={classes.switchButton} onClick={switchSavings}>Savings</Button>
                </ButtonGroup>
            </Container>
            
            {accountType ? (
            <Container justify='center'>
                <Total amount={props.chequingTotal}/>
                <History history={props.chequingList}/>
            </Container>
            ) : (
            <Container justify='center'>
                <Total amount={props.savingsTotal}/>
                <History history={props.savingsList}/>
            </Container> 
            )}
        </Grid>

    );
}