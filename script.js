
// ========================================
// CAMPUS BIKE RENTAL - JAVASCRIPT
// ========================================

// Store the currently selected bike
let selectedBike = {
    id: "",
    name: "",
    price: 0
};


// ========================================
// SELECT A BIKE
// ========================================

function rentBike(id, name, price) {

    // Store selected bike details
    selectedBike.id = id;
    selectedBike.name = name;
    selectedBike.price = price;

    // Display selected bike in the rental form
    document.getElementById("selectedBike").value =
        name + " (" + id + ")";

    // Calculate initial total
    calculateTotal();

    // Move the user to the rental form
    document.getElementById("rental-form").scrollIntoView({
        behavior: "smooth"
    });
}


// ========================================
// CALCULATE TOTAL RENTAL COST
// ========================================

function calculateTotal() {

    const duration =
        Number(document.getElementById("duration").value);

    const total =
        selectedBike.price * duration;

    document.getElementById("totalAmount").textContent =
        "₹" + total;
}


// ========================================
// CONFIRM RENTAL
// ========================================

document.getElementById("rentalForm").addEventListener(
    "submit",
    function (event) {

        // Prevent page refresh
        event.preventDefault();

        // Get student details
        const studentName =
            document.getElementById("studentName").value.trim();

        const studentId =
            document.getElementById("studentId").value.trim();

        const duration =
            Number(document.getElementById("duration").value);

        // Check whether a bike has been selected
        if (selectedBike.id === "") {

            alert("Please select a bike first.");

            return;
        }


        // Check student name
        if (studentName === "") {

            alert("Please enter your name.");

            return;
        }


        // Check student ID
        if (studentId === "") {

            alert("Please enter your student ID.");

            return;
        }


        // Calculate total
        const total =
            selectedBike.price * duration;


        // Create rental object
        const rental = {

            id: Date.now(),

            bikeId: selectedBike.id,

            bikeName: selectedBike.name,

            studentName: studentName,

            studentId: studentId,

            duration: duration,

            total: total,

            status: "ACTIVE"
        };


        // Get existing rentals
        let rentals =
            JSON.parse(localStorage.getItem("rentals")) || [];


        // Add new rental
        rentals.push(rental);


        // Save rentals
        localStorage.setItem(
            "rentals",
            JSON.stringify(rentals)
        );


        // Show success message
        alert(
            "Bike rented successfully!\n\n" +
            "Bike: " + selectedBike.name + "\n" +
            "Duration: " + duration + " hour(s)\n" +
            "Total: ₹" + total
        );


        // Reset form
        document.getElementById("rentalForm").reset();


        // Clear selected bike
        selectedBike = {
            id: "",
            name: "",
            price: 0
        };


        document.getElementById("selectedBike").value = "";

        document.getElementById("totalAmount").textContent =
            "₹0";


        // Display updated rentals
        displayRentals();
    }
);


// ========================================
// DISPLAY RENTALS
// ========================================

function displayRentals() {

    const rentalList =
        document.getElementById("rentalList");


    // Get rentals from local storage
    const rentals =
        JSON.parse(localStorage.getItem("rentals")) || [];


    // If there are no rentals
    if (rentals.length === 0) {

        rentalList.innerHTML = `
            <div class="empty-rentals">

                <div class="empty-icon">
                    🚲
                </div>

                <p>
                    No active rentals yet.
                </p>

            </div>
        `;

        return;
    }


    // Clear previous content
    rentalList.innerHTML = "";


    // Display each rental
    rentals.forEach(function (rental) {

        const rentalCard =
            document.createElement("div");

        rentalCard.className =
            "rental-card";


        rentalCard.innerHTML = `

            <div class="rental-info">

                <h3>
                    🚲 ${rental.bikeName}
                </h3>

                <p>
                    Bike ID: ${rental.bikeId}
                </p>

                <p>
                    Student: ${rental.studentName}
                </p>

                <p>
                    Duration: ${rental.duration} hour(s)
                </p>

                <p>
                    Total: ₹${rental.total}
                </p>

                <span class="status">
                    ${rental.status}
                </span>

            </div>

            <button
                class="return-btn"
                onclick="returnBike(${rental.id})">

                Return Bike

            </button>

        `;


        rentalList.appendChild(rentalCard);

    });
}


// ========================================
// RETURN BIKE
// ========================================

function returnBike(rentalId) {

    // Get rentals
    let rentals =
        JSON.parse(localStorage.getItem("rentals")) || [];


    // Find the selected rental
    const rental =
        rentals.find(function (item) {

            return item.id === rentalId;

        });


    if (!rental) {

        return;
    }


    // Confirm return
    const confirmation =
        confirm(
            "Are you sure you want to return " +
            rental.bikeName +
            "?"
        );


    if (!confirmation) {

        return;
    }


    // Update rental status
    rental.status = "RETURNED";


    // Save updated rentals
    localStorage.setItem(
        "rentals",
        JSON.stringify(rentals)
    );


    // Refresh rental list
    displayRentals();


    alert(
        "Bike returned successfully!"
    );
}


// ========================================
// LOAD RENTALS WHEN PAGE OPENS
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayRentals();

    }
);