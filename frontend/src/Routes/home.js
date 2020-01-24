import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core'
import AppBar from '../components/appBar';
import Button from '@material-ui/core/Button';
import AccountSwitch from '../components/accountSwitch';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
      position: 'fixed',
      bottom: '5px',
      right: '5px'
    },
}));

export default function Home() {
    
    const classes = useStyles();

    const [name, setName] = useState("karen");
    const [savingsTotal, setSavingTotal] = useState(0);
    const [chequingTotal, setChequingTotal] = useState(0);
    const [savingsHistory, setSavingHistory] = useState(null);
    const [chequingHistory, setChequingHistory] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log("Component mounted.");
        getUserData();
    }, [name, loading]);

    function getUserData() {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json")
        var raw = JSON.stringify({"user": "karen"});
        var requestOptions = {  
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }

        fetch("http://localhost:5000/getuserjson", requestOptions)
        .then((response) => {
            response.text().then((data)=> {
                console.log(data)
                var jsonData = JSON.parse(data);
                setSavingTotal(jsonData.savings.curr_total)
                setChequingTotal(jsonData.chequing.curr_total)
                setSavingHistory(jsonData.savings.history)
                setChequingHistory(jsonData.chequing.history)
                setLoading(false);
            });
        }).catch((error) => {
            console.log(error)
        }) 
    }

    return(
        <div>
            <div>
                <AppBar name = {name}/>
                <div>
                    <AccountSwitch savingsTotal={savingsTotal} chequingTotal={chequingTotal} savingsList={savingsHistory} chequingList={chequingHistory} loading={loading}/>
                </div> 
            </div>   
            <div>
            <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<AddIcon />}
            >
                Add Transaction
            </Button>
      
            </div> 
        </div>
    )
}


