#!/bin/bash 

sudo docker-compose down
sudo docker build ./sutom -t chleo/sutom
sudo docker build ./score -t chleo/score
sudo docker build ./login -t chleo/login
sudo docker-compose up -d
