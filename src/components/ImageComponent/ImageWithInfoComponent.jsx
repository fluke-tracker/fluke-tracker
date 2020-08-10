import * as React from "react";
import GridItem from "components/Grid/GridItem.jsx";
import Badge from "components/Badge/Badge.jsx";
import Button from "components/CustomButtons/Button.jsx";

import SendPrivateMessage from "components/CustomDialog/sendPrivateMessage.jsx";
import ImageGallery from "./ImageGallery.jsx";

const ImageWithInfoComponent = (props) => {
  console.log("IMAGEwINFO PROPS");
  console.log(props);

  const picObj = props.picObj;
  const distance = props.distance;
  const adminFlag = props.adminFlag;
  // handler that will be called after the image has loaded
  const notifyLoadHandler = props.notifyLoadHandler;

  let filename = undefined;
  let picInfosItems = <br />;

  const openSearchPage = () => {
    const url = "/search-page/" + picObj.whale.id;
    window.open(url, "_blank");
  };

  const openMapPage = () => {
    const url = "https://www.google.de/maps/search/" + getGeocoordsParsed(true);
    window.open(url, "_blank");
  };

  const getGeocoordsParsed = (detailed) => {
    const geocoords = picObj.geocoords;
    const geocoordsErrs = new Set(["undefined,undefined", ",", null, "null,null"]);
    if (geocoordsErrs.has(geocoords)) {
      return "-";
    } else {
      let coordResult = geocoords;
      if (!detailed) {
        const [firstCoord, secondCoord] = geocoords.split(",");
        coordResult = parseFloat(firstCoord).toFixed(7) + ", " + parseFloat(secondCoord).toFixed(7);
      }
      return coordResult;
    }
  };

  if (typeof picObj !== "undefined") {
    const labelsAligned = { minWidth: "165px", display: "inline-block" };

    const whaleId = picObj.whale.id;
    const uploadedBy = picObj.uploaded_by;
    const geoCoordsParsed = getGeocoordsParsed(false);
    const date = picObj.date_taken;
    const dateErrs = new Set(["", " ", null]);
    picInfosItems = (
      <div style={{ marginBottom: "10px" }}>
        <strong style={labelsAligned}>Whale ID: </strong>
        <Badge color="info">{parseInt(whaleId) === -1 ? "-" : whaleId}</Badge>
        {adminFlag && parseInt(whaleId) !== -1 ? (
          <Button style={{ marginLeft: "10px" }} size="sm" onClick={openSearchPage}>
            Show more pictures
          </Button>
        ) : (
          ""
        )}
        <br />
        <div>
          <strong style={labelsAligned}>Picture owner: </strong>
          <Badge color="info">{uploadedBy !== "" ? uploadedBy : "-"}</Badge>
          {/*<SendPrivateMessage />*/}
          <br />
        </div>
        <strong style={labelsAligned}>Coordinates / Place: </strong>
        <Badge color="info">{geoCoordsParsed}</Badge>
        {geoCoordsParsed !== "-" ? (
          <Button style={{ marginLeft: "10px" }} size="sm" onClick={openMapPage}>
            Open in map
          </Button>
        ) : (
          ""
        )}
        <br />
        <strong style={labelsAligned}>Date: </strong>
        <Badge color="info">{dateErrs.has(date) ? "-" : date}</Badge>
        <br />
        {distance != null ? (
          <div>
            <strong style={labelsAligned}>Similarity-Score: </strong>
            <Badge color="info">{(2 - distance).toFixed(2)}</Badge>
          </div>
        ) : (
          <br />
        )}
      </div>
    );
    filename = picObj.filename;
  }
  const imageGallery = <ImageGallery filename={filename} notifyLoadHandler={notifyLoadHandler} />;

  return (
    <div>
      <GridItem xs={12} style={{ color: "black" }}>
        {picInfosItems}
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
