def standardize_input(value, mean, std):
    """Standardize a single input value based on mean and standard deviation."""
    return (value - mean) / std


def standardize_inputs(inputs, scaler):
    """
    Standardize multiple inputs based on their respective means and standard deviations.

    Args:
    - inputs: A tuple of the numeric values to be standardized (input1, input2, input3, input4).
    - scaler: An object containing the mean (`mean_`) and standard deviation (`scale_`) for the inputs.

    Returns:
    - A list of the standardized values.
    """
    standardized_values = []
    for i, value in enumerate(inputs):
        mean = scaler.mean_[i]
        std = scaler.scale_[i]
        standardized_values.append(standardize_input(value, mean, std))
    return standardized_values


def rfPrediction(cards_remaining, dealer_up, true_count, initial_sum, double, rf, scaler):
    inputs = (cards_remaining, dealer_up, true_count, initial_sum, double)
    standardized_inputs = standardize_inputs(inputs, scaler)
    try:
        move = rf.predict([standardized_inputs])[0]
    except Exception as e:
        raise ValueError(f"Error during prediction: {str(e)}")

    if move == 1:
        return "Stand"
    elif move == 2:
        return "Hit"
    elif move == 3:
        return "Double"
    elif move == 4:
        return "Split"
    else:
        return "Error"


# 1 - stand, 2 - hit, 3 - double, 4 - split
def lrPrediction(cards_remaining, dealer_up, true_count, initial_sum, double, lr):
    move = lr.predict([standardize_inputs(
        cards_remaining, dealer_up, true_count, initial_sum, double)])[0]

    if move == 1:
        return "Stand"
    elif move == 2:
        return "Hit"
    elif move == 3:
        return "Double"
    elif move == 4:
        return "Split"
    else:
        return "Error"


def knnPrediction(cards_remaining, dealer_up, true_count, initial_sum, double, knn):
    move = knn.predict([standardize_inputs(
        cards_remaining, dealer_up, true_count, initial_sum, double)])[0]

    if move == 1:
        return "Stand"
    elif move == 2:
        return "Hit"
    elif move == 3:
        return "Double"
    elif move == 4:
        return "Split"
    else:
        return "Error"
