import React from "react";

class ImageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  render() {
    return (
      <img
        {...this.props.imageProps}
        onLoad={this.props.item.onLoad}
        onError={this.props.item.onError}
      />
    );
  }
}

export default ImageComponent;
