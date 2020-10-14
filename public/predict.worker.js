//import in worker does not work with latest babel/work-loader combination for some reason
//import * as tf from "@tensorflow/tfjs";
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');

let model;
let modelIsReady = false;
let eventQueue = [];

const predict = async function (event) {
  console.log("start prediction " + event);
  const scores = tf.tidy(() => {
    const imgAsTensor = tf.browser.fromPixels(event.image);
    const preparedImg = prepareImg(imgAsTensor);
    return model.predict(preparedImg);
  });
  if (scores) {
    const probabilities = await scores.data();
    scores.dispose();

    const result = Array.from(probabilities);
    var prediction = transformResultsOnOriginalSize(
      event.natH,
      event.natW,
      result
    );
    var extendedPrediction = extendCroppingBox(prediction);

    // send the result back as an array
    postMessage({ prediction: extendedPrediction, id: event.id });
  } else {
    console.log("Scores: ", scores);
  }
};

const setup = async () => {
  try {
    // this model is the kaggle model (mpiotte cropping)
    //model = await tf.loadLayersModel('/cropping-tfjs2/model.json');
    // this one is AI-Sensing cropping model
    model = await tf.loadGraphModel("/cropping-tfjs2/model.json");
  } catch (err) {
    console.error("Can't load model: ", err);
  }

  postMessage({ modelIsReady: true });
  modelIsReady = true;
  while (eventQueue.length > 0) {
    console.log(eventQueue);
    const evt = eventQueue.pop();
    if (evt && evt.data && evt.data.image) {
      predict(evt);
    }
  }
};

onmessage = function (evt) {
  console.log("got event " + evt);
  if (!modelIsReady) {
    eventQueue = eventQueue.concat(evt);
    return;
  }

  if (evt && evt.data && evt.data.image) {
    predict(evt.data);
  }
};

onerror = function (evt) {
  console.log("got error " + evt);
};

const prepareImg = (image) => {
  image = tf.image.resizeBilinear(image, [128, 128]);
  const rgb = tf.tensor1d([0.2989, 0.587, 0.114]);
  let gray = tf.sum(image.mul(rgb), 2); // broadcasting
  //let canvas = document.querySelector('#myCanvas')
  //tf.browser.toPixels(gray.mul(1/255), canvas);
  gray = gray.reshape([1, 128, 128, 1]);
  return gray;
};
function transformResultsOnOriginalSize(natH, natW, guess) {
  return {
    x1: (guess[0] / 128) * natW,
    y1: (guess[1] / 128) * natH,
    x2: (guess[2] / 128) * natW,
    y2: (guess[3] / 128) * natH,
  };
}
function extendCroppingBox(data) {
  return {
    x1: data.x1 < data.x2 ? data.x1 - 3 : data.x1 + 3,
    y1: data.y1 < data.y2 ? data.y1 - 3 : data.y1 + 3,
    x2: data.x2 < data.x1 ? data.x2 - 3 : data.x2 + 3,
    y2: data.y2 < data.y1 ? data.y2 - 3 : data.y2 + 3,
  };
}

setup();
