import React, { useEffect } from "react";
import factory from "../ethereum/factory";
import { Button, Card } from "semantic-ui-react";
import Head from "next/head";

import Layout from "../components/Layout";
import { Link } from "../routes";

const campaignIndex = (props) => {
  let { campaigns } = props;
  // campaigns = [];

  // console.log(campaigns);
  // console.log(process.env.NEXT_SEPOLIA);

  const rederCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link to={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  };

  return (
    <>
    <Layout>
      <h3>Other Campaigns</h3>
      <div>
        <Link to="/campaigns/new">
          <a>
            <Button
              style={{ marginTop: "0.875em" }}
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
              />
          </a>
        </Link>
        {rederCampaigns()}
      </div>
    </Layout>
              </>
  );
};

export const getServerSideProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  // console.log(campaigns);

  return {
    props: {
      campaigns,
    },
  };
};

export default campaignIndex;
