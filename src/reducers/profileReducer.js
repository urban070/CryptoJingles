import {
  PROFILE_TABS, SET_ACTIVE_PROFILE_TAB, SET_PROFILE_SAMPLES, SET_PROFILE_NUM_SAMPLES_TO_BUY
} from '../constants/actionTypes';

const INITIAL_STATE = {
  tabs: PROFILE_TABS,
  mySamples: [],
  numSamplesToBuy: 1,
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  const  payload = action.payload;
  switch (action.type) {
    case SET_ACTIVE_PROFILE_TAB:
      return { ...state, tabs: payload, loading: true };

    case SET_PROFILE_SAMPLES:
      return { ...state, mySamples: payload, loading: false };

    case SET_PROFILE_NUM_SAMPLES_TO_BUY:
      return { ...state, numSamplesToBuy: payload };

    default:
      return state;
  }
};
