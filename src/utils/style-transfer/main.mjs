/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import "babel-polyfill";
import { links } from "./links";
tf.ENV.set("WEBGL_PACK", false); // This needs to be done otherwise things run very slow v1.0.4

/**
 * Main application to start on window load
 */
class Main {
  constructor() {
    // @ts-ignore
    if (window.mobilecheck()) {
      // @ts-ignore
      document.getElementById("mobile-warning").hidden = false;
    }

    this.fileSelect = document.getElementById("file-select");

    // Initialize model selection
    this.modelSelectStyle = document.getElementById("model-select-style");
    // @ts-ignore
    this.modelSelectStyle.onchange = (evt) => {
      // @ts-ignore
      if (evt.target.value === "mobilenet") {
        this.disableStylizeButtons();
        this.loadMobileNetStyleModel()
          .then((model) => {
            this.styleNet = model;
          })
          .finally(() => this.enableStylizeButtons());
        // @ts-ignore
      } else if (evt.target.value === "inception") {
        this.disableStylizeButtons();
        this.loadInceptionStyleModel()
          .then((model) => {
            this.styleNet = model;
          })
          .finally(() => this.enableStylizeButtons());
      }
    };

    this.modelSelectTransformer = document.getElementById(
      "model-select-transformer"
    );
    // @ts-ignore
    this.modelSelectTransformer.onchange = (evt) => {
      // @ts-ignore
      if (evt.target.value === "original") {
        this.disableStylizeButtons();
        this.loadOriginalTransformerModel()
          .then((model) => {
            this.transformNet = model;
          })
          .finally(() => this.enableStylizeButtons());
        // @ts-ignore
      } else if (evt.target.value === "separable") {
        this.disableStylizeButtons();
        this.loadSeparableTransformerModel()
          .then((model) => {
            this.transformNet = model;
          })
          .finally(() => this.enableStylizeButtons());
      }
    };

    this.initalizeWebcamVariables();
    this.initializeStyleTransfer();
    this.initializeCombineStyles();

    Promise.all([
      this.loadMobileNetStyleModel(),
      this.loadSeparableTransformerModel(),
    ]).then(([styleNet, transformNet]) => {
      console.log("Loaded styleNet");
      this.styleNet = styleNet;
      this.transformNet = transformNet;
      this.enableStylizeButtons();
    });
  }

  async loadMobileNetStyleModel() {
    if (!this.mobileStyleNet) {
      this.mobileStyleNet = await tf.loadGraphModel(
        "saved_model_style_js/model.json"
      );
    }

    return this.mobileStyleNet;
  }

  async loadInceptionStyleModel() {
    if (!this.inceptionStyleNet) {
      this.inceptionStyleNet = await tf.loadGraphModel(
        "saved_model_style_inception_js/model.json"
      );
    }

    return this.inceptionStyleNet;
  }

  async loadOriginalTransformerModel() {
    if (!this.originalTransformNet) {
      this.originalTransformNet = await tf.loadGraphModel(
        "saved_model_transformer_js/model.json"
      );
    }

    return this.originalTransformNet;
  }

  async loadSeparableTransformerModel() {
    if (!this.separableTransformNet) {
      this.separableTransformNet = await tf.loadGraphModel(
        "saved_model_transformer_separable_js/model.json"
      );
    }

    return this.separableTransformNet;
  }

  initalizeWebcamVariables() {
    // @ts-ignore
    this.camModal = $("#cam-modal");

    this.snapButton = document.getElementById("snap-button");
    this.webcamVideoElement = document.getElementById("webcam-video");

    // @ts-ignore
    navigator.getUserMedia =
      // @ts-ignore
      navigator.getUserMedia ||
      // @ts-ignore
      navigator.webkitGetUserMedia ||
      // @ts-ignore
      navigator.mozGetUserMedia ||
      // @ts-ignore
      navigator.msGetUserMedia;

    this.camModal.on("hidden.bs.modal", () => {
      this.stream.getTracks()[0].stop();
    });

    this.camModal.on("shown.bs.modal", () => {
      // @ts-ignore
      navigator.getUserMedia(
        {
          video: true,
        },
        // @ts-ignore
        (stream) => {
          this.stream = stream;
          // @ts-ignore
          this.webcamVideoElement.srcObject = stream;
          // @ts-ignore
          this.webcamVideoElement.play();
        },
        // @ts-ignore
        (err) => {
          console.error(err);
        }
      );
    });
  }

