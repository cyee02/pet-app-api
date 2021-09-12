#!/bin/bash -xe

# Install Node
curl -o $HOME_DIR/install.sh https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
source $HOME_DIR.bashrc
nvm install 16 -y

# Clone repo
cd $HOME_DIR/pet-app-api
npm install

# Set up nginx
sudo apt-get install nginx -y
sudo rm /etc/nginx/sites-enabled/default
sudo cp $HOME_DIR/pet-app-api/staging/nginx_config /etc/nginx/sites-available/pet-app-api
sudo ln -s /etc/nginx/sites-available/pet-app-api /etc/nginx/sites-enabled/pet-app-api
sudo /etc/init.d/nginx start

# Start server
cd $HOME_DIR/pet-app-api
npm start