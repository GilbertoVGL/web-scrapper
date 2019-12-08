# web-scrapper
A node.js web-scrapper.

This is a web scrapper builded with JavaScript, Node.js, Vue.js, using technologies I actually work with.

Steps:

  1 - Select the type of data you want to look for, there are four types;
  
    1.1 - Images from google images;
    
    1.2 - Images from a given website;
    
    1.3 - Car prices from OLX, then you must give car name/model;
    
    1.4 - Realtys prices from OLX (at this given moment it's only looking for realtys in Goiânia, for a specific purpose)
    
obs.: For purposes of development of the tools, only option 1.4 is currently working.
To Run:

  Clone the repository;
  
  go to the client folder and run npm install;
  
  go to the server folder and run npm install;

  you'll need docker and docker-compose installed in order to run the project.
  after you get it installed: 
  
  - Go to the project root folder and run docker-compose up;
  
  - Go to client folder and run npm run dev;

  - Go to server folder (if you have nodemon installed) run nodemon -w ./ ;
  


