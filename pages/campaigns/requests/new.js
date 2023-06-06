import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import {Link , Router} from "../../../routes"

const RequestNew = (props) => {
  const { address } = props;

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
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
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/campaigns/${address}/requests`)
      
    } catch (err) {
      setErrorMessage(err.message);
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <h3>Create a Request</h3>
      <Form onSubmit={submitHandler} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage}/>
        <Button primary loading={isLoading}>Create!</Button>
        <Link to={`/campaigns/${address}/requests`}>
          <Button>Cancel</Button>
        </Link>
      </Form>
    </Layout>
  );
};

export const getServerSideProps = (props) => {
  const { address } = props.query;
  return {
    props: {
      address,
    },
  };
};

export default RequestNew;
