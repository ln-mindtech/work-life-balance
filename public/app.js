//----------------Stripe-----------------------
var stripe = Stripe('pk_test_51Q8Lru2Ksl3I931rElrSwwC579UVz5GEwxbylfw26nNjbDOl8VMTGMMhQ3pduCPLrVGrkZqBtYwEk4o17ENDcUmq0059gh4woB'); // Stripe publishable key
// The items the customer wants to buy

let elements;

initialize();

document
    .getElementById("payment-form")
    .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
    const response = await fetch("/v1/payment_intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "Course on work/life balance", amount: 3740  }),
    });
    const { clientSecret, dpmCheckerLink } = await response.json();

    const appearance = {
        theme: 'stripe',
    };
    elements = stripe.elements({ appearance, clientSecret });

    const paymentElementOptions = {
        layout: "tabs",
    };

    const paymentElement = elements.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const email = document.getElementById('email').value;
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: "http://localhost:3003/complete.html",
            payment_method_data: {
                billing_details: {
                    email: email,
                }
            }
        },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
        location.href = "error.html"
    } else {
        showMessage("An unexpected error occurred.");
    }

    setLoading(false);
}

// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");
    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
    }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}

// -------------Menu code---------------------
let links = document.getElementsByClassName("menu-link");
links[0].addEventListener("click", uncheckedInpt);
links[1].addEventListener("click", uncheckedInpt);
links[2].addEventListener("click", uncheckedInpt);
links[3].addEventListener("click", uncheckedInpt);
links[4].addEventListener("click", uncheckedInpt);
function uncheckedInpt (event) {
    document.getElementById("menu-switcher").checked = false;
}

// ---------Modal window-----------------
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];
function redirectToPayment() {
    // location.href = "https://buy.stripe.com/test_4gwbJM0TZ05mbOo6oo";
    modal.style.display = "block";
}


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    console.log("event.target", event.target)
    console.log("modal",modal)
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

//---------------Countdown -----------------
function startCountdown(duration) {
    let timer = duration; // total duration in seconds
    const countdownDisplay = document.getElementsByClassName('timer-text');

    const interval = setInterval(() => {
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;
        // Add a leading zero to seconds if they are less than 10
        seconds = seconds < 10 ? '0' + seconds : seconds;
        for (let i = 0; i < countdownDisplay.length; i++) {
            // elements[i].innerHTML = 'Updated Element ' + (i + 1);
            countdownDisplay[i].innerHTML = `10 <span class="vals">h.</span> ${minutes} <span class="vals">min.</span> ${seconds} <span class="vals">sec.</span>`;
        }


        // If the timer reaches zero, stop the countdown
        if (--timer < 0) {
            clearInterval(interval);
            countdownDisplay[i].innerHTML = `9 <span class="vals">h.</span> ${minutes} <span class="vals">min.</span> ${seconds} <span class="vals">sec.</span>`;
            // countdownDisplay.textContent = "Time's up!";
        }
    }, 1000); // Update every second
}

// Example: Start countdown for 2 minutes (120 seconds)
const time = 49*60;
startCountdown(time);

