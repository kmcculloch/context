import React from 'react';
import { Link } from 'react-router';

const ContentItem = ({ data }) => {
  const content = data;
  return (
    <div className="content item col-md-12">
      <Link className="yellow" to={`/content/${content.hash}`}>{content.hash}</Link>
    </div>
  );
};

ContentItem.propTypes = {
  data: React.PropTypes.object.isRequired,
  // onSelect: React.PropTypes.func.isRequired,
};

ContentItem.defaultProps = {
};

export default ContentItem;
