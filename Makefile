run: 
    docker run -d -p 4444:4444 -v monop:/app/data --rm --name monopolyback gubinruslan1986/monopolyback
run-dev: 
    docker run -d -p 4444:4444 -v "D:\WebProjects\Frontend\monopoly-backend:/app" -v /app/node_modules:/app/node_modules --rm --name monopolyback gubinruslan1986/monopolyback
stop: 
		docker stop monopolyback		


work-dev:
docker run -d -p 4444:4444 -v "D:\WebProjects\Frontend\monopoly-backend:/usr/src/app" -v /usr/src/app/node_modules --rm --name monopolyback gubinruslan1986/monopolyback