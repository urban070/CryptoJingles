import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Sound, Group } from 'pizzicato';
import JingleImage from '../JingleImage/JingleImage';
import Heart from '../Decorative/Heart';
import { addPendingTx, guid, removePendingTx } from '../../actions/appActions';
// import { getColorForRarity } from '../../actions/profileActions';
import { API_URL } from '../../util/config';
import { getJingleMetadata } from '../../constants/getMockData';
import LoadingIcon from '../Decorative/LoadingIcon';
import { playWithDelay } from '../../util/soundHelper';
import { formatSalePrice, formatToWei, likeUnlikeJingle } from '../../actions/utils';

import './JinglePage.scss';

class JinglePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jingle: null,
      validJingle: true,
      loading: false,
      isOwner: false,
      start: false,
      sound: null,
      salePrice: undefined,
    };

    this.loadPage = this.loadPage.bind(this);
    this.stopSound = this.stopSound.bind(this);
    this.playSound = this.playSound.bind(this);
    this.loadJingle = this.loadJingle.bind(this);
    this.jingleLikeUnlike = this.jingleLikeUnlike.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.loadPage(this.props.match.params.id);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.match.params.id === this.props.match.params.id) return;

    this.loadPage(newProps.match.params.id);
  }

  componentWillUnmount() { this.stopSound(); }

  // eslint-disable-next-line no-async-promise-executor
  getJingle = (jingleId) => new Promise(async (resolve) => {
    const { address, lockedMM, hasMM } = this.props;

    let jingleData = await axios(`${API_URL}/jingle/${jingleId}`);
    jingleData = jingleData.data;

    if (!jingleData) {
      resolve(false);
      return;
    }

    if (!hasMM || lockedMM) jingleData.liked = false;
    else {
      const likedJinglesResponse = await axios(`${API_URL}/jingle/check-liked/${address}/${jingleId}`);
      jingleData.liked = likedJinglesResponse.data;
    }

    resolve(jingleData);
  });

  loadPage = async (id) => {
    const { address } = this.props;

    const jingle = await this.getJingle(id);

    if (typeof jingle !== 'object') {
      this.setState({ validJingle: false });
      return;
    }

    const isOwner = jingle.owner === address;

    this.setState({
      jingle,
      isOwner,
      validJingle: true,
    });
  };

  purchase = async () => {
    let { jingle } = this.state;
    const account = this.props.address;

    const id = guid();
    this.props.addPendingTx(id, 'Buy Jingle');
    await window.marketplaceContract.buy(jingle.jingleId, { from: account, value: jingle.price });
    this.props.removePendingTx(id);

    jingle = await this.getJingle(jingle.jingleId);

    const isOwner = jingle.owner === account;

    this.setState({ jingle, isOwner });
  };

  sell = async () => {
    const amount = this.state.salePrice;
    if (amount && (amount <= 0)) return;

    let { jingle } = this.state;

    const id = guid();
    this.props.addPendingTx(id, 'Sell Jingle');
    await window.jingleContract.approveAndSell(jingle.jingleId, amount, { from: this.props.address });
    this.props.removePendingTx(id);

    jingle = await this.getJingle(jingle.jingleId);
    this.setState({ jingle });
  };

  cancelSale = async () => {
    let { jingle } = this.state;

    const id = guid();
    this.props.addPendingTx(id, 'Cancel Sale');
    await window.marketplaceContract.cancel(jingle.jingleId, { from: this.props.address });
    this.props.removePendingTx(id);

    jingle = await this.getJingle(jingle.jingle);
    this.setState({ jingle });
  };

  handleSalePriceChange = (e) => {
    this.setState({ salePrice: formatToWei(e.target.value) });
  };

  loadJingle = () => {
    const jingleSrcs = this.state.jingle.sampleTypes.map((sampleType, i) => new Promise((resolve) => {
      const sound = new Sound(getJingleMetadata(sampleType).source, () => {
        resolve(sound);
        sound.volume = parseInt(this.state.jingle.settings[i], 10) / 100;
      });
    }));

    this.setState({ loading: true });

    Promise.all(jingleSrcs).then((sources) => {
      // const longestSound = sources.reduce((prev, current, i) => (
      //   (prev.getRawSourceNode().buffer.duration + delays[i]) > (current.getRawSourceNode().buffer.duration) + delays[i]) ? prev : current);

      // longestSound.on('stop', () => { this.setState({ start: false }); });

      this.setState({
        sound: new Group(sources),
        loading: false,
      });

      this.playSound();
    });
  };

  playSound = () => {
    if (this.state.sound === null) {
      this.loadJingle();
      return;
    }

    const sound = playWithDelay(this.state.sound, this.state.jingle.settings);

    sound.on('stop', () => { this.setState({ start: false }); });

    this.setState({ start: true });
  };

  stopSound = () => {
    if (!this.state.sound) return;
    this.state.sound.stop();
    this.setState({ start: false });
  };

  jingleLikeUnlike = async (jingleId, action) => {
    const likeData = await likeUnlikeJingle(jingleId, action, this.props.address);
    // eslint-disable-next-line react/no-access-state-in-setstate
    if (likeData) this.setState({ jingle: { ...this.state.jingle, ...likeData } });
  };

  render() {
    const { jingle, isOwner, validJingle } = this.state;
    const { hasMM, lockedMM, canLike } = this.props;
    return (
      <div className="container single-jingle-wrapper">
        {
          validJingle && (
            <div>
              <div className="row">
                <div className="col-md-2" />
                <div className="col-md-8 row-wrapper-jingle">
                  {
                    jingle && (
                      <div>
                        <div className="jingle-id">#{ jingle.jingleId }</div>
                        <div className="jingle-details-wrapper">
                          <div className="buy-options">
                            <div className="jingle-page-img">
                              <div className="overlay">
                                { this.state.loading && <LoadingIcon /> }
                                {
                                  !this.state.start && !this.state.loading && (
                                    <span onClick={this.playSound}>
                                      <i className="material-icons play">play_circle_outline</i>
                                    </span>
                                  )
                                }
                                {
                                  this.state.start && !this.state.loading &&
                                  <span onClick={this.stopSound}><i className="material-icons stop">cancel</i></span>
                                }
                              </div>

                              <JingleImage id={jingle.jingleId} width={250} height={250} />
                            </div>

                            <div className="liked-section">
                              <span onClick={() => { this.jingleLikeUnlike(jingle.jingleId, !jingle.liked); }}>
                                <Heart active={jingle.liked} size="40" canLike={hasMM && !lockedMM && canLike} />
                              </span>

                              { jingle.likeCount }
                            </div>

                            {
                              jingle.onSale && (
                                <div className="sell-price-wrapper">
                                  <h3>
                                    <span>Sell price:</span>
                                    <span className="price">{ formatSalePrice(jingle.price) }Ξ</span>
                                  </h3>
                                  {
                                    !isOwner && (hasMM && !lockedMM) && (
                                      <button type="submit" className="btn buy-button" onClick={this.purchase}>
                                        Purchase
                                      </button>
                                    )
                                  }
                                </div>
                              )
                            }

                            {
                              !jingle.onSale && isOwner && (hasMM && !lockedMM) && (
                                <form className="sell-form" onSubmit={(e) => e.preventDefault()}>
                                  <input
                                    className="form-control"
                                    placeholder="Sell price in ETH"
                                    type="number"
                                    step="any"
                                    onChange={this.handleSalePriceChange}
                                  />
                                  <button type="submit" className="btn buy-button" onClick={this.sell}>
                                    Put on sale
                                  </button>
                                </form>
                              )
                            }
                            {
                              jingle.onSale && (hasMM && !lockedMM) && isOwner && (<button type="button" className="btn buy-button" onClick={this.cancelSale}>Cancel Sale</button>)
                            }
                          </div>

                          <div className="jingle-details">
                            <div className="jingle-label owner">
                              <h4>Owner</h4>
                              <div>
                                <Link to={`/profile/${jingle.owner}`}>{jingle.owner}</Link>
                              </div>
                            </div>
                            <div className="jingle-label">
                              <h4>Author</h4>
                              <div>{ jingle.author }</div>
                            </div>
                            <div className="jingle-label">
                              <h4>Name</h4>
                              <div>{ jingle.name }</div>
                            </div>

                            <div className="jingle-samples-wrapper">
                              <h4>Samples</h4>
                              <div className="samples">
                                {
                                  jingle.sampleTypes.map((type) => {
                                    const sample = getJingleMetadata(type);
                                    // const background = getColorForRarity(sample.rarity);

                                    return (
                                      <span key={type} className="sample">
                                        { sample.name }
                                      </span>
                                    );
                                  })
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </div>
                <div className="col-md-2" />
              </div>
            </div>
          )
        }

        {
          !validJingle && (
            <div className="not-valid-message">
              The jingle you are searching for does not yet exist.
            </div>
          )
        }
      </div>
    );
  }
}

JinglePage.propTypes = {
  match: PropTypes.object.isRequired,
  hasMM: PropTypes.bool.isRequired,
  lockedMM: PropTypes.bool.isRequired,
  canLike: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired,
  addPendingTx: PropTypes.func.isRequired,
  removePendingTx: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  hasMM: state.app.hasMM,
  lockedMM: state.app.lockedMM,
  canLike: state.app.canLike,
  address: state.app.address,
});

export default connect(mapStateToProps, { addPendingTx, removePendingTx })(JinglePage);
