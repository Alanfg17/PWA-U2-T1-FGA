let principal = $('principal')
let notice = $('notice')


$('.btn-seguir').on('click', function(e){
    e.preventDefault();
    console.log('btn-seguir');
    notice.fadeIn('slow',function() {
        principal.slideUp(1000);
    });
});

$('.btn-regresar').on('click', function() {
   
    notice.fadeOut(function(){

        principal.slideDown(1000);
    });

    
});

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('../sw.js')
}
