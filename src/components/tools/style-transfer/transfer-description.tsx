const TransferDescription = () => {
  return (
    <section className="container-fluid bg-gray-100 pt-5">
      <div className="row pt-5">
        <div className="col-md-4 offset-md-4">
          <h5 className="text-lg font-semibold">What is this?</h5>
          <p>
            This is an implementation of an arbitrary style transfer algorithm
            running purely in the browser using TensorFlow.js. As with all
            neural style transfer algorithms, a neural network attempts to
            &quot;draw&quot; one picture, the Content (usually a photograph), in
            the style of another, the Style (usually a painting).
          </p>
          <p>
            Although{" "}
            <a href="https://github.com/reiinakano/fast-style-transfer-deeplearnjs">
              other browser implementations
            </a>{" "}
            of style transfer exist, they are normally limited to a pre-selected
            handful of styles, due to the requirement that a separate neural
            network must be trained for each style image.
          </p>
          <p>
            Arbitrary style transfer works around this limitation by using a
            separate <i>style network</i> that learns to break down <i>any</i>{" "}
            image into a 100-dimensional vector representing its style. This
            style vector is then fed into another network, the{" "}
            <i>transformer network</i>, along with the content image, to produce
            the final stylized image.
          </p>
        </div>
      </div>
      <div className="row pt-5">
        <div className="col-md-4 offset-md-4">
          <h5 className="text-lg font-semibold">
            Is my data safe? Can you see my pictures?
          </h5>
          <p>
            Your data and pictures here never leave your computer! In fact, this
            is one of the main advantages of running neural networks in your
            browser. Instead of sending us your data, we send *you* both the
            model *and* the code to run the model. These are then run by your
            browser.
          </p>
        </div>
      </div>
      <div className="row pt-5">
        <div className="col-md-4 offset-md-4">
          <h5 className="text-lg font-semibold">
            What are all these different models?
          </h5>
          <p>
            The original paper uses an Inception-v3 model as the style network,
            which takes up ~36.3MB when ported to the browser as a FrozenModel.
          </p>
          <p>
            In order to make this model smaller, a MobileNet-v2 was used to
            distill the knowledge from the pre trained Inception-v3 style
            network. This resulted in a size reduction of just under 4x, from
            ~36.3MB to ~9.6MB, at the expense of some quality.
          </p>
          <p>
            For the transformer network, the original paper uses a model using
            plain convolution layers. When ported to the browser, this model
            takes up 7.9MB and is responsible for the majority of the
            calculations during stylization.
          </p>
          <p>
            In order to make the transformer model more efficient, most of the
            plain convolution layers were replaced with depth-wise separable
            convolutions. This reduced the model size to 2.4MB, while
            drastically improving the speed of stylization.
          </p>
          <p>
            This demo lets you use any combination of the models, defaulting to
            the MobileNet-v2 style network and the separable convolution
            transformer network.
          </p>
        </div>
      </div>
      <div className="row pt-5">
        <div className="col-md-4 offset-md-4">
          <h5 className="text-lg font-semibold">
            How big are the models I&apos;m downloading?
          </h5>
          <p>
            The distilled style network is ~9.6MB, while the separable
            convolution transformer network is ~2.4MB, for a total of ~12MB.
            Since these models work for any style, you only have to download
            them once!
          </p>
        </div>
      </div>
      <div className="row pt-5">
        <div className="col-md-4 offset-md-4">
          <h5 className="text-lg font-semibold">
            How does style combination work?
          </h5>
          <p>
            Since each style can be mapped to a 100-dimensional style vector by
            the style network, we simply take a weighted average of the two to
            get a new style vector for the transformer network.
          </p>
          <p>
            This is also how we are able to control the strength of stylization.
            We take a weighted average of the style vectors of <i>both</i>{" "}
            content and style images and use it as input to the transformer
            network.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TransferDescription;
