import React, {useState, useEffect} from 'react';
import AppBar from '../components/appBar';
import AccountSwitch from '../components/accountSwitch';

export default function Home() {
    const [name, setName] = useState("karen");
    const [savingsTotal, setSavingTotal] = useState(0);
    const [chequingTotal, setChequingTotal] = useState(0);
    const [savingsHistory, setSavingHistory] = useState(null);
    const [chequingHistory, setChequingHistory] = useState(null);
    const [initial, setInitial] = useState(true);

    useEffect(() => {
        console.log("Component mounted.");
        if({initial}) {
            getUserData();
        }
        setInitial(false);
    }, [name]);

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
            });
        }).catch((error) => {
            console.log(error)
        }) 
    }

    return(
        <div>
            <AppBar name = {name}/>
            <AccountSwitch savingsTotal={savingsTotal} chequingTotal={chequingTotal} savingsList={savingsHistory} chequingList={chequingHistory}/>
        </div>      
    )
}


