import React from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import pixels from 'image-pixels';
import Button from 'components/CustomButtons/Button.jsx';
import ContinuousSlider from 'components/Slider/Slider.jsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import { Icon } from 'semantic-ui-react';

class CropperComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      isPredicted: false,
      cropper: null,
    };
    this.onReady = this.onReady.bind(this);
    this.getCroppedImage = this.getCroppedImage.bind(this);
  }

  tg(natH, natW, guess) {
    return {
      v1: (guess[0] / 128) * natW,
      v2: (guess[1] / 128) * natH,
      v3: (guess[2] / 128) * natW,
      v4: (guess[3] / 128) * natH,
    };
  }

  dataURItoBlob(dataURI) {
    if (!dataURI) return null;
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  async getCroppedImage() {
    return await new Promise((resolve) => {
      return this.state.cropper
        ? resolve(
            this.dataURItoBlob(
              this.state.cropper.getCroppedCanvas()?.toDataURL('image/jpeg')
            )
          )
        : resolve(undefined);
    });
  }

  trigger_prediction() {
    this.setState({ isPredicted: false });
    const imageData = this.state.cropper.getImageData();
    const natH = imageData.naturalHeight;
    const natW = imageData.naturalWidth;
    const image = this.props.src;
    pixels(image).then((pixelz) =>
      this.props.workerHandler
        .addJob({ id: 2, natH: natH, natW: natW, image: pixelz })
        .then((evt) => {
          this.state.cropper.setData({
            x: evt.data.prediction.x1,
            y: evt.data.prediction.y1,
            width: evt.data.prediction.x2 - evt.data.prediction.x1,
            height: evt.data.prediction.y2 - evt.data.prediction.y1,
          });
          this.setState({ isPredicted: true });
        })
    );
  }

  onReady(event) {
    this.trigger_prediction();
  }

  async readFileAsDataURL(file) {
    const fileRes = await file;
    let result_base64 = await new Promise((resolve) => {
      let fileReader = new FileReader();
      if (!fileRes) resolve(undefined);
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsDataURL(fileRes);
    });

    return result_base64;
  }

  async download_file() {
    var string = await this.readFileAsDataURL(this.getCroppedImage());
    var iframe =
      "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
  }

  render() {
    const cropper = this.state.cropper;
    return (
      <>
        <h1>{this.props.filename}</h1>
        <Cropper
          src={this.props.src}
          style={{ height: 400, width: '100%' }}
          // Cropper.js options
          initialAspectRatio={16 / 9}
          guides={false}
          ready={this.onReady}
          onInitialized={(instance) => {
            this.setState({ cropper: instance });
          }}
        />
        <ContinuousSlider
          title="Rotate"
          value="0"
          handleChange={(value) =>
            cropper.rotate(value - cropper.getData().rotate)
          }
        />
        <Tooltip title="Rotate left (45 degree)">
          <Button onClick={() => cropper.rotate(45)}>↶</Button>
        </Tooltip>
        <Tooltip title="Rotate right (45 degree)">
          <Button onClick={() => cropper.rotate(-45)}>↷</Button>
        </Tooltip>
        <Tooltip title="Zoom +0.1">
          <Button onClick={() => cropper.zoom(0.1)}>+</Button>
        </Tooltip>
        <Tooltip title="Zoom -0.1">
          <Button onClick={() => cropper.zoom(-0.1)}>-</Button>
        </Tooltip>
        <Tooltip title="Mirror X">
          <Button onClick={() => cropper.scaleX(cropper.getData().scaleX * -1)}>
            &#8596;
          </Button>
        </Tooltip>
        <Tooltip title="Mirror Y">
          <Button onClick={() => cropper.scaleY(cropper.getData().scaleY * -1)}>
            &#8597;
          </Button>
        </Tooltip>
        <Tooltip title="Reset Cropping">
          <Button onClick={() => cropper.reset()}>⟳</Button>
        </Tooltip>
        <Tooltip title="Predict cropping automatically">
          <Button onClick={() => this.trigger_prediction()}>★</Button>
        </Tooltip>
        <Tooltip title="Open cropped image">
          <Button onClick={() => this.download_file()}>
            <Icon name="folder open outline" />
          </Button>
        </Tooltip>
        {!this.state.isPredicted ? (
          <Tooltip title="Waiting for autocrop to finish">
            <CircularProgress />
          </Tooltip>
        ) : (
          ''
        )}
        <br />
      </>
    );
  }
}

export default CropperComponent;
