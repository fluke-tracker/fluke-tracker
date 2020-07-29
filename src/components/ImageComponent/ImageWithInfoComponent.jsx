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
        <div>
          <strong>Picture owner: </strong>
          <Badge color="info">{picObj.uploaded_by}</Badge>
          {/*<SendPrivateMessage />*/}
          <br />
        </div>
        <strong>Coordinates / Place: </strong>
        <Badge color="info">{getGeocoordsParsed(false)}</Badge>
        <Button size="sm" onClick={openMapPage}>
          Open in map
        </Button>
        <br />
        <strong>Date: </strong>
        <Badge color="info">{dateErrs.has(date) ? "-" : date}</Badge>
        <br />
        {distance != null ? (
          <div>
            <strong>Similarity-Score: </strong>
            <Badge color="info">{(2 - distance).toFixed(2)}</Badge>
          </div>
        ) : (
          <br />
        )}
      </div>
    );
    filename = picObj.filename;
  }
  const imageGallery = <ImageGallery filename={filename} />;

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
