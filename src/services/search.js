import {trim, isUndefined} from "lodash";
import {Client} from "./api";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";

export async function doSearch(criteria, type = null) {

  criteria = trim(criteria);

  if (criteria === "") {
    return null;
  }

  let searches = {
    searchBlockNumber,
    searchBlockHash,
    searchTxHash,
    searchToken,
    searchAddress
  };

  for (let [searchName, search] of Object.entries(searches)) {

    try {

      if (type === null || type === searchName) {
        let result = await search(criteria);
        if (!isUndefined(result)) {
          return result;
        }
      }

    } catch (e) {
    }
  }

  return null;
}


async function searchBlockNumber(criteria) {
  try {
    let {blocks} = await Client.getBlocks({
      number: criteria,
      limit: 1,
    });

    if (blocks.length === 1) {
      return `#/block/${blocks[0].number}`;
    }
  }
  catch (error) {
    console.log(error.response);
  }
}

async function searchTxHash(criteria) {
  let {transactions} = await Client.getTransactions({
    hash: criteria,
    limit: 1,
  });

  if (transactions.length === 1) {
    return `#/transaction/${transactions[0].hash}`;
  }
}

async function searchBlockHash(criteria) {

  let {blocks: blocksHash} = await Client.getBlocks({
    hash: criteria,
    limit: 1,
  });

  if (blocksHash.length === 1) {
    return `#/block/${blocksHash[0].number}`;
  }
}

async function searchAddress(criteria) {

  let {accounts} = await Client.getAccounts({
    address: criteria,
    limit: 1,
  });

  if (accounts.length === 1) {
    return `#/address/${accounts[0].address}`;
  }
}

async function searchToken(criteria) {

  let {tokens} = await Client.getTokens({
    name: `%${criteria}%`,
    limit: 1,
  });

  if (tokens.length === 1) {
    return `#/token/${tokens[0].name}`;
  }

}

export function getSearchType(search) {

  if (isAddressValid(search))
    return 'searchAddress';

  if (!isNaN(Number(search)))
    return 'searchBlockNumber';

  if (search.length === 64)
    return 'searchTxHash';

  return 'searchToken';
}
