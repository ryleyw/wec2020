import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core'
import AppBar from '../components/appBar';
import Button from '@material-ui/core/Button';
import AccountSwitch from '../components/accountSwitch';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        prefix="$"
      />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
      position: 'fixed',
      bottom: '5px',
      right: '5px'
    },
    submitButton: {
        margin: theme.spacing(1),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
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
    const [open, setOpen] = React.useState(false);
    const [submitType, setSubmitType] = React.useState("D");
    const [submitAcct, setSubmitAcct] = React.useState("CHEQUING");
    const [submitAmount, setSubmitAmount] = React.useState("00.00");
    const [submitDescription, setSubmitDescription] = React.useState("")
    const [submitPing, setSubmitPing] = React.useState(true);

    useEffect(() => {
        console.log("Component mounted.");
        getUserData();
    }, [name, loading, submitPing]);

    function getUserData() {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json")
        var raw = JSON.stringify({"user": name});
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
                if(name != "bobby" && jsonData.savings != undefined) {
                    setSavingTotal(jsonData.savings.curr_total)
                } else {
                    setSavingTotal("This account is not eligible");
                }
                if(jsonData.chequing.curr_total != undefined) {
                    setChequingTotal(jsonData.chequing.curr_total)
                }
                if(jsonData.savings != undefined && name != "bobby") {
                    setSavingHistory(jsonData.savings.history)
                } else {
                    setSavingHistory(null);
                }
                if(jsonData.chequing.history != undefined) {
                    setChequingHistory(jsonData.chequing.history)
                }
                setLoading(false);
            });
        }).catch((error) => {
            console.log(error)
        }) 
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTypeChange = event => {
        setSubmitType(event.target.value);
    }

    const handleAcctChange = event => {
        setSubmitAcct(event.target.value);
    }

    const handleAmountChange = event => {
        setSubmitAmount(event.target.value);
    }

    const handleDescriptionChange = event => {
        setSubmitDescription(event.target.value);
    }

    function changeKaren() {
        setName("karen")
    }

    function changeBobby() {
        setName("bobby")
    }

    
    function submitTransaction() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
            "user": name,
            "account": submitAcct,
            "Date": today,
            "Type": submitType,
            "Amount": submitAmount,
            "Title": submitDescription
        })

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }

        fetch("http://localhost:5000/newtransaction", requestOptions)
        .then((response) => {
            response.text().then((data)=> {
                if(submitPing==true) {
                    setSubmitPing(false)
                } else {
                    setSubmitPing(true)
                }
            });
        }).catch((error) => {
            console.log(error)
        }) 
        handleClose();

    }
    const isKaren = (name=="karen")

    return(
        <div>
            <div>
                <AppBar name = {name} changeB={changeBobby} changeK={changeKaren}/>
                <div>
                    <AccountSwitch savingsTotal={savingsTotal} chequingTotal={chequingTotal} savingsList={savingsHistory} chequingList={chequingHistory} loading={loading}/>
                </div> 
            </div>   
            <div>
            <div></div>
            <Button
            onClick={handleOpen}
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<AddIcon />}
            >
                Add Transaction
            </Button>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                    <form>
                    <FormControl>
                        <TextField
                            label="Amount"
                            value={submitAmount}
                            onChange={handleAmountChange}
                            id="amount"
                            InputProps={{
                                inputComponent: NumberFormatCustom,
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="type">Type</InputLabel>
                        <Select
                            labelId="type"
                            id="type"
                            value={submitType}
                            onChange={handleTypeChange}
                            >
                            <MenuItem value="D">Withdrawal</MenuItem>
                            <MenuItem value="C">Deposit</MenuItem>
                            {isKaren ? (<MenuItem value="T">To Bobby</MenuItem>)
                            : (null)}

                        }  
                    }
                            
                    </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="account">Type</InputLabel>
                        <Select
                            labelId="account"
                            id="account"
                            value={submitAcct}
                            onChange={handleAcctChange}
                            >
                            <MenuItem value="CHEQUING">Chequing</MenuItem>
                            <MenuItem value="SAVINGS">Savings</MenuItem>
                    </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="description">Description</InputLabel>
                        <Input 
                        id="description"
                        value={submitDescription}
                        onChange={handleDescriptionChange}/>
                    </FormControl>
                    </form>
                    
                    <Button
                        onClick={submitTransaction}
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}
                        >
                            Submit
                    </Button>
                    </div>
                </Fade>
            </Modal>
      
            </div> 
        </div>
    )
}


