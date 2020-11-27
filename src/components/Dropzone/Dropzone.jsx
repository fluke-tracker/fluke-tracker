import React from 'react';
import Dropzone from 'react-dropzone-uploader';
import Button from 'components/CustomButtons/Button.jsx';
import { Icon } from 'semantic-ui-react';
import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types';

class DropzoneComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      dialogMessage: '',
    };
    this.dropzoneRef = React.createRef(null);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showSnackBar = this.showSnackBar.bind(this);
  }
  componentDidMount() {
    //this.interval = setInterval(() =>x this.state.selectedEnabled === "browserCropping" ? this.updatePreviewImages(): null, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  showSnackBar(message, timeout) {
    this.setState({
      dialogMessage: message,
    });
    setTimeout(() => this.setState({ dialogMessage: '' }), timeout);
  }

  handleValidation = ({ meta }) => {
    return this.dropzoneRef.current.files.some((file) => {
      const val =
        file.name === meta.name &&
        file.size === meta.size &&
        file.type === meta.type;
      console.log(val);
      return val;
    });
  };

  handleChangeStatus = ({ meta }, status, images) => {
    console.log(status, meta, images);
    var seen = {};
    const files = images
      .filter((image) =>
        Object.prototype.hasOwnProperty.call(seen, image.meta.name)
          ? false
          : (seen[image.meta.name] = true)
      )
      .filter((image) => image.meta.status !== 'removed')
      .map(
        (image) =>
          new File([image.file], image.file.name, { type: image.file.type })
      );
    this.props.filesChanged(files);
  };
  blobToFile(theBlob, fileName) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }
  setProgress(filename, progress) {
    this.props.files
      .filter((file) => file.filename === filename)
      .forEach((file) => (file.progress = progress));
  }

  handleSubmit = async (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    await this.updatePreviewImages();
    const dropzone = this.dropzoneRef?.current;
    allFiles.forEach((f) => (f.meta.status = 'uploading'));
    this.setState({ uploading: true });
    allFiles.forEach((f) => {
      this.props.uploadImage(f.file, (progress) => {
        console.log(progress);
        f.meta.percent = progress || 100;
        if (f.meta.percent === 100) {
          f.meta.status = 'done';
          this.setState({ uploading: false });
          f.remove();
          this.showSnackBar('Uploaded ' + f.meta.name + ' successful', 5000);
        }
        dropzone.forceUpdate();
      });
    });
    this.forceUpdate();
    console.log(files.map((f) => f.meta));
  };
  async updatePreviewImages() {
    console.log('update');
    const dropzone = this.dropzoneRef?.current;
    dropzone.files = await Promise.all(
      dropzone.files.map(async (f, i) => {
        const image = await this.props.getImage(i);
        if (image) {
          f.file = await this.blobToFile(
            new Blob([image], { type: image.type }),
            f.meta.name
          );
        }
        return f;
      })
    );
    dropzone.files.forEach((f) => dropzone.generatePreview(f));
  }

  render() {
    const { user } = this.props;
    const SubmitButton = (props) => (
      <>
        <Button
          style={{ marginLeft: '10px' }}
          variant="contained"
          disabled={this.state.uploading}
          onClick={() =>
            user
              ? this.handleSubmit(
                  props.files.filter((f) =>
                    ['headers_received', 'done'].includes(f.meta.status)
                  ),
                  props.files
                )
              : this.props.history.push(`/login`)
          }
          color="success"
          size="lg"
        >
          {user ? (
            <>
              <Icon name="cloud upload" />
              <div>Upload all files</div>
            </>
          ) : (
            <>
              <Icon name="address book outline" />
              <div>Login to upload</div>
            </>
          )}
        </Button>
      </>
    );
    const dialogMessage = this.state.dialogMessage;
    return (
      <>
        {this.props.selectedMode === 'browserCropping'
          ? this.props.BrowserCroppingComponent
          : ''}
        <Dropzone
          getUploadParams={() => true}
          ref={this.dropzoneRef}
          validate={this.handleValidation}
          onChangeStatus={this.handleChangeStatus}
          onSubmit={this.handleSubmit}
          accept="image/*,video/*"
          inputContent={(files, extra) =>
            extra.reject
              ? 'Image and video files only'
              : 'Drag Whale Images here'
          }
          submitButtonContent={'Uploading whales'}
          SubmitButtonComponent={SubmitButton}
          styles={{
            dropzone: {
              width: '90%',
              minHeight: '200px',
              //borderStyle: 'dashed',
              //borderWidth: '15px',
              overflow: 'auto',
            },
            width: '100%',
            dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
            preview: {
              margin: '10px',
              backgroundColor: '#e6f5e9',
              borderRadius: '10px',
            },
            inputLabel: (files, extra) =>
              extra.reject ? { color: 'red' } : {},
          }}
        />
        <Snackbar
          open={dialogMessage !== ''}
          message={dialogMessage}
          autoHideDuration={4000}
        />
      </>
    );
  }
}
DropzoneComponent.propTypes = {
  classes: PropTypes.element.isRequired,
  filesChanged: PropTypes.element.isRequired,
  files: PropTypes.element.isRequired,
  uploadImage: PropTypes.element.isRequired,
  getImage: PropTypes.element.isRequired,
  user: PropTypes.element.isRequired,
  history: PropTypes.element.isRequired,
  selectedMode: PropTypes.element.isRequired,
  BrowserCroppingComponent: PropTypes.element.isRequired,
};

export default DropzoneComponent;
