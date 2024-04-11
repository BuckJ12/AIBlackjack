def standardize_input(value, mean, std):
    """Standardize a single input value based on mean and standard deviation."""
    return (value - mean) / std

def standardize_inputs(scaler):
    """
    Standardize four inputs based on their respective means and standard deviations.
    
    Args:
    - input1 (cards), input2 (dealer_up), input3 (count), input4 (isum): The numeric values to be standardized.
    - stats: A list of tuples, where each tuple contains the mean and standard deviation
             for the inputs in the order (mean, std). It's expected to have 4 tuples.
             
    Returns:
    - A list of the standardized values.
    """
    standardized_values = []
    stats = [(scaler.mean_[0], scaler.scale_[0]), (scaler.mean_[1], scaler.scale_[1]), (scaler.mean_[2], scaler.scale_[2]), (scaler.mean_[3], scaler.scale_[3]), (scaler.mean_[4], scaler.scale_[4])]  # Example stats: [(mean1, std1), (mean2, std2), ...]
    
    for i, (mean, std) in enumerate(stats):
        value = locals()[f'input{i+1}']
        standardized_values.append(standardize_input(value, mean, std))
    
    return standardized_values




# 1 - stand, 2 - hit, 3 - double, 4 - split
def lrPrediction(cards_remaining, dealer_up, true_count, initial_sum, double, lr):
    move = lr.predict([standardize_inputs(cards_remaining, dealer_up, true_count, initial_sum, double)])[0]
    
    if move == 1: return "Stand"
    elif move == 2: return "Hit"
    elif move == 3: return "Double"
    elif move == 4: return "Split"
    else: return "Error"

def knnPrediction(cards_remaining, dealer_up, true_count, initial_sum, double, knn):
    move = knn.predict([standardize_inputs(cards_remaining, dealer_up, true_count, initial_sum, double)])[0]
    
    if move == 1: return "Stand"
    elif move == 2: return "Hit"
    elif move == 3: return "Double"
    elif move == 4: return "Split"
    else: return "Error"

def rfPrediction(cards_remaining, dealer_up, true_count, initial_sum, double, rf):
    move = rf.predict([standardize_inputs(cards_remaining, dealer_up, true_count, initial_sum, double)])[0]
    
    if move == 1: return "Stand"
    elif move == 2: return "Hit"
    elif move == 3: return "Double"
    elif move == 4: return "Split"
    else: return "Error"