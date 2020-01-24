import React, {useState, useEffect} from 'react';
import AppBar from '../components/appBar';
import AccountSwitch from '../components/accountSwitch';

export default function Home() {
    const [name, setName] = useState("Karen");
    const [savingtotal, setSavingTotal] = useState(0);
    const [chequingTotal, setChequingTotal] = useState(0);
    const [savingsHistory, setSavingHistory] = useState(null);
    const [chequingHistory, setChequingHistory] = useState(null);

    useEffect(() => {
        console.log("Component mounted.");
        getUserData();
    });

    function getUserData() {
        console.log("getting data")
    }

    return(
        <div>
            <AppBar />
            <AccountSwitch />
        </div>      
    )
}


