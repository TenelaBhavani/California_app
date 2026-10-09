const form = document.getElementById("predictionForm");

const predictButton =
    document.getElementById("predictButton");

const emptyState =
    document.getElementById("emptyState");

const predictionResult =
    document.getElementById("predictionResult");

const price =
    document.getElementById("price");

const errorMessage =
    document.getElementById("errorMessage");

const errorText =
    document.getElementById("errorText");

const resetButton =
    document.getElementById("resetButton");


form.addEventListener("submit", async function (event) {

    event.preventDefault();

    hideError();

    predictButton.classList.add("loading");

    predictButton.disabled = true;


    try {

        const formData = new FormData(form);

        const params = new URLSearchParams();


        for (const [key, value] of formData.entries()) {

            params.append(key, value);

        }


        const response = await fetch(
            `/predict?${params.toString()}`
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Prediction failed."
            );

        }


        displayPrediction(data.prediction);


    } catch (error) {

        showError(error.message);

    } finally {

        predictButton.classList.remove("loading");

        predictButton.disabled = false;

    }

});


function displayPrediction(prediction) {

    emptyState.style.display = "none";

    predictionResult.classList.add("show");


    /*
        The California Housing dataset commonly
        represents the target in units of $100,000.
    */

    const priceInDollars = prediction * 100000;


    const formattedPrice =
        new Intl.NumberFormat("en-US", {

            style: "currency",

            currency: "USD",

            maximumFractionDigits: 0

        }).format(priceInDollars);


    price.textContent = formattedPrice;


    predictionResult.scrollIntoView({

        behavior: "smooth",

        block: "nearest"

    });

}


resetButton.addEventListener("click", function () {

    predictionResult.classList.remove("show");

    emptyState.style.display = "block";

    form.reset();

    hideError();

});


function showError(message) {

    errorText.textContent = message;

    errorMessage.classList.add("show");

}


function hideError() {

    errorMessage.classList.remove("show");

}