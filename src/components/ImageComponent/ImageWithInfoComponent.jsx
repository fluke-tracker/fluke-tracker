import ImageComponent from "./ImageComponent.jsx";

import * as React from "react";
import Gallery from "react-grid-gallery";
import GridItem from "components/Grid/GridItem.jsx";
import Badge from "components/Badge/Badge.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";

import SendPrivateMessage from "components/CustomDialog/sendPrivateMessage.jsx";

const ImageWithInfoComponent = (props) => {
  console.log("IMAGEwINFO PROPS");
  console.log(props);

  const picObj = props.picObj;
  const distance = props.distance;
  const adminFlag = props.adminFlag;
  const [loadedPictures, setLoadedPictures] = React.useState(new Set());
  let imageStatus = "";
  let filename = "";
  let picInfosItems = <br />;
  let imageGallery = "";

  const handleImageLoaded = () => {
    console.log("IN HANDLING");
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
    const bucket_url =
      "https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09213627-whaledev.s3.eu-central-1.amazonaws.com/public/thumbnails/";
    const image_url = bucket_url + image + "thumbnail.jpg";
    return image_url;
  };

  const getimagescropped = (image) => {
    const bucket_url =
      "https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09213627-whaledev.s3.eu-central-1.amazonaws.com/cropped_images/";
    const image_url = bucket_url + image;
    return image_url;
  };

  const openSearchPage = () => {
    const url = "/search-page/" + picObj.whale.id;
    window.open(url, "_blank");
  };

  const openMapPage = () => {
    const url = "https://www.google.de/maps/search/" + getGeocoordsParsed();
    window.open(url, "_blank");
  };

  const getGeocoordsParsed = () => {
    const geocoords = picObj.geocoords;
    const geocoordsErrs = new Set(["undefined,undefined", ",", null, "null,null"]);
    if (geocoordsErrs.has(geocoords)) {
      return "-";
    } else {
      return geocoords;
    }
  };

  if (typeof picObj !== "undefined") {
    const whaleId = picObj.whale.id;
    const date = picObj.date_taken;
    const dateErrs = new Set(["", " ", null]);
    picInfosItems = (
      <div>
        <strong>Whale ID: </strong>
        <Badge color="info">{parseInt(whaleId) === -1 ? "-" : whaleId}</Badge>
        {adminFlag ? (
          <Button size="sm" onClick={openSearchPage}>
            Show more pictures
          </Button>
        ) : (
          ""
        )}
        <br />
        {adminFlag ? (
          <div>
            <strong>Picture owner: </strong>
            <Badge color="info">{picObj.uploaded_by}</Badge>
            <SendPrivateMessage />
            <br />
          </div>
        ) : (
          ""
        )}
        <strong>Coordinates / Place: </strong>
        <Badge color="info">{getGeocoordsParsed()}</Badge>
        <Button size="sm" onClick={openMapPage}>
          Open in map
        </Button>
        <br />
        <strong>Date: </strong>
        <Badge color="info">{dateErrs.has(date) ? "-" : date}</Badge>
        <br />
        {distance != null ? (
          <div>
            <strong>Distance: </strong>
            <Badge color="info">{distance.toFixed(2)}</Badge>
          </div>
        ) : (
          <br />
        )}
      </div>
    );

    filename = picObj.filename;
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
      <GridItem xs={12} style={{ color: "black" }}>
        {picInfosItems}
        <div> {loadedPictures.has(filename) ? "" : <CircularProgress />}</div>
        {imageGallery}
        <br />
      </GridItem>
      <GridItem xs={12} style={{ color: "black", clear: "both" }}>
        <div>
          <h4>
            <a href={"search-page/" + filename}>{filename}</a>
          </h4>
        </div>
      </GridItem>
    </div>
  );
};

export default ImageWithInfoComponent;
