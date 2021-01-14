//au chargement de la fenêtre on lance la fonction
window.onload = function()
{

    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 100; //0.10 secondes
    let snakee;
    //on execute la fonction init
    init();

    
//fonction standard pour initialiser des choses
    function init()
    {
        //on créé le canvas
    let canvas = document.createElement('canvas');
    //on donne des dimensions à ce canvas
    canvas.width = canvasWidth; 
    canvas.height = canvasHeight;
    //on le stylise
    canvas.style.border = '1px solid';
    //on l'attache à notre page HTML (on accroche un tag au body -le canvas créé)
    document.body.appendChild(canvas);
    //on dessine dans le canvas en 2D
    ctx = canvas.getContext('2d');
    //on créé la position de base du serpent / qui commence avec 3 blocs
    snakee = new Snake([[6,4],[5,4],[4,4]], "right");
    //on lance la fonction du refresh
    refreshCanvas();
    }

    //function pour animer/rafraichir le canvas
    function refreshCanvas(){
            //on efface le canvas
            ctx.clearRect(0,0,canvasWidth, canvasHeight)
            snakee.advance(); 
            snakee.draw(); //on utilise sa méthode draw
            //on lance la fonction time out pour lancer le refresh tous les 10eme de sec.
            //le rectangle va donc se déplacer tous les 10eme de seconde
            setTimeout(refreshCanvas, delay);
    }

    function drawBlock(ctx, position)
    {
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        //on rempli un rectangle à la position x et y qui correspond au blockSize
        ctx.fillRect(x,y, blockSize, blockSize);
    }

    //fonction constructeur pour créer le prototype de notre serpent
    function Snake(body, direction)
    {
        this.body = body;
        this.direction = direction //nouvelle propriété de direction
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
        this.advance = function()
         {
            let nextPosition = this.body[0].slice(); //on stock dans une variable la copie de la position initiale
            switch(this.direction)
            {
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
            this.body.pop();//on supprime le dernier élément du serpent
         }
         this.setDirection = function(newDirection)
         {
             let allowedDirections ; //= directions permises
             //on défini dans un switch quelles directions sont premises en fonction de la direction actuelle
             //par ex, si le serpent va vers le bas on ne peut que aller à gauche ou à droite
             switch(this.direction)
             {
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
             if(allowedDirections.indexOf(newDirection) >-1 )
             {
                this.direction = newDirection;
             }
         }
    }
    document.onkeydown = function handleKeydown(e){
        let key = e.keyCode;
        let newDirection;
        switch(key)
        {
            case 37: //correspond à la flèche de gauche
                newDirection = "left";
                break;
            case 38: //correspond à la flèche du haut
                newDirection = "up";
                break;
            case 39: //correspond à la flèche de droite
                newDirection = "right";
                break;
            case 40: 0//correspond à la flèche du bas
                newDirection = "down";
                break;
            default:
                return; //sinon on ne continue pas la fonction, tu retournes
        }
        snakee.setDirection(newDirection);
    }
}