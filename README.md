# SUTOM
_Microservices Project by CHEVRIER Chléo and MAURICE Ambre\
CY Tech, October 2022_

SUTOM is a study project. It's a reproduction of the game MOTUS.\
The main rule of the game is to find the word with the least amount of tests.\
The player also has the possibility to register, and to see his score.

# The SUTOM architecture


__Sequence diagram of the project__
![alt Sequence Diagram](mermaid-diagram-2022-10-21-151223.png) \

The project is made with 3 microservices:
* the Sutom microservice, is used to play the game,
* the Score microservice, is used to compute and share the score to the Sutom microservice,
* the Login microservice, is used to login/register the user and share information to Sutom microservice.

## About the Sutom microservice
- Server: localhost

- Port used: 3000

- API used: Sutom

Its main use is to implement the game sutom. It computes the word of the days. When the player sends his word proposal, the microservice will verify the word. 

It is also used to communicate with other microservices. The microservice will verify if the user is connected. If not it will redirect the user to the login page. To do this operation, the server need to communicate with the microservice login. After some verifications the login microservice will send all user's informations, included token, id, name/pseudo, to the sutom microservice. The sutom microservices will save these informations to the session. It can also communicate with the score microservice. As example when the user asks for his score, the serveur will send a request to the score microservice. The score microservice will send the user's stats.  

## About the Score microservice
- Server: localhost

- Port used: 5000

- API used: Score with 1 parameter (user id).

The API will store the statistics of each user. E.g, it stores the number of words fund, the number of attempts, the average of attempt and the user id. This microservice will also update these informations when the user send his word to the sutom microservice. The sutom microservice will after send some informations to the score microservice and it will update the score. Moreover, it can also share the statistics of a players to the sutom microservice.  
 
## About the Login Microservice
- Server: localhost

- Port used: 8000

- API used: Login

This API is used to autentificate the user. The server stores the id, password (hash) of each user and the connection token (which is expired after 15 min). 
When the user tries to play but he is not connected, it's automatically redirect to this API. The user can choose to login or register. When the user enters his pseudo and password, the serveur will verify his informations and/or it will save his datas. The user's informations are store in the session. Moreover, the Login microservices generate the token used to know if the user is connected. The token is expired after 15 min. The API will also share the user's informations like his id, pseudo and token.        

# How RUN the Project ?

In the root folder you can find the start.sh file. To run the entire project you can just use the following command.  
```
./start.sh
```
After that you can connect to http://localhost:3000/ in a browser to see the website. 

# Improvement

This is some idea of improvement 
- Improve the security of the score
- Add monitoring (grafana, loki...)
- Add some other plays 
