import Web3 from 'web3';
import contract from 'truffle-contract';
import axios from 'axios';
import { CryptoJinglesAddress, JingleAddress, MarketplaceAddress, SampleAddress, API_URL } from '../config';
import CryptoJingles from '../../../server/abis/CryptoJingle.json';
import Jingle from '../../../server/abis/Jingle.json';
import Sample from '../../../server/abis/Sample.json';
import Marketplace from '../../../server/abis/Marketplace.json';
import { initAppWithMM, initAppWithoutMM, initAppWithLockedMM } from '../../../src/actions/appActions';

/**
 * Checks if the user has MetaMask. If it does, binds
 * web3, contracts to window object. Dispatches actions accordingly
 *
 * @param {Function} dispatch
 * @return {Promise.<void>}
 */
// TODO - put all of this data into a web 3 reducer
const getWeb3 = async (dispatch) => {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider); // eslint-disable-line

    // TODO - check if dev or prod here
    // const netId = await window.web3.eth.net.getId();
    // if (netId !== '1') alert('Wrong network, please switch to the mainnet!');

    // Init jingles contract
    const cryptoJinglesContract = contract(CryptoJingles);
    cryptoJinglesContract.setProvider(window.web3.currentProvider);
    window.contract = cryptoJinglesContract.at(CryptoJinglesAddress);

    // Init jingle contract
    const jingleContract = contract(Jingle);
    jingleContract.setProvider(window.web3.currentProvider);
    window.jingleContract = jingleContract.at(JingleAddress);

    // Init marketplace contract
    const marketplaceContract = contract(Marketplace);
    marketplaceContract.setProvider(window.web3.currentProvider);
    window.marketplaceContract = marketplaceContract.at(MarketplaceAddress);

    // Init samples contract
    const samplesContract = contract(Sample);
    samplesContract.setProvider(window.web3.currentProvider);
    window.samplesContract = samplesContract.at(SampleAddress);

    const addresses = await window.web3.eth.getAccounts();
    const address = addresses[0];

    if (address) {
      const canLikeResponse = await axios(`${API_URL}/jingle/can-like/${address.toLowerCase()}`);
      const { canLike } = canLikeResponse.data;
      dispatch(initAppWithMM(address.toLowerCase(), canLike));
    } else dispatch(initAppWithLockedMM());
  } else {
    dispatch(initAppWithoutMM());
  }
};

export default getWeb3;
