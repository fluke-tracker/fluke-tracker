import React from 'react';
import Storage from '@aws-amplify/storage';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import { createPicture } from 'graphql/mutations';
import { API, graphqlOperation } from '@aws-amplify/api';
import exifr from 'exifr';
import CropperComponent from 'components/Cropper/Cropper.jsx';
import WorkerHandler from 'views/WorkerHandler.jsx';
import DropzoneComponent from 'components/Dropzone/Dropzone.jsx';
import PropTypes from 'prop-types';

class WhaleUploaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadingFiles: false,
      imageNames: [],
      imageFiles: [],
      imageFilesStrings: [],
      responses: [],
      latitude: null,
      longitude: null,
      imageDate: null,
      cropperComponents: [],
      selectedEnabled: 'browserCropping',
    };
    this.workerHandler = new WorkerHandler();
    this.uploadImages = this.uploadImages.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.filesChanged = this.filesChanged.bind(this);
    this.dropzoneComponentRef = React.createRef(null);
    this.uploadViaBrowserCropping = this.uploadViaBrowserCropping.bind(this);
    this.uploadViaCropping = this.uploadViaCropping.bind(this);
    this.uploadViaNoCropping = this.uploadViaNoCropping.bind(this);
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
  }

  componentWillUnmount() {
    this.workerHandler.worker.terminate();
  }

  async addResponse(response, color) {
    console.log('add Response ' + response);
    await this.setState((state) => {
      return {
        responses: [
          ...state.responses,
          {
            response: response,
            responseColor: color,
          },
        ],
      };
    });
  }
  filesChanged(files) {
    this.setState({
      imageFiles: Array.from(files),
      imageNames: Array.from(files).map((item) => item.name),
    });
    Promise.all(
      Array.from(files).map((file) => this.readFileAsDataURL(file))
    ).then((results) => {
      this.setState({
        imageFilesStrings: results,
      });
    });
  }

  async uploadViaCropping(file, progressCustomCallback) {
    console.log('cropping algorithm selected');
    const uploadPath = 'embeddings/input/';
    var options = {
      ACL: 'public-read',
      level: 'public',
      contentType: file.type,
      progressCallback: (progressEvent) =>
        progressCustomCallback(
          (50 * progressEvent.loaded) / progressEvent.total
        ),
    };
    Storage.put(uploadPath + file.name, file, options)
      .then((result) => {
        this.uploadThumbnail(file, (progressEvent) => {
          progressCustomCallback(
            50 + (50 * progressEvent.loaded) / progressEvent.total
          );
        });
        console.log('image uploaded', result);
        this.upload = null;
        this.addResponse(
          'File ' + file.name + ' uploaded successfully!',
          'green'
        );
      })
      .catch((err) => {
        console.log('error while uploading,', err);
        this.addResponse(
          'Error! File ' +
            file.name +
            ' could not be uploaded, please try again.',
          'red'
        );
      });
  }
  async uploadViaNoCropping(file, progressCustomCallback) {
    console.log('no cropping selected');
    const customPrefix = {
      public: '',
    };
    const uploadPath = 'cropped_images/';
    Storage.put(uploadPath + file.name, file, {
      customPrefix: customPrefix,
      progressCallback: (progressEvent) => {
        progressCustomCallback(
          (50 * progressEvent.loaded) / progressEvent.total
        );
      },
    })
      .then((result) => {
        this.uploadThumbnail(file, (progressEvent) => {
          progressCustomCallback(
            50 + (50 * progressEvent.loaded) / progressEvent.total
          );
        });
        console.log('image uploaded', result);
        this.upload = null;
        this.addResponse(
          'File ' + file.name + ' uploaded successfully!',
          'green'
        );
      })
      .catch((err) => {
        console.log('error while uploading,', err);
        this.addResponse(
          'Error! File ' +
            file.name +
            ' could not be uploaded, please try again.',
          'red'
        );
      });
  }
  async uploadViaBrowserCropping(file, progressCustomCallback) {
    console.log('browser cropping selected');
    const customPrefix = {
      public: '',
    };
    const uploadPath = 'cropped_images/';
    console.log(
      this.state.cropperComponents
        .filter((comp) => comp)
        .map((comp) => comp.props.filename)
    );
    const matchingCropperComponents = this.state.cropperComponents.filter(
      (comp) => comp.props.filename === file.name
    );
    if (matchingCropperComponents.length < 1) {
      console.log('no matching cropper component');
    }
    const cropperComponent = matchingCropperComponents[0];
    const fileName =  this.state.cropperComponents
    .filter((comp) => comp)
    .map((comp) => comp.props.filename)[0];
    const croppedFile = await cropperComponent.getCroppedImage(fileName);
    Storage.put(uploadPath + croppedFile.name, croppedFile, {
      customPrefix: customPrefix,
      progressCallback: (progress) => {
        progressCustomCallback((50 * progress.loaded) / progress.total);
      },
    })
      .then((result) => {
        this.uploadThumbnail(croppedFile, (progress) =>
          progressCustomCallback(50 + (50 * progress.loaded) / progress.total)
        );
        console.log('image uploaded', result);
        this.upload = null;
        this.addResponse(
          'File ' + file.name + ' uploaded successfully!',
          'green'
        );
      })
      .catch((err) => {
        console.log('error while uploading,', err);
        this.addResponse(
          'Error! File ' +
            croppedFile.name +
            ' could not be uploaded, please try again.',
          'red'
        );
      });
  }

  async readFileAsDataURL(file) {
    let result_base64 = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsDataURL(file);
    });

    return result_base64;
  }

  async uploadImage(file, progressTracker) {
    if (typeof file !== 'undefined') {
      const allowedFileTypes = new Set(['image/jpeg']);
      const filetype = file.type;
      if (!allowedFileTypes.has(filetype)) {
        this.addResponse(
          'Error ' +
            file.name +
            "! File could not be uploaded: Expected file type is 'image/jpeg' but received '" +
            filetype +
            "'.",
          'red'
        );
        // artifical "break"
        return;
      }

      // if we got to this point, we set the response to "" to enable the circularProgress item
      this.setState({
        responses: [],
      });

      // modify file ending if written in capital letters or as 'jpeg' instead of 'jpg'
      let splitFileName = file.name.split('.');
      const fileExt = splitFileName.pop();
      if (fileExt === 'JPG' || fileExt === 'jpeg') {
        file = new File([file], splitFileName.join('') + '.jpg', {
          type: filetype,
        });
        console.log(file);
      }

      // extract meta data if available
      try {
        const output = await exifr.parse(file);
        this.setState({
          latitude: output.latitude,
          longitude: output.longitude,
          imageData: output.DateTimeOriginal.toGMTString(),
        });
        console.log('image output', output);
      } catch (e) {
        this.setState({
          latitude: null,
          longitude: null,
          imageData: null,
        });
        console.log('error in exifr ', e);
      }

      let allowUpload = false;
      try {
        allowUpload = await this.insertToDynamo(file.name, allowUpload);
      } catch (e) {
        console.log('error in insertToDynamo ', e);
      }
      console.log('allowUpload ', allowUpload);
      if (allowUpload) {
        try {
          console.log('upload image to S3 bucket');
          if (this.state.selectedEnabled === 'noCropping') {
            await this.uploadViaNoCropping(file, progressTracker);
          } else if (this.state.selectedEnabled === 'browserCropping') {
            await this.uploadViaBrowserCropping(file, progressTracker);
          } else if (this.state.selectedEnabled === 'cropping') {
            await this.uploadViaCropping(file, progressTracker);
          }
        } catch (e) {
          console.log('error in uploading', e);
        }
      } else {
        console.log('cannot upload image');
      }
    }
  }

  async uploadImages() {
    await this.setState({
      uploadingFiles: true,
    });
    await Promise.all(
      this.state.imageFiles.map(async (file) => await this.uploadImage(file))
    );
    await this.setState({
      uploadingFiles: false,
    });
  }

  async uploadThumbnail(pFile, progressCustomCallback) {
    try {
      var options = {
        ACL: 'public-read',
        level: 'public',
        contentType: pFile.type,
        progressCallback: progressCustomCallback,
      };
      console.log('upload thumbnail', pFile.name + 'thumbnail.jpg');
      await Storage.put(
        'thumbnails/' + pFile.name + 'thumbnail.jpg',
        pFile,
        options
      );
      console.log('AFTER thumbnail upload');
    } catch (e) {
      console.log('cannot upload thumbnail', e);
    }
  }
  async getCropperImage(i) {
    return this.state.cropperComponents[i]
      ? await this.state.cropperComponents[i]?.getCroppedImage()
      : null;
  }

  async insertToDynamo(image, allowUpload) {
    try {
      console.log('inserting image record to dynamodb');
      const insertImage = await API.graphql(
        graphqlOperation(createPicture, {
          input: {
            id: image,
            filename: image,
            geocoords: this.state.latitude + ',' + this.state.longitude,
            thumbnail: image + 'thumbnail.jpg',
            pictureWhaleId: -1,
            is_new: 1,
            embedding: 123,
            uploaded_by: this.props.user.username,
            date_taken: this.state.imageDate,
          },
        })
      );
      console.log('insertImage output aws', insertImage);

      allowUpload = true;
      console.log('setting allowupload as ', allowUpload);
    } catch (e) {
      allowUpload = false;
      console.log('getting insertImage error', e);
      this.addResponse(
        'Error ' +
          image +
          '! Please make sure that the image you are trying ' +
          'to upload does not exist in the database already.',
        'red'
      );
    }
    return allowUpload;
  }
  handleChangeEnabled(event) {
    this.setState({ selectedEnabled: event.target.value });
  }

  render() {
    const { classes } = this.props;
    const BrowserCropping = this.state.imageFilesStrings.map((image, i) => (
      <CropperComponent
        filename={this.state.imageNames[i]}
        ref={(instance) => (this.state.cropperComponents[i] = instance)}
        workerHandler={this.workerHandler}
        key={image}
        src={image}
      />
    ));
    const ModeSelection = () => (
      <div
        className={
          classes.checkboxAndRadio + ' ' + classes.checkboxAndRadioHorizontal
        }
      >
        <br />
        <FormControlLabel
          control={
            <Radio
              checked={this.state.selectedEnabled === 'browserCropping'}
              onChange={this.handleChangeEnabled}
              value="browserCropping"
              name="radio button browserCropping"
              aria-label="Browser Cropping"
              icon={<FiberManualRecord className={classes.radioUnchecked} />}
              checkedIcon={
                <FiberManualRecord className={classes.radioChecked} />
              }
              classes={{
                checked: classes.radio,
              }}
            />
          }
          classes={{
            label: classes.label,
          }}
          label="Cropping in Browser"
        />
        <FormControlLabel
          control={
            <Radio
              checked={this.state.selectedEnabled === 'cropping'}
              onChange={this.handleChangeEnabled}
              value="cropping"
              name="radio button cropping"
              aria-label="Cropping"
              color="secondary"
              icon={<FiberManualRecord className={classes.radioUnchecked} />}
              checkedIcon={
                <FiberManualRecord className={classes.radioChecked} />
              }
              classes={{
                checked: classes.radio,
              }}
            />
          }
          classes={{
            label: classes.label,
          }}
          label="Use Cropping Algorithm"
        />
        <FormControlLabel
          control={
            <Radio
              checked={this.state.selectedEnabled === 'noCropping'}
              onChange={this.handleChangeEnabled}
              value="noCropping"
              name="radio button noCropping"
              aria-label="No Cropping"
              icon={<FiberManualRecord className={classes.radioUnchecked} />}
              checkedIcon={
                <FiberManualRecord className={classes.radioChecked} />
              }
              classes={{
                checked: classes.radio,
              }}
            />
          }
          classes={{
            label: classes.label,
          }}
          label="No Cropping"
        />
      </div>
    );

    return (
      <>
        <DropzoneComponent
          uploadImage={this.uploadImage}
          BrowserCroppingComponent={BrowserCropping}
          ref={this.dropzoneComponentRef}
          getImage={(i) => this.getCropperImage(i)}
          filesChanged={this.filesChanged}
          classes={this.props.classes}
          user={this.props.user}
          selectedMode={this.state.selectedEnabled}
          history={this.props.history}
        />
        <ModeSelection />
      </>
    );
  }
}
WhaleUploaderComponent.propTypes = {
  user: PropTypes.element.isRequired,
  classes: PropTypes.element.isRequired,
};

export default WhaleUploaderComponent;
