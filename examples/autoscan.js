jQuery($ => {
    let SERVER_URL = 'https://demo.scanface.ru';
    let IMAGE_API_URL = SERVER_URL + '/image-api';
    let $sendImageButton = $('.t756__btn');
    let $textBlock = $('.t167__text');
    let $textLabels = $('.t678 .t-checkbox__control');
    let $valuesInput = $('.t678 input[name="values"]');
    let $imageInput = $('.t678 input[name="image"]');
    let $image = $('.t167__img');
    let $formWithButtonClose = $('.t756 .t-popup__close');
    
    let $resultForm = $('#rec158540560,#rec158536003,#rec157577217');
    let $resultFormTop = $('#rec158536003');
    
    
    function clearPage() {
        $resultForm.css('display', 'none');
        $image.css('max-width', '240px');
    }
    
    let $loader = $('<div class="overlay alert-form"><div class="lds-dual-ring"></div></div>')
        .css('display', 'none')
        .appendTo('body');
    function showLoader() {
        $loader.fadeIn();
    }
    function removeLoader() {
        $loader.fadeOut();
    }
    var $alert = $(`<div><span style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);"></span></div>`)
        .css({
            display         : 'none',
            backgroundColor : 'black',
            color           : '#eee',
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            'font-weight': 'bold',
            'font-size': '50px',
            'z-index': 900,
            'text-align': 'center'
        })
        .appendTo(document.body);
    function showMessage(message) {
            $alert.find('span').text(message);
            $alert.fadeIn(200);
            setTimeout(() => $alert.fadeOut(200), 2500);
    }
    function scrollTo($element) {
        $([document.documentElement, document.body]).animate({
            scrollTop: $element.offset().top
        }, 1300);
    }
    function showResultsBlock() {
        $resultForm.fadeIn();
        scrollTo($resultFormTop);
    }
    function showResults(results) {
        let textContent = results.predictions
            .map(t => `<strong>${t.short_desc}</strong><br>${t.desc}`)
            .join('<br><br>');
        $textBlock.html(textContent);
        
        for (let i = 0; i < $textLabels.length; i++) {
            $textLabels[i].childNodes[2].nodeValue = results.predictions[i].short_desc
        }
        
        let valuesContent = results.predictions
            .map(t => t.name)
            .join(',');
        $valuesInput.val(valuesContent);
        
        let imageContent = `${SERVER_URL}/images/${results.image_name}`;
        $imageInput.val(imageContent);
        
        $image
            .removeAttr('src')
            .attr('src', `${SERVER_URL}/images/${results.image_name}`)
            .attr('data-original', `${SERVER_URL}/images/${results.image_name}`);
        
        showResultsBlock();
    }
    
    function onSuccess(data) {
        window.resp = data;
        console.log(data);
        if (!data.success) {
            showMessage('Ошибка от сервера');
            return;
        }
        showResults(data.result);
    }
    
    function onError(message) {
        showMessage('Произошла ошибка');
    }
    
    function sendImageForm(inputImage) {
        showLoader();
        $formWithButtonClose.click();
        
        let formData = new FormData();
        formData.append('image', inputImage.files[0]);
        $.ajax({
            url: IMAGE_API_URL,
            type: 'POST',
            data: formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: onSuccess,
            error: onError,
            complete: removeLoader
        });
    }
    
    $sendImageButton.click(event => {
        event.preventDefault();
        let $input = $('<input type="file" name="photo" style="display:none">');
        $input
            .appendTo(document.body)
            .change(e => {
                sendImageForm($input[0]);
            })
            .click();
    });
    clearPage();
});
