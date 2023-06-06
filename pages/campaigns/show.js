import React from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Button, Card, Grid } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import {Link} from "../../routes"

const show = (props) => {
  const { address, minimumContribution, balance, requestsCount, approversCount, manager } = props;

  const renderCards = () => {
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description: "The Manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description: "You must contribute atleast this much wei to become an approver",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description: "Number of people who have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description: "The balance is how much money this campaign has left to spend.",
      },
    ];

    return <Card.Group items={items} />;
  };
  return (
    <Layout>
      <h3>Campaign Details</h3>
      <Grid doubling columns={2}>
        <Grid.Column width={10}>
          {renderCards()}
          <br/>
          <Link to={`/campaigns/${address}/requests`}>
            <a>
              <Button primary>
                View Requests
              </Button>
            </a>
          </Link>
        </Grid.Column>
        <Grid.Column width={6}>
          <ContributeForm address={address} />
        </Grid.Column>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps = async (props) => {
  const campaign = Campaign(props.query.address);

  const summary = await campaign.methods.getSummary().call();

  return {
    props: {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    },
  };
};

export default show;
