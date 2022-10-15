#!/bin/bash 

docker-compose down
docker build ./sutom -t chleo/sutom
docker build ./score -t chleo/score
docker build ./login -t chleo/login
docker-compose up -d
