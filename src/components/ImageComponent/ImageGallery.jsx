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
            // setting it to undefined results in keeping the ratio if it's smaller than
            // 490px in width and breaking the ratio if it's wider than 490px
            thumbnailWidth: undefined,
            thumbnailHeight: undefined,
            thumbnail: getimagescropped(filename),
          },
        ]}
        // setting the row height to 125 seemed reasonable after loolking at the sizes of the cropped images
        // they are always 1024 wide and mostly have a height between 230 and 270
        // we display a widht of 491.1 => height approx. 125
        rowHeight={125}
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
