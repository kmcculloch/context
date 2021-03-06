import React from 'react';
import { Link } from 'react-router';

const MetadataItem = ({ data }) => {
  const metadata = data;
  return (
    <div className="metadata item col-md-12">
      <Link className="yellow" to={`/content/${metadata.hash}`}>{metadata.hash}</Link>
    </div>
  );
};

MetadataItem.propTypes = {
  data: React.PropTypes.object.isRequired,
  // onSelect: React.PropTypes.func.isRequired,
};

MetadataItem.defaultProps = {
};

export default MetadataItem;
