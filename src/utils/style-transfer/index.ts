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

import type { GraphModel } from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
import "babel-polyfill";

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