  // @ts-ignore
  openModal(element) {
    this.camModal.modal("show");
    // @ts-ignore
    this.snapButton.onclick = () => {
      const hiddenCanvas = document.getElementById("hidden-canvas");
      // @ts-ignore
      const hiddenContext = hiddenCanvas.getContext("2d");
      // @ts-ignore
      hiddenCanvas.width = this.webcamVideoElement.width;
      // @ts-ignore
      hiddenCanvas.height = this.webcamVideoElement.height;
      hiddenContext.drawImage(
        this.webcamVideoElement,
        0,
        0,
        // @ts-ignore
        hiddenCanvas.width,
        // @ts-ignore
        hiddenCanvas.height
      );
      // @ts-ignore
      const imageDataURL = hiddenCanvas.toDataURL("image/jpg");
      element.src = imageDataURL;
      this.camModal.modal("hide");
    };
  }

  initializeStyleTransfer() {
    // Initialize images
    this.contentImg = document.getElementById("content-img");
    // @ts-ignore
    this.contentImg.onerror = () => {
      // @ts-ignore
      alert("Error loading " + this.contentImg.src + ".");
    };
    this.styleImg = document.getElementById("style-img");
    // @ts-ignore
    this.styleImg.onerror = () => {
      // @ts-ignore
      alert("Error loading " + this.styleImg.src + ".");
    };
    this.stylized = document.getElementById("stylized");

    // Initialize images
    this.contentImgSlider = document.getElementById("content-img-size");
    this.connectImageAndSizeSlider(this.contentImg, this.contentImgSlider);
    this.styleImgSlider = document.getElementById("style-img-size");
    this.styleImgSquare = document.getElementById("style-img-square");
    this.connectImageAndSizeSlider(
      this.styleImg,
      this.styleImgSlider,
      this.styleImgSquare
    );

    this.styleRatio = 1.0;
    this.styleRatioSlider = document.getElementById("stylized-img-ratio");
    // @ts-ignore
    this.styleRatioSlider.oninput = (evt) => {
      // @ts-ignore
      this.styleRatio = evt.target.value / 100;
    };

    // Initialize buttons
    this.styleButton = document.getElementById("style-button");
    // @ts-ignore
    this.styleButton.onclick = () => {
      this.disableStylizeButtons();
      this.startStyling().finally(() => {
        this.enableStylizeButtons();
      });
    };
    this.randomizeButton = document.getElementById("randomize");
    // @ts-ignore
    this.randomizeButton.onclick = () => {
      // @ts-ignore
      this.styleRatioSlider.value = getRndInteger(0, 100);
      // @ts-ignore
      this.contentImgSlider.value = getRndInteger(256, 400);
      // @ts-ignore
      this.styleImgSlider.value = getRndInteger(100, 400);
      // @ts-ignore
      this.styleRatioSlider.dispatchEvent(new Event("input"));
      // @ts-ignore
      this.contentImgSlider.dispatchEvent(new Event("input"));
      // @ts-ignore
      this.styleImgSlider.dispatchEvent(new Event("input"));
      if (getRndInteger(0, 1)) {
        // @ts-ignore
        this.styleImgSquare.click();
      }
    };

    // Initialize selectors
    this.contentSelect = document.getElementById("content-select");
    // @ts-ignore
    this.contentSelect.onchange = (evt) =>
      // @ts-ignore
      this.setImage(this.contentImg, evt.target.value);
    // @ts-ignore
    this.contentSelect.onclick = () => (this.contentSelect.value = "");
    this.styleSelect = document.getElementById("style-select");
    // @ts-ignore
    this.styleSelect.onchange = (evt) =>
      // @ts-ignore
      this.setImage(this.styleImg, evt.target.value);
    // @ts-ignore
    this.styleSelect.onclick = () => (this.styleSelect.value = "");
  }

