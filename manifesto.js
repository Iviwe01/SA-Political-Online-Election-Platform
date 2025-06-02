

document.addEventListener("DOMContentLoaded", () => {
    const totalPopulation = 100; // Total population
    const ctx = document.getElementById("voterStatusChart").getContext("2d");

    // Placeholder for the chart instance
    let voterStatusChart = null;

    // Function to update the voter status chart
    function updateVoterStatusChart(votedCount) {
        const notVotedCount = totalPopulation - votedCount;

        if (!voterStatusChart) {
            voterStatusChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Voted", "Not Voted"],
                    datasets: [{
                        data: [votedCount, notVotedCount],
                        backgroundColor: ["#4caf50", "#f44336"], // Colors for the segments
                        hoverBackgroundColor: ["#45a049", "#e53935"],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                    }
                }
            });
        } else {
            voterStatusChart.data.datasets[0].data = [votedCount, notVotedCount];
            voterStatusChart.update();
        }
    }

    // Function to update the ranking table
    function updateRankingTable(candidates) {
        const tableBody = document.getElementById("ranking-table").querySelector("tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        // Sort candidates by votes (descending)
        candidates.sort((a, b) => b.voteCount - a.voteCount);

        candidates.forEach((candidate, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${candidate.name}</td>
                <td>${candidate.party}</td>
                <td>${candidate.voteCount}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Fetch poll results and update charts and tables
    function fetchPollResults() {
        const totalVotesElement = document.getElementById("total-votes");

        fetch("/poll-results")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch poll results.");
                }
                return response.json();
            })
            .then(data => {
                if (data.status === "success") {
                    const { totalVotes, candidates } = data;

                    // Update total votes
                    totalVotesElement.textContent = `Total Votes: ${totalVotes}`;

                    // Update voter chart
                    updateVoterStatusChart(totalVotes);

                    // Update ranking table
                    updateRankingTable(candidates);
                } else {
                    console.error("Error fetching poll results:", data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching poll results:", error);
            });
    }

    // Fetch poll results every 5 seconds
    fetchPollResults();
    setInterval(fetchPollResults, 5000);
});



// Define manifestos for each candidate
const manifestos = {
    "Cyril Ramaphosa": {
        title: "Building a Strong and United South Africa",
        content: `
            <h2>Vision for South Africa</h2>
            <p>A prosperous, united, and democratic South Africa that works for all its citizens.</p>
            <h2>Key Policy Priorities</h2>
            <ul>
                <li>Economic Growth and Job Creation
                    <ul>
                        <li>Create 2 million jobs in the next 5 years</li>
                        <li>Support small businesses and entrepreneurs</li>
                        <li>Attract foreign investment</li>
                    </ul>
                </li>
                <li>Education and Skills Development
                    <ul>
                        <li>Improve access to quality education</li>
                        <li>Expand vocational training programs</li>
                        <li>Invest in digital skills development</li>
                    </ul>
                </li>
                <li>Healthcare
                    <ul>
                        <li>Strengthen the public healthcare system</li>
                        <li>Implement National Health Insurance</li>
                        <li>Improve rural healthcare access</li>
                    </ul>
                </li>
            </ul>
        `
    },
    "Paul Mashatile": {
        title: "Transforming South Africa Through Innovation",
        content: `
            <h2>Our Vision</h2>
            <p>A modernized, innovative South Africa that leads in technology and sustainable development.</p>
            <h2>Key Initiatives</h2>
            <ul>
                <li>Digital Transformation
                    <ul>
                        <li>Nationwide broadband access</li>
                        <li>Digital literacy programs</li>
                        <li>Smart city development</li>
                    </ul>
                </li>
                <li>Economic Innovation
                    <ul>
                        <li>Support for tech startups</li>
                        <li>Green energy investment</li>
                        <li>Digital economy growth</li>
                    </ul>
                </li>
                <li>Social Development
                    <ul>
                        <li>Youth empowerment programs</li>
                        <li>Skills development initiatives</li>
                        <li>Community-based projects</li>
                    </ul>
                </li>
            </ul>
        `
    },
    "Julius Malema": {
        title: "Economic Freedom in Our Lifetime",
        content: `
            <h2>Revolutionary Vision</h2>
            <p>Radical economic transformation and social justice for all South Africans.</p>
            <h2>Key Policies</h2>
            <ul>
                <li>Land Reform
                    <ul>
                        <li>Land expropriation without compensation</li>
                        <li>Redistribution of agricultural land</li>
                        <li>Support for emerging farmers</li>
                    </ul>
                </li>
                <li>Economic Transformation
                    <ul>
                        <li>Nationalization of key industries</li>
                        <li>Free education at all levels</li>
                        <li>Job creation through industrialization</li>
                    </ul>
                </li>
                <li>Social Justice
                    <ul>
                        <li>Universal basic income</li>
                        <li>Free healthcare for all</li>
                        <li>Housing development programs</li>
                    </ul>
                </li>
            </ul>
        `
    },
    "John Steenhuisen": {
        title: "A New Direction for South Africa",
        content: `
            <h2>Our Promise</h2>
            <p>A transparent, efficient, and prosperous South Africa built on democratic principles.</p>
            <h2>Key Focus Areas</h2>
            <ul>
                <li>Good Governance
                    <ul>
                        <li>Fight corruption and state capture</li>
                        <li>Strengthen democratic institutions</li>
                        <li>Improve public service delivery</li>
                    </ul>
                </li>
                <li>Economic Reform
                    <ul>
                        <li>Reduce red tape for businesses</li>
                        <li>Privatize failing state enterprises</li>
                        <li>Create a business-friendly environment</li>
                    </ul>
                </li>
                <li>Safety and Security
                    <ul>
                        <li>Reform police services</li>
                        <li>Combat crime and corruption</li>
                        <li>Strengthen border security</li>
                    </ul>
                </li>
            </ul>
        `
    },
    "Jacob Zuma": {
        title: "Building One South Africa",
        content: `
            <h2>National Vision</h2>
            <p>A unified, prosperous South Africa where opportunity is available to all.</p>
            <h2>Strategic Priorities</h2>
            <ul>
                <li>Education Reform
                    <ul>
                        <li>Quality education for all</li>
                        <li>Teacher development programs</li>
                        <li>Modern school infrastructure</li>
                    </ul>
                </li>
                <li>Economic Growth
                    <ul>
                        <li>Support for SMEs</li>
                        <li>Youth employment initiatives</li>
                        <li>Infrastructure development</li>
                    </ul>
                </li>
                <li>Social Cohesion
                    <ul>
                        <li>Promote national unity</li>
                        <li>Address inequality</li>
                        <li>Community development</li>
                    </ul>
                </li>
            </ul>
        `
    }
};

function showManifesto(candidateName) {
    // Get the manifesto data for the selected candidate
    const candidate = manifestos[candidateName];

    if (candidate) {
        // Set the modal title and content
        document.getElementById('modal-title').innerText = candidate.title;
        document.getElementById('modal-content').innerHTML = candidate.content;

        // Show the modal
        const modal = document.getElementById('manifesto-modal');
        modal.style.display = 'block';
    } else {
        alert('Manifesto not found!');
    }
}

function closeModal() {
    // Hide the modal
    const modal = document.getElementById('manifesto-modal');
    modal.style.display = 'none';
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('manifesto-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};



// Initialize AOS for animations
document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 1000,
        easing: "ease-in-out",
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the backend endpoint
    fetch('/get-provinces-votes')
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Check the structure of the data in the console

            // Prepare chart data
            const labels = Object.keys(data);
            const votes = Object.values(data);

            // Set up Chart.js chart
            const ctx = document.getElementById('provinceVotesChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',  // You can also use 'pie' or 'doughnut'
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Votes per Province',
                        data: votes,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching provincial vote data:', error));
});


let voterChart; // Reference to the Chart.js instance

// Function to initialize or update the voter chart
function updateVoterChart(totalVotes) {
    const ctx = document.getElementById('voterChart').getContext('2d');

    // Initialize the chart if it doesn't exist
    if (!voterChart) {
        voterChart = new Chart(ctx, {
            type: 'doughnut', // Doughnut chart
            data: {
                labels: ['Voted', 'Not Voted'],
                datasets: [{
                    data: [totalVotes, 100 - totalVotes], // Initial data
                    backgroundColor: ['#4caf50', '#f44336'], // Colors for the segments
                    hoverBackgroundColor: ['#45a049', '#e53935'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    } else {
        // Update the chart data
        voterChart.data.datasets[0].data = [totalVotes, 100 - totalVotes];
        voterChart.update(); // Apply the update
    }
}

// Call this function whenever new data is fetched or votes are cast
function fetchPollResults() {
    const totalVotesElement = document.getElementById("total-votes");
    const candidateList = document.getElementById("candidate-list");

    fetch("/poll-results")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch poll results.");
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                const { totalVotes, candidates } = data;

                // Update total votes
                totalVotesElement.textContent = `Total Votes: ${totalVotes}`;

                // Update the voter chart
                updateVoterChart(totalVotes);

                // Clear and update candidate list
                candidateList.innerHTML = "";
                candidates.forEach(candidate => {
                    const percentage = totalVotes > 0
                        ? ((candidate.voteCount / totalVotes) * 100).toFixed(2)
                        : 0;

                    const candidateResult = document.createElement("div");
                    candidateResult.className = "candidate-result";

                    candidateResult.innerHTML = `
                        <div class="candidate-name">${candidate.name} (${candidate.party})</div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${percentage}%"></div>
                            <span class="percentage">${percentage}%</span>
                        </div>
                        <div class="vote-count">${candidate.voteCount} Votes</div>
                    `;
                    candidateList.appendChild(candidateResult);
                });
            } else {
                console.error("Error fetching poll results:", data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error.message);
        });
}




// Function to show the login form
function showLogin() {
    document.getElementById('register-form').style.display = 'none';  // Hide the register form
    document.getElementById('login-form').style.display = 'block';    // Show the login form
}


// Handle user registration
document.getElementById("register").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
	const idnumber = document.getElementById("register-idnumber").value;
    const province = document.getElementById("register-province").value; // Get province

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, idnumber, province }) // Include province in request
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Registration successful. Please login.");
            showLogin(); // Show login form after registration
        } else {
            alert("Error: " + data.message);
        }
    });
});

