import React from "react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

const requestIndex = (props) => {
  let { address, requestsAsBytes, approversCount , requestCount  } = props;
  const { Header, Row, HeaderCell, Body } = Table;

  const requests = JSON.parse(requestsAsBytes);

  const renderRows = () => {
    return requests.map((req, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={req}
          address={address}
          approversCount={approversCount}
        />
      );
    });
  };

  return (
    <Layout>
      <h3>Requests</h3>
      <Link to={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{marginBottom: "10px"}}>Add Request</Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </Layout>
  );
};

export const getServerSideProps = async (props) => {
  const { address } = props.query;

  const campaign = Campaign(address);

  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  // console.log(requests);

  return {
    props: {
      address,
      requestsAsBytes: JSON.stringify(requests),
      approversCount,
      requestCount,
    },
  };
};

export default requestIndex;
