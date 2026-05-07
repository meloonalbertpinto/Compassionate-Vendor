Please run these two commands in your terminal (one after the other):

cd fruit_project

1. Re-train the model (Wait for this to finish, it might take 5-10 minutes):

powershell

python step3_train.py

2. Run the Nutrition Analyst again:

powershell

python nutrition_analyst_v2.py


# 1. This will now put the new images cleanly into their own 'Salad' and 'Sandwich' subfolders!

python download_images.py

# 2. This will map the labels for the new folders automatically

python auto_label.py

# 3. Time to train the generic AI!

python step3_train.py

# 4. Test it out!

python nutrition_analyst_v2.py