import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Button, Form, Input, Message } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory"
import {Router} from "../../routes"

const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [errorMessage , setErrorMessage] = useState("");
  const [isLoading , setIsLoading] = useState(false);


  const submitHandler = async(e) => {
    e.preventDefault();

    setErrorMessage("");
    setIsLoading(true);
    try{

      const accounts = await web3.eth.getAccounts();
  
      await factory.methods.createCampaign(minimumContribution)
        .send({from: accounts[0]});

        Router.pushRoute("/");
    }catch(err){
      // console.log(err.message);
      setErrorMessage(err.message);
    }

    setIsLoading(false);

  }

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={submitHandler} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage}/>
        <Button loading={isLoading} type="submit" primary>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
