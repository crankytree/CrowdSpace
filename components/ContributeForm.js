import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import {Router} from "../routes"

const ContributeForm = (props) => {
  const { address } = props;

  const [value, setValue] = useState("");
  const [isLoading , setIsLoading] = useState(false);
  const [errorMessage , setErrorMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const campaign = Campaign(address);
    setErrorMessage("");
    setIsLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei(value, "ether") });

      Router.replaceRoute(`/campaigns/${address}`);
    } catch (err) {
      // console.log(err);
      setErrorMessage(err.message);
    }
    setIsLoading(false);
  };
  return (
    <Form onSubmit={submitHandler} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage}/>
      <Button loading={isLoading} primary>Contribute!</Button>
    </Form>
  );
};

export default ContributeForm;
