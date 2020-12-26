import {slideUp, slideDown} from "./animation";
const hide = document.getElementById('hide');
const show = document.getElementById('show');
const hideMe = document.getElementById('hideMe');
const showMe = document.getElementById('showMe');
let busy = false;
hide.addEventListener('click', (e)=> {
    e.preventDefault();
    if (busy === true) return ;
    busy = true;
    slideUp(hideMe).then(()=> {
        busy = false;
    })
});
show.addEventListener('click', (e)=> {
    e.preventDefault();
    if (busy === true) return ;
    busy = true;
    slideDown(showMe).then(()=> {
        busy = false;
    })
});