// Function to show the login form
function showRegister() {
    document.getElementById('register-form').style.display = 'block';  // Hide the register form
    document.getElementById('login-form').style.display = 'none';    // Show the login form
}

// Handle user login
document.getElementById("login").addEventListener("submit", function(event) {
    console.log("Login button clicked"); // Debug log
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Login successful. Proceed to vote.");
            currentUserID = data.userID; // Save user ID for voting
            showVotingSection(); // Show voting section after login
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => console.error("Login error:", error));
});

function showVotingSection() {
    console.log("Showing voting section"); // Debug log
    const votingSection = document.getElementById("voting-section");
    if (votingSection) {
        votingSection.style.display = "block"; // Make the section visible
        fetchCandidates(); // Fetch and display candidates
    } else {
        console.error("Voting section element not found in the DOM.");
    }
}


// Fetch and display candidates
function fetchCandidates() {
    console.log("Fetching candidates...");
    fetch("/candidates")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch candidates. Please ensure the endpoint is correct.");
            }
            return response.json();
        })
        .then(data => {
            const candidatesList = document.getElementById("candidates-list");
            if (candidatesList) {
                candidatesList.innerHTML = ""; // Clear existing candidates
                data.candidates.forEach((candidate, index) => {
                    const candidateDiv = document.createElement("div");
                    candidateDiv.classList.add("candidate");
                    candidateDiv.style.setProperty("--order", index); // Add stagger animation order
                    candidateDiv.innerHTML = `
                        <div class="candidate-name">${candidate.name}</div>
                        <div class="candidate-party">${candidate.party}</div>
                    `;
                    candidateDiv.onclick = function () {
                        castVote(candidate.candidateID);
                    };
                    candidatesList.appendChild(candidateDiv);
                });
            } else {
                console.error("Candidates list element not found in the DOM.");
            }
        })
        .catch(error => {
            console.error("Error fetching candidates:", error);
        });
}


