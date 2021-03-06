import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectPrimers } from '../selectors/primers';
import { loadPrimers } from '../actions/primers';

import List from '../components/List';
import PrimerItem from '../components/item/PrimerItem';
import Spinner from '../components/Spinner';

class Primers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };

    [].forEach((m) => { this[m] = this[m].bind(this); });
  }

  componentWillMount() {
    this.props.loadPrimers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.primers && this.state.loading) {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading } = this.state;
    const { primers } = this.props;

    if (loading) {
      return <Spinner />;
    }

    return (
      <div id="primers" className="page">
        <div className="container">
          <header className="row">
            <div className="col-md-12">
              <hr className="orange" />
              <h1 className="orange">Primers:</h1>
              <p>In order to make our archiving efforts as thorough and systematic as possible, we use Agency Archiving Primers to identify key programs, datasets, and documents that are vulnerable to change and loss. Primers are composed of <i>subprimers</i>, which each specify a url as a starting point for archiving.</p>
              <hr className="orange" />
            </div>
          </header>
          <div className="row">
            <br />
            <List data={primers} component={PrimerItem} />
          </div>
        </div>
      </div>
    );
  }
}

Primers.propTypes = {
  // user: PropTypes.object,
  primers: PropTypes.array,
  loadPrimers: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    primers: selectPrimers(state),
  };
}

export default connect(mapStateToProps, {
  loadPrimers,
})(Primers);