  initializeCombineStyles() {
    // Initialize images
    this.combContentImg = document.getElementById("c-content-img");
    // @ts-ignore
    this.combContentImg.onerror = () => {
      // @ts-ignore
      alert("Error loading " + this.combContentImg.src + ".");
    };
    this.combStyleImg1 = document.getElementById("c-style-img-1");
    // @ts-ignore
    this.combStyleImg1.onerror = () => {
      // @ts-ignore
      alert("Error loading " + this.combStyleImg1.src + ".");
    };
    this.combStyleImg2 = document.getElementById("c-style-img-2");
    // @ts-ignore
    this.combStyleImg2.onerror = () => {
      // @ts-ignore
      alert("Error loading " + this.combStyleImg2.src + ".");
    };
    this.combStylized = document.getElementById("c-stylized");

    // Initialize images
    this.combContentImgSlider = document.getElementById("c-content-img-size");
    this.connectImageAndSizeSlider(
      this.combContentImg,
      this.combContentImgSlider
    );
    this.combStyleImg1Slider = document.getElementById("c-style-img-1-size");
    this.combStyleImg1Square = document.getElementById("c-style-1-square");
    this.connectImageAndSizeSlider(
      this.combStyleImg1,
      this.combStyleImg1Slider,
      this.combStyleImg1Square
    );
    this.combStyleImg2Slider = document.getElementById("c-style-img-2-size");
    this.combStyleImg2Square = document.getElementById("c-style-2-square");
    this.connectImageAndSizeSlider(
      this.combStyleImg2,
      this.combStyleImg2Slider,
      this.combStyleImg2Square
    );

    this.combStyleRatio = 0.5;
    this.combStyleRatioSlider = document.getElementById("c-stylized-img-ratio");
    // @ts-ignore
    this.combStyleRatioSlider.oninput = (evt) => {
      // @ts-ignore
      this.combStyleRatio = evt.target.value / 100;
    };

    // Initialize buttons
    this.combineButton = document.getElementById("combine-button");
    // @ts-ignore
    this.combineButton.onclick = () => {
      this.disableStylizeButtons();
      this.startCombining().finally(() => {
        this.enableStylizeButtons();
      });
    };
    this.combRandomizeButton = document.getElementById("c-randomize");
    // @ts-ignore
    this.combRandomizeButton.onclick = () => {
      // @ts-ignore
      this.combContentImgSlider.value = getRndInteger(256, 400);
      // @ts-ignore
      this.combStyleImg1Slider.value = getRndInteger(100, 400);
      // @ts-ignore
      this.combStyleImg2Slider.value = getRndInteger(100, 400);
      // @ts-ignore
      this.combStyleRatioSlider.value = getRndInteger(0, 100);
      // @ts-ignore
      this.combContentImgSlider.dispatchEvent(new Event("input"));
      // @ts-ignore
      this.combStyleImg1Slider.dispatchEvent(new Event("input"));
      // @ts-ignore
      this.combStyleImg2Slider.dispatchEvent(new Event("input"));
      // @ts-ignore
      this.combStyleRatioSlider.dispatchEvent(new Event("input"));
      if (getRndInteger(0, 1)) {
        // @ts-ignore
        this.combStyleImg1Square.click();
      }
      if (getRndInteger(0, 1)) {
        // @ts-ignore
        this.combStyleImg2Square.click();
      }
    };

    // Initialize selectors
    this.combContentSelect = document.getElementById("c-content-select");
    // @ts-ignore
    this.combContentSelect.onchange = (evt) =>
      // @ts-ignore
      this.setImage(this.combContentImg, evt.target.value);
    // @ts-ignore
    this.combContentSelect.onclick = () => (this.combContentSelect.value = "");
    this.combStyle1Select = document.getElementById("c-style-1-select");
    // @ts-ignore
    this.combStyle1Select.onchange = (evt) =>
      // @ts-ignore
      this.setImage(this.combStyleImg1, evt.target.value);
    // @ts-ignore
    this.combStyle1Select.onclick = () => (this.combStyle1Select.value = "");
    this.combStyle2Select = document.getElementById("c-style-2-select");
    // @ts-ignore
    this.combStyle2Select.onchange = (evt) =>
      // @ts-ignore
      this.setImage(this.combStyleImg2, evt.target.value);
    // @ts-ignore
    this.combStyle2Select.onclick = () => (this.combStyle2Select.value = "");
  }

