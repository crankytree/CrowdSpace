import React, { useState } from "react";
import { Button, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import {Router} from "../routes"

const RequestRow = (props) => {
  const { id, request, approversCount, address } = props;

  const { Row, Cell } = Table;

  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingFinalize, setIsLoadingFinalize] = useState(false);
  const [errorMessage , setErrorMessage] = useState("");

  const readyToFinalize = request.approvalCount > (approversCount / 2);

  const approveHandler = async () => {
    const campaign = Campaign(address);

    setIsLoadingApprove(true);
    try{
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
  
      Router.replaceRoute(`/campaigns/${address}/requests`);

    }catch(err){
      console.log(err.message);
      setErrorMessage(err.message);
    }
    setIsLoadingApprove(false);
  };

  const finalizeHandler = async () => {
    const campaign = Campaign(address);

    setIsLoadingFinalize(true);
    try{
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${address}/requests`);

    }catch(err){
      console.log(err.message);
      setErrorMessage(err.message);
    }
    setIsLoadingFinalize(false);
  };
  return (
    <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
      <Cell>{id} </Cell>
      <Cell>{request.description} </Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")} </Cell>
      <Cell>{request.recipitent} </Cell>
      <Cell>
        {request.approvalCount}/{approversCount}{" "}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button loading={isLoadingApprove} color="green" basic onClick={approveHandler}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button loading={isLoadingFinalize} color="teal" basic onClick={finalizeHandler}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
