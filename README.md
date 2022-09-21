# Hyperparameters_Optimization_APP
Most supervised classification algorithms have hyper parameters (the parameters of the algorithm) for example the number k of neighbors in the KNN that must be fixed, they play a very important role in the evaluation of the classification, so we are looking for a technique for optimization by ensuring that the model does not suffer from overfitting which is a problem caused by incorrect sizing of the structure used to classify.

## objective
This APP allows you to classify a Lansat-8 image with the best HyperParameters of SVM with and without texture [link to our exemple](https://ibtissem.users.earthengine.app/view/hyperparameters-optimization-app).

## Technique
The traditional technique for optimizing hyperparameters is the Grid research method. Which consists of testing all the possible combinations of the hyper parameters that
we provided. This is in practice a good method to get consistent results. The Search Grid algorithm must be guided by the evolution of an error metric, usually measured by cross-validation on the learning algorithm.
