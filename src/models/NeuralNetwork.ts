import * as tf from "@tensorflow/tfjs";

/**
 * NeuralNetwork class to control the car using AI.
 */
export default class NeuralNetwork {
  model: tf.Sequential;

  constructor(inputSize: number) {
    this.model = tf.sequential();

    // Hidden layer 1
    this.model.add(tf.layers.dense({
      inputShape: [inputSize],
      units: 16,
      activation: "relu",
      kernelInitializer: "heNormal"
    }));

    // Hidden layer 2
    this.model.add(tf.layers.dense({
      units: 16,
      activation: "relu",
      kernelInitializer: "heNormal"
    }));

    // Output layer: steering, acceleration, braking
    this.model.add(tf.layers.dense({
      units: 3,
      activation: "tanh"
    }));
  }

  /**
   * Make predictions based on sensor input.
   */
  async predict(inputs: number[]) {
    const tensor = tf.tensor2d([inputs]);
    const output = this.model.predict(tensor) as tf.Tensor;
    return (await output.array()) as number[][];
  }

  /**
   * Train the model on collected data.
   */
  async train(inputs: number[][], labels: number[][]) {
    this.model.compile({
      optimizer: tf.train.adam(),
      loss: "meanSquaredError"
    });
    await this.model.fit(tf.tensor2d(inputs), tf.tensor2d(labels), {
      epochs: 20
    });
  }

  /**
   * Save the trained model to local storage.
   */
  async saveModel() {
    await this.model.save('localstorage://car-ai-model');
  }

  /**
   * Load a saved model from local storage.
   */
  static async loadModel() {
    const model = await tf.loadLayersModel('localstorage://car-ai-model') as tf.Sequential;
    const nn = new NeuralNetwork(0);
    nn.model = model;
    return nn;
  }
}
