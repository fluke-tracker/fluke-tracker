import * as tf from '@tensorflow/tfjs';
//self.importScripts('https://unpkg.com/@tensorflow/tfjs');

// web-worker.js
//importScripts('https://unpkg.com/@tensorflow/tfjs');
//tf.setBackend('cpu');

//const MODEL_URL = "https://...";
//const DICT_URL = "https://...";
let model;
let modelIsReady = false;
let eventQueue = [];

const predict = async function(event) {
  console.log("start prediction " + event);
  const scores = tf.tidy(() => {
    const imgAsTensor = tf.browser.fromPixels(event.image);
    const preparedImg = prepareImg(imgAsTensor);
    //const processedImg = centerCroppedImg.div(127.5).sub(1);
    //return new Promise( () => { data: () => [1,2,3,4]});
    return model.predict(preparedImg);
  })
  if (scores) {
    const probabilities = await scores.data();
    scores.dispose();

    const result = Array.from(probabilities);
    var prediction = tg(event.natH, event.natW, result);

    // send the result back as an array
    postMessage({prediction: prediction, id: event.id});
  } else {
    console.log('Scores: ', scores);
  }
}

const setup = async () => {
  try {
    //model = await tf.loadLayersModel('/cropping-tfjs2/model.json');
    model = await tf.loadGraphModel('/cropping-tfjs2/model.json');
    //const response = await tf.util.fetch(DICT_URL);
    //const text = await response.text();
    //dictionary = text.trim().split('\n');
  } catch(err) {
    console.error("Can't load model: ", err)
  }

  //const zeros = tf.zeros([1, 128, 128, 1]);
  // warm-up the model
  //model.predict(zeros);
  // inform the main page that our model is loaded
  postMessage({ modelIsReady: true});
  modelIsReady = true;
  while(eventQueue.length > 0) {
    console.log(eventQueue);
    const evt = eventQueue.pop();
    if (evt && evt.data && evt.data.image) {
        predict(evt);
    }
  }
}

onmessage = function(evt) {
  console.log("got event " + evt);
  if (!modelIsReady) {
    eventQueue = eventQueue.concat(evt);
    return;
  }

  if (evt && evt.data && evt.data.image) {
    predict(evt.data);
  }
}

onerror = function(evt) {
    console.log("got error " + evt);
}

const prepareImg = image => {
    image = tf.image.resizeBilinear(image, [128, 128]);
    const rgb = tf.tensor1d([0.2989, 0.587, 0.114])
    let gray = tf.sum(image.mul(rgb), 2) // broadcasting
    //let canvas = document.querySelector('#myCanvas')
    //tf.browser.toPixels(gray.mul(1/255), canvas);
    gray = gray.reshape([1, 128,128, 1]);
    return gray;
}

const tg = (natH, natW, guess) => {return {v1: guess[0] / 128 * natW, v2: guess[1] / 128 * natH, v3: guess[2] / 128 * natW, v4: guess[3] / 128 * natH};}

setup();
