/**
 * @license
 * Copyright 2018 Reiichiro Nakano All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from "@tensorflow/tfjs";
import { GraphModel } from "@tensorflow/tfjs";
import "babel-polyfill";
import { StyleTransferImage } from "~/store";
import { links } from "./links";
tf.ENV.set("WEBGL_PACK", false); // This needs to be done otherwise things run very slow v1.0.4

/**
 * Main application to start on window load
 */

const loadMobileNetStyleModel = async (mobileStyleNet: GraphModel | null) => {
  if (!mobileStyleNet) {
    const model = await tf.loadGraphModel(
      "/style-transfer/saved_model_style_js/model.json"
    );

    return model;
  }

  return null;
};
const loadInceptionStyleModel = async (
  inceptionStyleNet: GraphModel | null
) => {
  if (!inceptionStyleNet) {
    const model = await tf.loadGraphModel(
      "/style-transfer/saved_model_style_inception_js/model.json"
    );

    return model;
  }

  return null;
};

export const loadStyleModel = (styleModel: string) => {
  if (styleModel === "mobilenet") {
    return loadMobileNetStyleModel;
  } else if (styleModel === "inception") {
    return loadInceptionStyleModel;
  }

  return null;
};

const loadOriginalTransformerModel = async (
  originalTransformNet: GraphModel | null
) => {
  if (!originalTransformNet) {
    const transformer = await tf.loadGraphModel(
      "/style-transfer/saved_model_transformer_js/model.json"
    );

    return transformer;
  }

  return null;
};

const loadSeparableTransformerModel = async (
  separableTransformNet: GraphModel | null
) => {
  if (!separableTransformNet) {
    const transformer = await tf.loadGraphModel(
      "/style-transfer/saved_model_transformer_separable_js/model.json"
    );

    return transformer;
  }

  return null;
};

export const loadStyleTransformer = (styleTransformer: string) => {
  if (styleTransformer === "original") {
    return loadOriginalTransformerModel;
  } else if (styleTransformer === "separable") {
    return loadSeparableTransformerModel;
  }

  return null;
};

// export const startStyling = async (
//   styleNet: GraphModel,
//   styleRatio: number,
//   transformNet: GraphModel
// ) => {
//   const stylizedImage = document.querySelector(".stylized-image")!;
//   const contentImg = document.getElementById("content-img")!;
//   const styleImg = document.querySelector("#style-img")!;

//   await tf.nextFrame();
//   // this.styleButton.textContent = 'Generating 100D style representation';
//   await tf.nextFrame();
//   let bottleneck = tf.tidy(() => {
//     return styleNet.predict(
//       tf.browser
//         .fromPixels(styleImg as HTMLImageElement)
//         .toFloat()
//         .div(tf.scalar(255))
//         .expandDims()
//     );
//   });
//   if (styleRatio !== 1.0) {
//     //   this.styleButton.textContent = 'Generating 100D identity style representation';
//     await tf.nextFrame();
//     const identityBottleneck = tf.tidy(() => {
//       return styleNet.predict(
//         tf.browser
//           .fromPixels(contentImg as HTMLImageElement)
//           .toFloat()
//           .div(tf.scalar(255))
//           .expandDims()
//       );
//     });
//     const styleBottleneck = bottleneck;
//     bottleneck = await tf.tidy(() => {
//       const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(styleRatio));
//       const identityBottleneckScaled = identityBottleneck.mul(
//         tf.scalar(1.0 - styleRatio)
//       );
//       return styleBottleneckScaled.addStrict(identityBottleneckScaled);
//     });
//     styleBottleneck.dispose();
//     identityBottleneck.dispose();
//   }
//   // this.styleButton.textContent = 'Stylizing image...';
//   await tf.nextFrame();
//   const stylized = await tf.tidy(() => {
//     return transformNet
//       .predict([
//         tf.browser
//           .fromPixels(contentImg as HTMLImageElement)
//           .toFloat()
//           .div(tf.scalar(255))
//           .expandDims(),
//         bottleneck,
//       ])
//       .squeeze();
//   });
//   await tf.browser.toPixels(stylized, stylizedImage);
//   bottleneck.dispose(); // Might wanna keep this around
//   stylized.dispose();
// };

// export const  startCombining= async ()=>  {
// }

// export const  benchmark= async ()=>  {
// }

// export const  benchmarkStyle= async(x, styleNet) =>{
// }

// export const  benchmarkTransform= async(x, bottleneck, transformNet)=> {
// }
// }

// function getRndInteger(min, max) {
// return Math.floor(Math.random() * (max - min + 1) ) + min;
// }
