# Hyperparameters_Optimization_APP
Most supervised classification algorithms have hyper parameters (the parameters of the algorithm) for example the number k of neighbors in the KNN that must be fixed, they play a very important role in the evaluation of the classification, so we are looking for a technique for optimization by ensuring that the model does not suffer from overfitting which is a problem caused by incorrect sizing of the structure used to classify.

## objective
This APP allows you to classify a Lansat-8 image with Random Forest, Cart or Svm with the best HyperParameters with and without texture [link to our exemple](https://ibtissem.users.earthengine.app/view/hyperparameters-optimization-app).
![Platforme](https://github.com/user-attachments/assets/16f2c0aa-7bb6-495c-ad59-9ab8c5963b00)

## Technique
The traditional technique for optimizing hyperparameters is the Grid research method. Which consists of testing all the possible combinations of the hyper parameters that
we provided. This is in practice a good method to get consistent results. The Search Grid algorithm must be guided by the evolution of an error metric, usually measured by cross-validation on the learning algorithm.

## K fold Cross-validation
Is a set of methods whose purpose is either to calibrate the parameters of a model, or to estimate its reliability and its validity. It is based on sampling techniques, the most common of which are: Cross-validation of k iterations (k fold validation), it consists of randomly dividing the set of training data into separate partitions of equal size; mutual exclusives. Then we train model into products using one of the subsets as the test dataset and the remainder (k-1) as the training data set. We repeat this procedure k times, each time using one of the subsets as the test set.
Finally, on the average of the k results (it is also called error of generalization) to produce a single assessment of model performance. Every validation test, the parameters of the model change according to a research grid predefined. Parameters that obtained the lowest generalization error on average will be saved to perform the final training on the test data. We use this method and it is currently the most classic in Machine Learning.
![Dataset](https://user-images.githubusercontent.com/101288856/192164692-928a1a87-2407-4fca-896e-82b0df3b5eac.png)
