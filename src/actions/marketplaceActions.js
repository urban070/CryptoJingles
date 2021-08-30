import axios from 'axios';
import { API_URL } from '../util/config';
import {
  SET_MARKETPLACE_CATEGORY, SET_MARKETPLACE_JINGLES, SET_MARKETPLACE_SORT, SET_MARKETPLACE_PAGE,
  MARKETPLACE_LIKE_UNLIKE_JINGLE,
} from '../constants/actionTypes';
import { likeUnlikeJingle } from './utils';

/**
 * Gets all jingles for category and sort option fromm the server and then sets it in the state
 *
 * @return {Function}
 */
export const getMarketplaceJingles = () => async (dispatch, getState) => {
  const { currentPage, category, sorting } = getState().marketplace;
  const { hasMM, lockedMM, address } = getState().app;
  let jingles = [];

  try {
    // TODO - export this to Api.js
    const response = await axios(`${API_URL}/jingles/${category.value}/${currentPage}/filter/${sorting.value}`);

    const jingleIds = response.data.map((_jingle) => _jingle.jingleId).toString();

    if ((hasMM && !lockedMM) && jingleIds.length > 0) {
      const likedJinglesResponse = await axios(`${API_URL}/jingles/check-liked/${address}/${jingleIds}`);
      jingles = response.data.map((_jingle, index) => ({
        ..._jingle, liked: likedJinglesResponse.data[index],
      }));
    }

    if ((!hasMM || lockedMM) && jingleIds.length > 0) {
      jingles = response.data.map((_jingle) => ({ ..._jingle, liked: false }));
    }

    if (jingleIds.length === 0) jingles = response.data;

    // false for all jingles, true to get jingles on sale
    const query = `${API_URL}/jingles/count/filter/${sorting.value}/sale/${(category.value === 'sale').toString()}`;
    const num = await axios(query);

    dispatch({ type: SET_MARKETPLACE_JINGLES, payload: { jingles, num: num.data } });
  } catch (err) {
    // console.error('Get marketplace jingles error:', err); // TODO Handle this in the future
  }
};

/**
 * Changes the current selected category for the marketplace
 * and then get all jingles for that category
 *
 * @param {Object} payload { value, label }
 *
 * @return {Function}
 */
export const changeMarketplaceCategory = (payload) => (dispatch) => {
  dispatch({ type: SET_MARKETPLACE_CATEGORY, payload });
  dispatch(getMarketplaceJingles());
};

/**
 * Changes the current selected sorting option for the marketplace
 * and then get all jingles for that sorting option
 *
 * @param {Object} payload { value, label }
 *
 * @return {Function}
 */
export const changeMarketplaceSorting = (payload) => (dispatch) => {
  dispatch({ type: SET_MARKETPLACE_SORT, payload });
  dispatch(getMarketplaceJingles());
};

/**
 * Changes the current selected page and then get all jingles for that page
 *
 * @param {Number} pageNum
 *
 * @return {Function}
 */
export const onMarketplacePaginationChange = (pageNum) => (dispatch) => {
  dispatch({ type: SET_MARKETPLACE_PAGE, payload: pageNum + 1 });
  dispatch(getMarketplaceJingles());
};

/**
 * Updates jingle like count based on jingleId.
 *
 * @param {Number} jingleId
 * @param {Boolean} action - true = like, false = dislike
 *
 * @return {Function}
 */
export const likeUnLikeMarketplaceJingle = (jingleId, action) => async (dispatch, getState) => {
  const state = getState();
  const { address } = state.app;

  try {
    const likeData = await likeUnlikeJingle(jingleId, action, address);
    if (!likeData) return;

    const jingles = [...state.marketplace.jingles];
    const jingleIndex = jingles.findIndex((_jingle) => _jingle.jingleId === jingleId);

    jingles[jingleIndex] = { ...jingles[jingleIndex], ...likeData };
    dispatch({ type: MARKETPLACE_LIKE_UNLIKE_JINGLE, payload: jingles });
  } catch (err) {
    // TODO Handle this in the future
  }
};
