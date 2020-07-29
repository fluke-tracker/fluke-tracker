import ImageComponent from "./ImageComponent.jsx";

import * as React from "react";
import { useState, useEffect } from "react";
import Gallery from "react-grid-gallery";
import CircularProgress from "@material-ui/core/CircularProgress";
import getS3Bucket from "../../utils/utilFunctions";

const ImageGallery = (props) => {
  const [s3BucketPath, setS3BucketPath] = useState("");
  const [loadedPictures, setLoadedPictures] = useState(new Set());
  let imageStatus = "";
  const filename = props.filename;

  useEffect(() => {
    // Create an scoped async function in the hook
    async function getS3BucketAsync() {
      const s3Path = await getS3Bucket();
      setS3BucketPath(s3Path);
    } // Execute the created function directly
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
  };

  const handleImageErrored = () => {
    imageStatus = "failed to load picture";
    console.log(imageStatus);
  };

  const getimages = (image) => {
    const image_url = s3BucketPath + "public/thumbnails/" + image + "thumbnail.jpg";
    return image_url;
  };

  const getimagescropped = (image) => {
    const image_url = s3BucketPath + "cropped_images/" + image;
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
            src: getimagescropped(filename),
            thumbnailWidth: 480,
            thumbnailHeight: 320,
            thumbnail: getimages(filename),
          },
        ]}
        rowHeight={240}
        enableLightbox={true}
        backdropClosesModal
        enableImageSelection={false}
      />
    );
  }

  return (
    <div>
      {loadedPictures.has(filename) ? "" : <CircularProgress />}
      {imageGallery}
    </div>
  );
};

export default ImageGallery;
