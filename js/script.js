//au chargement de la fenêtre on lance la fonction
window.onload = function(){

    let canvasWidth = 900; //on définit la largeur du canvas
    let canvasHeight = 600; //on défini la hauteur du canvas
    let blockSize = 30; //on définit la taille d'un block
    let ctx; //variable pour le contexte
    let delay = 100; //0.10 secondes
    let snakee;
    let applee;
    let widthInBlocks = canvasWidth / blockSize; // 900/30
    let heightInBlocks = canvasHeight / blockSize; // 600/30
    let score;
    let timeout;

    //on execute la fonction init au chargement de la page
    init();

    
//fonction standard pour initialiser des choses
    function init(){
    //on créé le canvas
    let canvas = document.createElement('canvas');
    //on donne des dimensions à ce canvas
    canvas.width = canvasWidth; 
    canvas.height = canvasHeight;
    //on le stylise
    canvas.style.border = '30px solid gray';
    canvas.style.display='block';
    canvas.style.margin = '50px auto';
    canvas.style.backgroundColor = '#ddd';
    //on l'attache à notre page HTML (on accroche un tag au body -le canvas créé)
    document.body.appendChild(canvas);
    //on dessine dans le canvas en 2D
    ctx = canvas.getContext('2d');
    //on créé la position de base du serpent / qui commence avec 3 blocs
    snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
    applee = new Apple([10,10]);
    score = 0;
    //on lance la fonction du refresh
    refreshCanvas();
    }
    

    //function pour animer/rafraichir le canvas
    function refreshCanvas(){
        snakee.advance();
            if (snakee.checkCollision()){
                gameOver();
            }else{
                if(snakee.isEatingApple(applee)) //est-ce que le serpent a mangé la pomme 
                {
                    snakee.ateApple = true;
                    score++;
                    do
                    {
                    applee.setNewPosition(); //on remplace la position de la pomme                        
                    }
                    while(applee.isOnSnake(snakee)) //si la pomme est sur le serpent, on redonne une nouvelle position
                }
                 //on efface le canvas
                ctx.clearRect(0,0,canvasWidth, canvasHeight)
                drawScore();
                snakee.draw(); //on utilise sa méthode draw
                applee.draw();

                //on lance la fonction time out pour lancer le refresh tous les 10eme de sec.
                //le rectangle va donc se déplacer tous les 10eme de seconde
                timeout = setTimeout(refreshCanvas, delay);
            }
           
    }
    function gameOver(){
        ctx.save();
        ctx.font = 'bold 70px sans-serif';
        ctx.fillStyle = 'black';
        ctx.strokeStyle = "white";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth=5;
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        ctx.strokeText("Game Over", centerX, centerY -180);
        ctx.fillText("Game Over",  centerX, centerY -180);
        
        ctx.font = 'bold 30px sans-serif';
        ctx.strokeText("Appuyez sur la touche 'espace' pour rejouer", centerX, centerY - 120);
        ctx.fillText("Appuyez sur la touche 'espace' pour rejouer",  centerX, centerY - 120);
        ctx.restore();
    }

    function restart(){
    //on recréé la position de base du serpent / qui commence avec 3 blocs
    snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
    applee = new Apple([10,10]);
    score = 0;
    clearTimeout(timeout);
    //on lance la fonction du refresh
    refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = 'bold 100px sans-serif';
        ctx.fillStyle = 'gray';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }

    function drawBlock(ctx, position){
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        //on rempli un rectangle à la position x et y qui correspond au blockSize
        ctx.fillRect(x,y, blockSize, blockSize);
    }

    //fonction constructeur pour créer le prototype de notre serpent
    function Snake(body, direction){
        this.body = body;
        this.direction = direction //nouvelle propriété de direction
        this.ateApple = false; //pour savoir si le serpent a mangé une pomme
        this.draw = function() //création d'une méthode pour dessiner le corps du serpent dans le canvas
        {
            ctx.save(); //on sauvegarde le contenu du base du canvas
            ctx.fillStyle = '#ff0000'; //on défini la couleur du serpent
            //on dessine chacun des blocs grâce à une boucle
            for(let i = 0; i<this.body.length; i++) //tant que le i est inf. au body du serpent alors i++
            {
                drawBlock(ctx, this.body[i]); // (contexte du canvas, la position du bloc à dessiner)
            };
            ctx.restore(); //permet de garder le contexte comme il était avant 
        }
        //méthode pour faire avancer le serpent
        this.advance = function(){
            let nextPosition = this.body[0].slice(); //on stock dans une variable la copie de la position initiale
            switch(this.direction){
                case "left":
                    nextPosition[0] -=1;
                    break;
                case "right":
                    nextPosition[0] +=1;
                    break;
                case "down":
                    nextPosition[1] +=1;
                    break;
                case "up":
                    nextPosition[1] -=1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition); //permet de rajouter ce qui est entre parenthèse à la premiere classe
            if(!this.ateApple){ //si le serpent a mangé à une pomme
                this.body.pop();//on supprime le dernier élément du serpent
            } else{
                this.ateApple = false;
            }
           
         }
         this.setDirection = function(newDirection){
             let allowedDirections ; //= directions permises
             //on défini dans un switch quelles directions sont premises en fonction de la direction actuelle
             //par ex, si le serpent va vers le bas on ne peut que aller à gauche ou à droite
             switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ['up', 'down'];
                    break;
                case "down":
                case "up":
                    
                    allowedDirections = ['left', 'right'];
                    break;
                default:
                    throw("Invalid Direction");
             }
             if(allowedDirections.indexOf(newDirection) >-1 ){
                this.direction = newDirection;
             }
         }

         this.checkCollision = function(){
             let wallCollision = false;
             let snakeCollision = false;
             let head = this.body[0];//on retire la tete du serpent lors de la collision
             let rest = this.body.slice(1);
             let snakeX = head[0];
             let snakeY = head[1];
             let minX = 0;
             let minY = 0;
             let maxX = widthInBlocks -1;
             let maxY = heightInBlocks -1;
             let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; // coordonnée x de la tête du serpent < 0 ou tête du serpent > à la largeur max du canvas
             let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY; // coordonnée y de la tête du serpent < 0 ou tête du serpent > à la largeur max du canvas

             if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) // est-ce que serpent sort du canvas à l'Horiz. ou à la Vert.
             {
                 wallCollision = true; // si oui il y a collision
             }

             for(let i= 0; i < rest.lenght ; i++){
                 if (snakeX === rest[i][0] && snakeY === rest[i][1]) //je vérifie si la tete ou le reste du corps ont le meme X ou le meme Y
                 {
                     snakeCollision = true; // si oui il y a collision
                 }
             }
             return wallCollision || snakeCollision;
         };

        this.isEatingApple = function(appleToEat)//est-ce qu'il est entrain de manger une pomme? (par rapport à sa position)
         {
             //on vérifie si le serpent a mangé la pomme
             let head = this.body[0]; // tête = à la place 0
             if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) //si le X de la tete est = au X de la pomme & si le Y de la tete est = au Y de la pomme
                return true;
             else
                 return false;
         }
    }

    //création de la pomme
    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            //on calcule le rayon du cercle de la pomme
            let radius = blockSize / 2;
            //on défini les points x et y du rayon
            let x = this.position[0]*blockSize + radius;
            let y = this.position[1]*blockSize + radius;
            //on dessine le cercle
            ctx.arc(x,y,radius,0,Math.PI*2, true);
            //on rempli le cercle
            ctx.fill();
            ctx.restore();
        }
        this.setNewPosition = function() //on va donner une nouvelle position à la pomme de façon aléatoire
        {
            let newX = Math.round(Math.random() * (widthInBlocks - 1)); //on créé une nouvelle variable et on calcule une position X aléatoire (largeur)
            let newY = Math.round(Math.random() * (heightInBlocks - 1)); //on créé une nouvelle variable et on calcule une position Y aléatoire (hauteur)
            this.position = [newX, newY]; // on attribue la nouvelle position à la pomme
        }
        this.isOnSnake = function(snakeToCheck) //on veut vérifier si la pomme se situe sur le serpent
        {
            let isOnSnake = false;

            for(let i=0; i<snakeToCheck.body.lenght; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])//est-ce que le X de ma pomme est sur le X du serpent - pareil pour le Y
                {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }
    //fonction pour gérer la direction du snake avec le clavier
    document.onkeydown = function handleKeydown(e){
        let key = e.keyCode;
        let newDirection;
        switch(key){
            case 37: //correspond à la flèche de gauche
                newDirection = "left";
                break;
            case 38: //correspond à la flèche du haut
                newDirection = "up";
                break;
            case 39: //correspond à la flèche de droite
                newDirection = "right";
                break;
            case 40: //correspond à la flèche du bas
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return; //sinon on ne continue pas la fonction, tu retournes
        }
        snakee.setDirection(newDirection);
    }
}