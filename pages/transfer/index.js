import React, { useState } from "react";
import { ethers } from "ethers";
import useStore from "../../store/store";
import { useForm, Controller } from "react-hook-form";
import { Container, Typography, Grid, TextField, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import styles from "./transfer.module.css";

const Transfer = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [txs, setTxs] = useState([]);
  const { isConnected, wallet } = useStore();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      amount: null,
      recipient: null,
    },
  });

  const handleEthTransfer = async data => {
    try {
      if (!window.ethereum && !isConnected)
        throw new Error("No crypto wallet found. Please install it.");
      setLoading(true);
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(data.recipient);
      const tx = await signer.sendTransaction({
        to: data.recipient,
        value: ethers.utils.parseEther(data.amount),
      });

      setLoading(false);
      //   console.log("tx", tx);
      setMsg(`Transaction sent: ${tx.hash}`);
      setTxs([tx]);
    } catch (err) {
      console.log("in ecatahct error");
      setMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <Container
      sx={{
        mt: "50px",
        overflow: "hidden",
      }}
    >
      <Grid container justifyContent={"center"}>
        <Grid item sm={12} md={6}>
          <div className={styles.eth_form}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
              }}
              className="mb-30"
            >
              Send Eth Payment
            </Typography>
            {msg && (
              <div>
                <Alert severity="success" className="mb-10">
                  {msg}
                </Alert>
              </div>
            )}
            <form onSubmit={handleSubmit(handleEthTransfer)}>
              <div className="mb-20">
                <div className="mb-10">
                  <Controller
                    name="recipient"
                    control={control}
                    rules={{
                      required: "Address is Required",
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/,
                        message: "Enter valid address",
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        placeholder="Recipient Address"
                        fullWidth
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="amount"
                    control={control}
                    rules={{
                      required: "Amount is Required",
                      pattern: {
                        value: /^\d*\.?\d*$/,
                        message: "Enter valid amount",
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        fullWidth
                        placeholder="Amount in ETH"
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <LoadingButton
                  fullWidth
                  size="large"
                  loading={loading}
                  variant="contained"
                  type="submit"
                >
                  Pay Now
                </LoadingButton>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Transfer;
