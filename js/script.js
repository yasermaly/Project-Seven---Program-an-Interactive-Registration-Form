/*
   Team Treehouse Techdegree:
   Project 7 - Program an Interactive Registration Form
*/


//This function sets a focus on the name field by default
function focusName () {
    const name = document.getElementById('name');
    name.focus();
}
focusName();

//This event handler hides by default the 'Other job role' field. If the user selects "Other" in the "Job Role" drop down menu, the "Other job role" text field appears, and they can enter info into it
const nameField = document.getElementById('name');
const jobRole = document.getElementById('title');
const otherJob = document.getElementById('other-job-role');
otherJob.hidden = true;

jobRole.addEventListener('change', e => {
    if (e.target.value === 'other') {
       otherJob.hidden = false;
    } else {
        otherJob.hidden = true;
    }
});

// This event handler disable by default the color menu, so the user shouldn’t be able to see or choose a color option until they have chosen a design
const designSelect = document.getElementById('design');
const color = document.getElementById('color');
color.disabled = true;
const colorSelect = document.getElementById('color').children;

designSelect.addEventListener('change', e => {
    color.disabled = false;
    for (let i = 1; i < colorSelect.length; i++) {
        let eTarget = e.target.value;
        let dataTheme = colorSelect[i].getAttribute('data-theme');
        if (eTarget === dataTheme) {
            colorSelect[i].hidden = false;
            colorSelect[i].setAttribute('selected', true);
        } else {
            colorSelect[i].hidden = true;
            colorSelect[i].removeAttribute('selected');
        }
    }
});


// Adds accessibility
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
for (let i =0; i < checkboxes.length; i++) {
    
    checkboxes[i].addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focus');
    });
    checkboxes[i].addEventListener('blur', (e) => {
        e.target.parentElement.classList.remove('focus');
    });
}

// This event handler displays the total cost of selected activities and prevents the selection of activities with conflicting dates
const activities = document.getElementById('activities');
const totalElement = document.getElementById('activities-cost');
let totalCost = 0;
let totalActivities= 0;

activities.addEventListener('change', e => {
    const dataCost = +e.target.getAttribute('data-cost');
    const chekedBox = e.target;

    for (let i = 0; i < checkboxes.length; i++) {
        if (chekedBox.getAttribute('data-day-and-time') === checkboxes[i].getAttribute('data-day-and-time')) {
            if (chekedBox.checked) {
                checkboxes[i].disabled = true;
                checkboxes[i].parentNode.classList.add('disabled');
                
            } else if (!chekedBox.checked) {
                checkboxes[i].disabled = false;
                checkboxes[i].parentNode.classList.remove('disabled');
            }
        }
        chekedBox.parentElement.classList.remove('disabled');
        chekedBox.disabled = false;
    }
    if (chekedBox.checked) {
        totalCost += dataCost;
        totalActivities += 1;
    } else {
        totalCost -= dataCost;
        totalActivities -= 1;
    }
    totalElement.innerHTML = `Total: $${totalCost}`;
});


// This event handler displays the credit payment method unless a different one is selected from the dropdown menu 
const paymentElement = document.getElementById('payment');
const creditCard = document.getElementById('credit-card');
const paypal = document.getElementById('paypal');
const bitcoin = document.getElementById('bitcoin');
paypal.hidden = true;
bitcoin.hidden = true;
paymentElement[1].setAttribute('selected', true);

paymentElement.addEventListener('change', (e) => {
    if (e.target.value === 'paypal') {
        creditCard.hidden = true;
        bitcoin.hidden = true;
        paypal.hidden = false;
    } else if (e.target.value === 'bitcoin') {
        creditCard.hidden = true;
        bitcoin.hidden = false;
        paypal.hidden = true;
    } else {
        creditCard.hidden = false;
        bitcoin.hidden = true;
        paypal.hidden = true;
    }
});

// Variables to work in form validation
const emailInput = document.getElementById('email');
const cardNumber = document.getElementById('cc-num');
const zipCode = document.getElementById('zip');
const cvv = document.getElementById('cvv');
const formElement = document.querySelector('form');
const emailHint = document.getElementById('email-hint');
const activitiesBox = document.getElementById('activities-box');


// These helper functions test each required field and the validation requirements of each
function regexName () {
    const nameInput = nameField.value;
    const nameTest = /^[a-z]/i.test(nameInput);
    return nameTest;
}
function regexEmail () {
    const email = emailInput.value;
    const emailTest = /^[^@]+@[^@.]+\.com+$/i.test(email);
    return emailTest;
}
function regexCCard () {
    const cardInput = cardNumber.value;
    const cardTest = /^\d{13,16}$/.test(cardInput);
    return cardTest;
}
function regexZip () {
    const zipInput = zipCode.value;
    const zipTest = /^\d{5}$/.test(zipInput);
    return zipTest;
}
function regexCvv () {
    const cvvInput = cvv.value;
    const cvvTest = /^\d{3}$/.test(cvvInput);
    return cvvTest;
}
function activitiesValidator () {
    const activitiesSelected = totalCost > 0;
    return activitiesSelected;
}


// This function handles error validation
function errorValidation(test, element, event) {
    if(!test()) {
        event.preventDefault();
        element.parentElement.classList.add('not-valid');
        element.parentElement.classList.remove('valid');
        element.parentElement.lastElementChild.classList.remove('hint');
    } else {
        element.parentElement.classList.add('valid');
        element.parentElement.classList.remove('not-valid');
        element.parentElement.lastElementChild.classList.add('hint');
    }
}


// Real-time error messages

nameField.addEventListener('keyup', (e) => {
    
    const nameHint = document.getElementById('name-hint');
    if (e.target.value === '') {
        nameHint.style.display = 'block';
    } else {
        nameHint.style.display = 'none';

    }
    regexName();
});

emailInput.addEventListener('keyup', (e) => {
    if (emailInput.value === '') {
        emailHint.style.display = 'block';
        emailHint.innerHTML = 'Email field cannot be blank';
    } else if (!regexEmail()) {
        emailHint.innerHTML = 'Email address must be formatted correctly';
    } else if (regexEmail()) {
        emailHint.innerHTML = '';
    }
    regexEmail();
});


// This event handler validates each required form field when the form is submitted.
formElement.addEventListener('submit', (e) => {
    errorValidation(regexName, nameField, e);
    errorValidation(regexEmail, emailInput, e);
    errorValidation(activitiesValidator,activities.firstElementChild, e);
    errorValidation(regexCCard, cardNumber, e);
    errorValidation(regexZip, zipCode, e);
    errorValidation(regexCvv,cvv, e);
   });