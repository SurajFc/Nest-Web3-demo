import { useState, useEffect } from "react";
import { ethers } from "ethers";
import useStore from "../store/store";
import { Button, Grid } from "@mui/material";
import { getEthNetWork } from "../utils/metamask";

export default function Home() {
  const contractAddress = "";

  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState(0);

  const [ethError, setEthError] = useState("");

  const { isConnected, setConnect, wallet, setwalletData } = useStore();

  useEffect(() => {
    if (!isConnected) {
      connectWalletHandler();
    }
    ChangeEventHandler();
  }, []);

  const getEthProvider = () => {
    if (window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum);
    } else {
      setEthError("Need to install MetaMask!");
      return false;
    }
  };

  const ChangeEventHandler = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accounts => {
        setConnect(false);
      });

      window.ethereum.on("chainChanged", chainId => {
        console.log("Reloading", chainId);
        connectWalletHandler();
      });

      window.ethereum.on("disconnect", diconnect => {
        console.log("Disconnected", diconnect);
        setConnect(false);
      });
    }
  };

  const connectWalletHandler = () => {
    let provider = getEthProvider();
    if (provider) {
      provider
        .send("eth_requestAccounts", [])
        .then(res => {
          setwalletData({ address: res[0] });
          setConnect(true);
        })
        .catch(err => {
          console.log("err", err);
          setEthError("Error connecting to wallet");
          setConnect(false);
        });

      provider.getNetwork().then(res => {
        setwalletData({ chainId: res.chainId });
      });

      provider.getBalance(wallet.address).then(balance => {
        setwalletData({ balance: ethers.utils.formatEther(balance) });
      });

      // TODO: will be used later
      // const signer = provider.getSigner();
      // console.log("signer", signer);
    }
  };

  const handleDisconnect = () => {
    setConnect(false);
    setwalletData({ address: "", balance: 0, chainId: "" });
  };

  return (
    <Grid
      container
      sx={{ paddingTop: "5%" }}
      direction="column"
      alignItems="center"
    >
      {!isConnected ? (
        <>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={connectWalletHandler}
            >
              Connect Wallet
            </Button>
            {ethError && <p>{ethError}</p>}
          </Grid>
        </>
      ) : (
        <>
          <p>Wallet Connected</p>
          <Grid>
            <p>Network: {getEthNetWork(wallet?.chainId)}</p>
          </Grid>
          <Grid>
            <p>Address: {wallet?.address}</p>
          </Grid>
          <Grid>
            <p>Your balance: {wallet?.balance} eth</p>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
}
