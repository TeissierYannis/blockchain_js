import React, {useState} from "react";
import axios from "axios";
import Blocks from "./Blocks";

const App = () => {

    const [walletInfo, setWalletInfo] = useState({
        address: "",
        balance: 0,
    });

    const getWalletInfo = () => {
        axios.get("http://localhost:3000/api/wallet-info").then((response) => {
            const {address, balance} = response.data;
            setWalletInfo({address, balance});
        });
    }

    // request onload
    React.useEffect(() => {
        if (walletInfo.address === "") {
            getWalletInfo();
        }
    });

    return (
        <div>
            <h1>Wallet Info</h1>
            <div className="walletInfoContainer">
                <p className="walletAddress">
                    {walletInfo.address}
                </p>
                <p className="walletBalance">Balance: {walletInfo.balance}</p>
            </div>
            <Blocks />
        </div>
    );
}

export default App;