import { Router } from 'express';
import { request, gql } from 'graphql-request';
import dotenv from 'dotenv';
require('dotenv').config(); 

const router = Router();
const GRAPHQL_ENDPOINT = 'https://graphql.bitquery.io';
const API_KEY = process.env.REACT_APP_API_KEY

dotenv.config();
const headers = {
    'X-API-KEY': API_KEY || 'STRING_TYPE_CAST', // Your API key
    'Content-Type': 'application/json'
};

// Define the GraphQL queries
const minerDataQuery = gql`
  query ($network: BitcoinNetwork!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    bitcoin(network: $network) {
      outputs(
        options: {desc: "reward", asc: "address.address", limit: $limit, offset: $offset}
        time: {since: $from, till: $till}
        txIndex: {is: 0}
        outputDirection: {is: mining}
        outputScriptType: {notIn: ["nulldata", "nonstandard"]}
      ) {
        address: outputAddress {
          address
          annotation
        }
        reward: value
        reward_usd: value(in: USD)
        count(uniq: blocks)
        min_date: minimum(of: date)
        max_date: maximum(of: date)
      }
    }
  }
`;

const addressStatsQuery = gql`
  query ($network: BitcoinNetwork!, $address: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    bitcoin(network: $network) {
      inputs(date: {since: $from, till: $till}, inputAddress: {is: $address}) {
        count
        value
        value_usd: value(in: USD)
        min_date: minimum(of: date)
        max_date: maximum(of: date)
      }
      outputs(date: {since: $from, till: $till}, outputAddress: {is: $address}) {
        count
        value
        value_usd: value(in: USD)
        min_date: minimum(of: date)
        max_date: maximum(of: date)
      }
    }
  }
`;

router.post('/miner-data', async (req, res) => {
    console.log("get miner  data");
    const { network, limit, offset, from, till } = req.body;
    try {
      const data = await request(GRAPHQL_ENDPOINT, minerDataQuery, { network, limit, offset, from, till }, headers);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching miner data', error });
    }
  });

  router.post('/address-stats', async (req, res) => {
    console.log("get address  data");
    const { network, address, from, till } = req.body;
    try {
      const data = await request(GRAPHQL_ENDPOINT, addressStatsQuery, { network, address, from, till }, headers);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching address statistics', error });
    }
  });

export default router;
