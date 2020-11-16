import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

export default function ContinuousSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.handleChange(newValue);
  };

  return (
    <div className={classes.root}>
      <Slider
        value={value}
        onChange={handleChange}
        aria-labelledby="continuous-slider"
        min={0}
        max={360}
      />
    </div>
  );
}
