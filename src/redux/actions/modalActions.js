import { TOGGLE_MODAL } from 'redux/actionTypes/modalActionTypes';
import {
  WALLET_MODAL,
} from '../../components/Modals/modalTypes';

/**
 * Dispatches action to toggle modal.
 *
 * @param {String} modalType
 * @param {Object} modalProps
 * @param {Boolean} action - to close or to open
 */
export const toggleModal = (modalType, modalProps, action) => (dispatch) => {
  dispatch({
    type: TOGGLE_MODAL,
    payload: { modalType, modalProps, action },
  });
};

/**
 * Closes the modal that is currently open
 */
export const closeModal = () => (dispatch) => {
  dispatch({
    type: TOGGLE_MODAL,
    payload: { modalType: '', modalProps: {}, action: false },
  });
};

export const openWalletModal = (resolveOnUnlock) => (dispatch) => {
  let resolve;
  let reject;

  const modalPromise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const modalProps = { width: 530 };

  if (resolveOnUnlock) {
    modalProps.resolve = resolve;
    modalProps.reject = reject;
  }

  dispatch(toggleModal(WALLET_MODAL, modalProps, true));

  if (resolveOnUnlock) return modalPromise;
};
