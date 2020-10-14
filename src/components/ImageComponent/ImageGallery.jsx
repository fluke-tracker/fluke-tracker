import ImageComponent from "./ImageComponent.jsx";
import getS3Bucket from "../../utils/utilFunctions";

import * as React from "react";
import { useState, useEffect } from "react";
import Gallery from "react-grid-gallery";
import CircularProgress from "@material-ui/core/CircularProgress";
import failImg from "assets/img/error.jpg";

const ImageGallery = (props) => {
  const [s3BucketPath, setS3BucketPath] = useState("");
  const [loadedPictures, setLoadedPictures] = useState(new Set());
  const [errorPictures, setErrorPictures] = useState(new Set());
  let imageStatus = "";
  const filename = props.filename;
  // handler that will be called after the image has loaded
  const notifyLoadHandler = props.notifyLoadHandler;

  useEffect(() => {
    async function getS3BucketAsync() {
      const s3Path = await getS3Bucket();
      setS3BucketPath(s3Path);
    }
    getS3BucketAsync();
  }, []);

  const handleImageLoaded = () => {
    /**
     * We need to create a new Set at this point, otherwise we would send the same Set object that we used in State.
     * Since it has the same reference in memory, React would not update it.
     * See https://dev.to/ganes1410/using-javascript-sets-with-react-usestate-39eo for more info about it.
     * */
    const newSet = new Set(loadedPictures);
    newSet.add(filename);
    setLoadedPictures(newSet);
    imageStatus = "loaded picture successfully";
    console.log(imageStatus);
    notifyLoadHandler(filename);
  };

  const handleImageErrored = () => {
    const newSet = new Set(errorPictures);
    newSet.add(filename);
    setErrorPictures(newSet);
    imageStatus = "failed to load picture";
    console.log(imageStatus);
    notifyLoadHandler(filename);
  };

  const getImages = (image) => {
    const image_url = s3BucketPath + "public/thumbnails/" + image + "thumbnail.jpg";
    return image_url;
  };

  const getImagesCropped = (image) => {
    const image_url = !errorPictures.has(image) ? s3BucketPath + "public/watermark/" + image : failImg;
    return image_url;
  };

  let imageGallery = "";
  if (typeof filename !== "undefined" && s3BucketPath !== "") {
    imageGallery = (
      <Gallery
        thumbnailImageComponent={ImageComponent}
        images={[
          {
            tags: [],
            onError: handleImageErrored,
            onLoad: handleImageLoaded,
            src: getImagesCropped(filename),
            // setting it to undefined results in keeping the ratio if it's smaller than
            // 490px in width and breaking the ratio if it's wider than 490px
            thumbnailWidth: undefined,
            thumbnailHeight: undefined,
            thumbnail: getImagesCropped(filename),
          },
        ]}
        // setting the row height to 125 seemed reasonable after looking at the sizes of the cropped images
        // they are always 1024 wide and mostly have a height between 230 and 270
        // we display a width of 491.1 => height approx. 125
        rowHeight={125}
        enableLightbox={true}
        backdropClosesModal
        enableImageSelection={false}
      />
    );
  }

  return (
    <div>
      {loadedPictures.has(filename) || errorPictures.has(filename) ? "" : <CircularProgress />}
      {imageGallery}
    </div>
  );
};

export default ImageGallery;
