import * as React from "react";
import Gallery from "react-grid-gallery";
import GridItem from "components/Grid/GridItem.jsx";
import Badge from "components/Badge/Badge.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";

const CustomCircularProgress = (props) => {
  console.log("CIRCULAR PROPS");
  console.log(props);

  let setOfLoadedPics = props.loadedPics;
  let currentPicFileName = props.loadingFileName;

  console.log(setOfLoadedPics);
  console.log(currentPicFileName);
  console.log(setOfLoadedPics.has(currentPicFileName));

  return <div> {setOfLoadedPics.has(currentPicFileName) ? "" : <CircularProgress />}</div>;
};

export default CustomCircularProgress;
