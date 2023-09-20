const CombineTwoStyles = () => {
  return (
    <p>Test</p>
    // <div
    //   className="tab-pane fade"
    //   id="combine"
    //   role="tabpanel"
    //   aria-labelledby="combine-tab"
    // >
    //   <div className="container">
    //     <div className="row my-4">
    //       <div className="col mx-5 my-4">
    //         <img
    //           id="c-style-img-1"
    //           className="centered"
    //           crossOrigin="anonymous"
    //           src="/img/style_transfer/stripes.jpg"
    //           height={256}
    //         />
    //         <br />
    //         <label htmlFor="c-style-img-1-size">Style A Size</label>
    //         <i
    //           className="far fa-question-circle"
    //           data-toggle="tooltip"
    //           data-placement="top"
    //           title="Changing the size of a style image usually affects the texture 'seen' by the network."
    //         ></i>
    //         <input
    //           id="c-style-1-square"
    //           type="checkbox"
    //           className="float-right align-middle"
    //           data-toggle="tooltip"
    //           data-placement="top"
    //           title="Force image to square"
    //         />
    //         <input
    //           type="range"
    //           min="100"
    //           max="400"
    //           value="256"
    //           className="custom-range centered"
    //           id="c-style-img-1-size"
    //         />
    //         <br />
    //         <select
    //           id="c-style-1-select"
    //           className="centered custom-select"
    //           defaultValue={"stripes"}
    //         >
    //           <option value="" disabled>
    //             Select a style
    //           </option>
    //           <option value="file">Select from file</option>
    //           <option value="random">Random image from wikiart.org</option>
    //           <option value="udnie">udnie</option>
    //           <option value="stripes">stripes</option>
    //           <option value="bricks">bricks</option>
    //           <option value="clouds">clouds</option>
    //           <option value="towers">towers</option>
    //           <option value="sketch">sketch</option>
    //           <option value="seaport">seaport</option>
    //           <option value="red_circles">red_circles</option>
    //           <option value="zigzag">zigzag</option>
    //         </select>
    //       </div>
    //       <div className="col mx-5 my-4">
    //         <img
    //           id="c-style-img-2"
    //           className="centered"
    //           crossOrigin="anonymous"
    //           src="/img/style_transfer/bricks.jpg"
    //           height={256}
    //         />
    //         <br />
    //         <label htmlFor="c-style-img-2-size">Style B Size</label>
    //         <i
    //           className="far fa-question-circle"
    //           data-toggle="tooltip"
    //           data-placement="top"
    //           title="Changing the size of a style image usually affects the texture 'seen' by the network."
    //         />
    //         <input
    //           id="c-style-2-square"
    //           type="checkbox"
    //           className="float-right align-middle"
    //           data-toggle="tooltip"
    //           data-placement="top"
    //           title="Force image to square"
    //         />
    //         <input
    //           type="range"
    //           min="100"
    //           max="400"
    //           value="256"
    //           className="custom-range centered"
    //           id="c-style-img-2-size"
    //         />
    //         <br />
    //         <select
    //           id="c-style-2-select"
    //           className="centered custom-select"
    //           defaultValue={"bricks"}
    //         >
    //           <option value="" disabled>
    //             Select a style
    //           </option>
    //           <option value="file">Select from file</option>
    //           <option value="random">Random image from wikiart.org</option>
    //           <option value="udnie">udnie</option>
    //           <option value="stripes">stripes</option>
    //           <option value="bricks">bricks</option>
    //           <option value="clouds">clouds</option>
    //           <option value="towers">towers</option>
    //           <option value="sketch">sketch</option>
    //           <option value="seaport">seaport</option>
    //           <option value="red_circles">red_circles</option>
    //           <option value="zigzag">zigzag</option>
    //         </select>
    //       </div>
    //     </div>
    //     <div className="row my-4">
    //       <div className="col-md-6 offset-md-3">
    //         <img
    //           id="c-content-img"
    //           className="centered"
    //           src="/img/style_transfer/statue_of_liberty.jpg"
    //           height={256}
    //         />
    //         <br />
    //         <label htmlFor="c-content-img-size">Content image size</label>
    //         <i
    //           className="far fa-question-circle"
    //           data-toggle="tooltip"
    //           data-placement="top"
    //           title="A bigger content image results in a more detailed output, but increases the processing time significantly."
    //         ></i>
    //         <input
    //           type="range"
    //           min="256"
    //           max="400"
    //           value="256"
    //           className="custom-range centered"
    //           id="c-content-img-size"
    //         />
    //         <br />
    //         <select
    //           id="c-content-select"
    //           className="centered custom-select"
    //           defaultValue={"statue_of_liberty"}
    //         >
    //           <option value="" disabled>
    //             Select content
    //           </option>
    //           <option value="pic">Take a picture</option>
    //           <option value="file">Select from file</option>
    //           <option value="stata">stata</option>
    //           <option value="diana">diana</option>
    //           <option value="golden_gate">golden_gate</option>
    //           <option value="beach">beach</option>
    //           <option value="chicago">chicago</option>
    //           <option value="statue_of_liberty">statue_of_liberty</option>
    //         </select>
    //       </div>
    //     </div>
    //     <div className="row my-4">
    //       <div className="col-md-6 offset-md-3">
    //         <canvas id="c-stylized" className="centered"></canvas>
    //         <br />
    //         <label htmlFor="c-stylized-img-ratio">Stylization Ratio</label>
    //         <i
    //           className="far fa-question-circle"
    //           data-toggle="tooltip"
    //           data-placement="top"
    //           title="This parameter affects the strength of the two styles relative to each other. This is done via interpolation between the style vectors of the two style images."
    //         ></i>
    //         <input
    //           type="range"
    //           min="0"
    //           max="100"
    //           value="50"
    //           className="custom-range centered"
    //           id="c-stylized-img-ratio"
    //         />
    //       </div>
    //     </div>
    //     <div className="row my-4">
    //       <div className="col-md-5 offset-md-3">
    //         <button
    //           disabled
    //           id="combine-button"
    //           type="button"
    //           className="btn btn-primary btn-block"
    //         >
    //           Loading stylization model. Please wait..
    //         </button>
    //       </div>
    //       <div className="col-md-1">
    //         <button
    //           type="button"
    //           id="c-randomize"
    //           className="btn btn-light btn-block"
    //         >
    //           <i
    //             className="fas fa-random"
    //             data-toggle="tooltip"
    //             data-placement="top"
    //             title="Randomize parameters"
    //           ></i>
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default CombineTwoStyles;
