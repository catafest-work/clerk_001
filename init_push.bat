# Initialize a new git repository if not already initialized
git init

# Add the remote repository URL
git remote add origin https://github.com/catafest-work/clerk_001.git

# Add all changes to the staging area
git add .

# Commit the changes with a message
git commit -m "Init first commit message"

# Push the changes to the remote repository
git push origin main


# Pull the latest changes from the remote repository
git pull origin main

# Add all changes to the staging area
git add .

# Commit the changes with a message
git commit -m "Your commit message"

# Push the changes to the remote repository
git push -u origin main

# Check the current branch name
git branch

# If the branch is not named 'main', rename it to 'main'
git branch -m main

# Add the remote repository URL if not already added
git remote add origin https://github.com/catafest-work/clerk_001.git

# Add all changes to the staging area
git add .

# Commit the changes with a message
git commit -m "Your commit message"

# Push the changes to the remote repository
git push -u origin main