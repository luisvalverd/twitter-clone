#!/bin/bash

#sudo lsof -i -P -n
#sudo kill -9 [pid]
#konsole --noclose -e /home/luchifer120/projects/twitter-clone/client npm run serve

server="/home/luchifer120/projects/twitter-clone/server/serve-start"
client="/home/luchifer120/projects/twitter-clone/client/start-client"
server_chat="/home/luchifer120/projects/twitter-clone/chat-server/start-chat"

docker=$(sudo docker ps | tail -n +2 | wc -l)

if [[ $docker -eq 0 ]]; then
	(
	sudo docker start dev-clone-twitter ; 
	sudo docker start chat-mongo ;
	#sudo docker start redis-users ;
	)
fi
# initialization code
(
	code ./server ;
	code ./client ;
	code ./chat-server ;
)

(
	# initialization servers
	konsole --hold --nofork --workdir ./server -e "bash $server" & 
	konsole --hold --nofork --workdir ./client -e "bash $client" &
	konsole --hold --nofork --workdir ./chat-server -e "bash $server_chat" &
)


