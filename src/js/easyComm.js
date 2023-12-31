import { Modal } from "bootstrap";

let easyComm = {
    initialize: function(){
        //easyComm.rating.initialize();

        document.querySelectorAll("form.ec-form").forEach(function(item){
            item.querySelectorAll('.ec-error').forEach(function(errorElement){
                errorElement.innerHTML = null;
                errorElement.style.display = 'none';
            });

            item.addEventListener("submit", function(e){
                e.preventDefault();
                easyComm.message.send(item);
            });
        });
    },

    message: {
        send: function(form) {
            const data = new FormData(form);
            data.append("action", 'message/create');

            let submit = form.querySelector('input[type="submit"]')
            if(submit)
                submit.setAttribute('disabled','disabled');

            form.querySelectorAll('.ec-error').forEach(function(errorElement){
                errorElement.innerHTML = null;
                errorElement.style.display = 'none';
            });

            fetch(easyCommConfig.actionUrl, {
                method: 'POST',
                headers: {},
                body: data,
            }).then(function(response){
                if(response.ok){
                    response = response.json();
                    response.then(result => {
                        console.log(result)
                        let fid = form.dataset.fid;
                        submit.setAttribute('disabled', '');
                        if (result.success) {
                            form.reset();
                            if(typeof (result.data) == "string") {
                                let ecFormSuccess = document.querySelector('#ec-form-success-' + fid)
                                if(ecFormSuccess){
                                    let title = ecFormSuccess.querySelector(".modal-custom__title");
                                    if(title)
                                        title.innerHTML = result.message;
                                
                                    let modal = new Modal(ecFormSuccess);
                                    
                                    modal.show();
                                  
                                    setTimeout(function(){
                                        console.log(modal.hide());
                                        console.log(modal.handleUpdate());
                                    }, 200)
                                }
                                let parentContainer = document.querySelector(form.dataset.parentContainer);
                                if(!parentContainer)
                                    parentContainer = form;
                                
                                parentContainer.parentElement.insertAdjacentHTML('afterbegin', result.data);
                                parentContainer.style.display = 'none';
                                
                            }else {
                                easyComm.notice.show(result.message);
                            }
                        }else {
                            if(result.data && result.data.length) {
                                for(i in result.data){
                                    let error = result.data[i];
                                    let errorElement = form.querySelector('#ec-' + error.field + '-error-' + fid);
                                    if(errorElement){
                                        errorElement.innerHTML = error.message;
                                        errorElement.style.display = '';
                                    }
                                }
                            } else {
                                easyComm.notice.error(result.message);
                            }
                        }
                    });
                }else{
                    submit.setAttribute('disabled', '');
                    easyComm.notice.error('Submit error');
                }
            });
        }
    },


    // rating: {
    //     initialize: function(){
    //         var stars = jQuery('.ec-rating').find('.ec-rating-stars>span');
    //         stars.on('touchend click', function(e){
    //             var starDesc = jQuery(this).data('description');
    //             jQuery(this).parent().parent().find('.ec-rating-description').html(starDesc).data('old-text', starDesc);
    //             jQuery(this).parent().children().removeClass('active active2 active-disabled');
    //             jQuery(this).prevAll().addClass('active');
    //             jQuery(this).addClass('active');
    //             // save vote
    //             var storageId = jQuery(this).closest('.ec-rating').data('storage-id');
    //             jQuery('#' + storageId).val(jQuery(this).data('rating'));
    //         });
    //         stars.hover(
    //             // hover in
    //             function() {
    //                 var descEl = jQuery(this).parent().parent().find('.ec-rating-description');
    //                 descEl.data('old-text', descEl.html());
    //                 descEl.html(jQuery(this).data('description'));
    //                 jQuery(this).addClass('active2').removeClass('active-disabled');
    //                 jQuery(this).prevAll().addClass('active2').removeClass('active-disabled');
    //                 jQuery(this).nextAll().removeClass('active2').addClass('active-disabled');
    //             },
    //             // hover out
    //             function(){
    //                 var descEl = jQuery(this).parent().parent().find('.ec-rating-description');
    //                 descEl.html(descEl.data('old-text'));
    //                 jQuery(this).parent().children().removeClass('active2 active-disabled');
    //             }
    //         );
    //     }
    // },

    notice: {
        error: function(text) {
            alert(text);
        },
        show: function(text) {
            alert(text);
        }
    }
}

export default easyComm;