  // @ts-ignore
  connectImageAndSizeSlider(img, slider, square) {
    // @ts-ignore
    slider.oninput = (evt) => {
      img.height = evt.target.value;
      if (img.style.width) {
        // If this branch is triggered, then that means the image was forced to a square using
        // a fixed pixel value.
        img.style.width = img.height + "px"; // Fix width back to a square
      }
    };
    if (square !== undefined) {
      // @ts-ignore
      square.onclick = (evt) => {
        if (evt.target.checked) {
          img.style.width = img.height + "px";
        } else {
          img.style.width = "";
        }
      };
    }
  }

  // Helper function for setting an image
  // @ts-ignore
  setImage(element, selectedValue) {
    if (selectedValue === "file") {
      console.log("file selected");
      // @ts-ignore
      this.fileSelect.onchange = (evt) => {
        // @ts-ignore
        const f = evt.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          // @ts-ignore
          element.src = e.target.result;
        };
        fileReader.readAsDataURL(f);
        // @ts-ignore
        this.fileSelect.value = "";
      };
      // @ts-ignore
      this.fileSelect.click();
    } else if (selectedValue === "pic") {
      this.openModal(element);
    } else if (selectedValue === "random") {
      const randomNumber = Math.floor(Math.random() * links.length);
      element.src = links[randomNumber];
    } else {
      element.src = "images/" + selectedValue + ".jpg";
    }
  }

  enableStylizeButtons() {
    // @ts-ignore
    this.styleButton.disabled = false;
    // @ts-ignore
    this.combineButton.disabled = false;
    // @ts-ignore
    this.modelSelectStyle.disabled = false;
    // @ts-ignore
    this.modelSelectTransformer.disabled = false;
    // @ts-ignore
    this.styleButton.textContent = "Stylize";
    // @ts-ignore
    this.combineButton.textContent = "Combine Styles";
  }

  disableStylizeButtons() {
    // @ts-ignore
    this.styleButton.disabled = true;
    // @ts-ignore
    this.combineButton.disabled = true;
    // @ts-ignore
    this.modelSelectStyle.disabled = true;
    // @ts-ignore
    this.modelSelectTransformer.disabled = true;
  }

  async startStyling() {
    await tf.nextFrame();
    // @ts-ignore
    this.styleButton.textContent = "Generating 100D style representation";
    await tf.nextFrame();
    let bottleneck = await tf.tidy(() => {
      // @ts-ignore
      return this.styleNet.predict(
        tf.browser
          // @ts-ignore
          .fromPixels(this.styleImg)
          .toFloat()
          .div(tf.scalar(255))
          .expandDims()
      );
    });
    if (this.styleRatio !== 1.0) {
      // @ts-ignore
      this.styleButton.textContent =
        "Generating 100D identity style representation";
      await tf.nextFrame();
      const identityBottleneck = await tf.tidy(() => {
        // @ts-ignore
        return this.styleNet.predict(
          tf.browser
            // @ts-ignore
            .fromPixels(this.contentImg)
            .toFloat()
            .div(tf.scalar(255))
            .expandDims()
        );
      });
      const styleBottleneck = bottleneck;
      bottleneck = await tf.tidy(() => {
        // @ts-ignore
        const styleBottleneckScaled = styleBottleneck.mul(
          // @ts-ignore
          tf.scalar(this.styleRatio)
        );
        // @ts-ignore
        const identityBottleneckScaled = identityBottleneck.mul(
          // @ts-ignore
          tf.scalar(1.0 - this.styleRatio)
        );
        return styleBottleneckScaled.addStrict(identityBottleneckScaled);
      });
      // @ts-ignore
      styleBottleneck.dispose();
      // @ts-ignore
      identityBottleneck.dispose();
    }
    // @ts-ignore
    this.styleButton.textContent = "Stylizing image...";
    await tf.nextFrame();
    const stylized = await tf.tidy(() => {
      // @ts-ignore
      return (
        this.transformNet
          .predict([
            tf.browser
              // @ts-ignore
              .fromPixels(this.contentImg)
              .toFloat()
              .div(tf.scalar(255))
              .expandDims(),
            // @ts-ignore
            bottleneck,
          ])
          // @ts-ignore
          .squeeze()
      );
    });
    // @ts-ignore
    await tf.browser.toPixels(stylized, this.stylized);
    // @ts-ignore
    bottleneck.dispose(); // Might wanna keep this around
    stylized.dispose();
  }

  async startCombining() {
    await tf.nextFrame();
    // @ts-ignore
    this.combineButton.textContent =
      "Generating 100D style representation of image 1";
    await tf.nextFrame();
    const bottleneck1 = await tf.tidy(() => {
      // @ts-ignore
      return this.styleNet.predict(
        tf.browser
          // @ts-ignore
          .fromPixels(this.combStyleImg1)
          .toFloat()
          .div(tf.scalar(255))
          .expandDims()
      );
    });

    // @ts-ignore
    this.combineButton.textContent =
      "Generating 100D style representation of image 2";
    await tf.nextFrame();
    const bottleneck2 = await tf.tidy(() => {
      // @ts-ignore
      return this.styleNet.predict(
        tf.browser
          // @ts-ignore
          .fromPixels(this.combStyleImg2)
          .toFloat()
          .div(tf.scalar(255))
          .expandDims()
      );
    });

    // @ts-ignore
    this.combineButton.textContent = "Stylizing image...";
    await tf.nextFrame();
    const combinedBottleneck = await tf.tidy(() => {
      // @ts-ignore
      const scaledBottleneck1 = bottleneck1.mul(
        // @ts-ignore
        tf.scalar(1 - this.combStyleRatio)
      );
      // @ts-ignore
      const scaledBottleneck2 = bottleneck2.mul(tf.scalar(this.combStyleRatio));
      return scaledBottleneck1.addStrict(scaledBottleneck2);
    });

    const stylized = await tf.tidy(() => {
      // @ts-ignore
      return (
        this.transformNet
          .predict([
            tf.browser
              // @ts-ignore
              .fromPixels(this.combContentImg)
              .toFloat()
              .div(tf.scalar(255))
              .expandDims(),
            combinedBottleneck,
          ])
          // @ts-ignore
          .squeeze()
      );
    });
    // @ts-ignore
    await tf.browser.toPixels(stylized, this.combStylized);
    // @ts-ignore
    bottleneck1.dispose(); // Might wanna keep this around
    // @ts-ignore
    bottleneck2.dispose();
    combinedBottleneck.dispose();
    stylized.dispose();
  }

  async benchmark() {
    const x = tf.randomNormal([1, 256, 256, 3]);
    const bottleneck = tf.randomNormal([1, 1, 1, 100]);

    let styleNet = await this.loadInceptionStyleModel();
    // @ts-ignore
    // @ts-ignore
    let time = await this.benchmarkStyle(x, styleNet);
    styleNet.dispose();

    styleNet = await this.loadMobileNetStyleModel();
    time = await this.benchmarkStyle(x, styleNet);
    styleNet.dispose();

    let transformNet = await this.loadOriginalTransformerModel();
    time = await this.benchmarkTransform(x, bottleneck, transformNet);
    transformNet.dispose();

    transformNet = await this.loadSeparableTransformerModel();
    time = await this.benchmarkTransform(x, bottleneck, transformNet);
    transformNet.dispose();

    x.dispose();
    bottleneck.dispose();
  }

  // @ts-ignore
  async benchmarkStyle(x, styleNet) {
    const profile = await tf.profile(() => {
      tf.tidy(() => {
        const dummyOut = styleNet.predict(x);
        dummyOut.print();
      });
    });
    console.log(profile);
    const time = await tf.time(() => {
      tf.tidy(() => {
        for (let i = 0; i < 10; i++) {
          const y = styleNet.predict(x);
          y.print();
        }
      });
    });
    console.log(time);
  }

  // @ts-ignore
  async benchmarkTransform(x, bottleneck, transformNet) {
    const profile = await tf.profile(() => {
      tf.tidy(() => {
        const dummyOut = transformNet.predict([x, bottleneck]);
        dummyOut.print();
      });
    });
    console.log(profile);
    const time = await tf.time(() => {
      tf.tidy(() => {
        for (let i = 0; i < 10; i++) {
          const y = transformNet.predict([x, bottleneck]);
          y.print();
        }
      });
    });
    console.log(time);
  }
}

// @ts-ignore
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Main;