// Cast vote and log out user after successful vote
function castVote(candidateID) {
    fetch("/votes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: currentUserID,
            candidateID: candidateID
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Vote cast successfully. You will now be logged out.");
			window.location.href = "/";
            logout();  // Automatically log out the user
			
        } else {
            alert("Error: " + data.message);
			 window.location.href = "/";  // Redirect to home page or login page
        }
    });
}

// Fetch and display poll results
function fetchPollResults() {
    const totalVotesElement = document.getElementById("total-votes");
    const candidateList = document.getElementById("candidate-list");

    fetch("/poll-results")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch poll results.");
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                const { totalVotes, candidates } = data;

                // Update total votes
                totalVotesElement.textContent = `Total Votes: ${totalVotes}`;

                // Clear and update candidate list
                candidateList.innerHTML = "";
                candidates.forEach(candidate => {
                    const percentage = totalVotes > 0
                        ? ((candidate.voteCount / totalVotes) * 100).toFixed(2)
                        : 0;

                    const candidateResult = document.createElement("div");
                    candidateResult.className = "candidate-result";

                    candidateResult.innerHTML = `
                        <div class="candidate-name">${candidate.name} (${candidate.party})</div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${percentage}%"></div>
                            <span class="percentage">${percentage}%</span>
                        </div>
                        <div class="vote-count">${candidate.voteCount} Votes</div>
                    `;
                    candidateList.appendChild(candidateResult);
                });
            } else {
                console.error("Error fetching poll results:", data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error.message);
        });
}

// Poll the results every 5 seconds
document.addEventListener("DOMContentLoaded", () => {
    fetchPollResults();
    setInterval(fetchPollResults, 5000);
});
