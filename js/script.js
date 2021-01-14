//au chargement de la fenêtre on lance la fonction
window.onload = function(){

    let canvas;
    let ctx;
    let delay = 100; //0.10 secondes
    let xCoord = 0;
    let yCoord = 0;
    //on execute la fonction init
    init();

    
//fonction standard pour initialiser des choses
    function init(){
        //on créé le canvas
    canvas = document.createElement('canvas');
    //on donne des dimensions à ce canvas
    canvas.width = 900; 
    canvas.height = 600;
    //on le stylise
    canvas.style.border = '1px solid';
    //on l'attache à notre page HTML (on accroche un tag au body -le canvas créé)
    document.body.appendChild(canvas);
    //on dessine dans le canvas en 2D
    ctx = canvas.getContext('2d');
        refreshCanvas();

    //function pour animer/rafraichir le canvas
    function refreshCanvas(){
            xCoord += 2;
            yCoord +=2;
            //on efface le canvas
            ctx.clearRect(0,0,canvas.width, canvas.height)
            //on choisi la couleur avec laquelle on va dessiner
            ctx.fillStyle = '#ff0000';
            //on va créer un petit rectangle
            ctx.fillRect(xCoord,yCoord,100,50);
            //on lance la fonction time out pour lancer le refresh tous les 10eme de sec.
            //le rectangle va donc se déplacer tous les 10eme de seconde
            setTimeout(refreshCanvas, delay);
    }
    }
}