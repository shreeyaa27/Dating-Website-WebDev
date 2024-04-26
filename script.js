function nextStep(currentStepId, nextStepId) {
    document.getElementById(currentStepId).style.display = 'none';
    document.getElementById(nextStepId).style.display = 'block';
} //CHANGED
function previousStep(currentStepId, previousStepId) {
    document.getElementById(currentStepId).style.display = 'none';
    document.getElementById(previousStepId).style.display = 'block';
} //CHANGED
function validateForm() {
    // Retrieve form inputs
    const rollNumber = document.getElementById('roll-number').value;
    const name = document.getElementById('name').value;
    const yearOfStudy = parseInt(document.getElementById('year-of-study').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.querySelector('input[name="gender"]:checked');
    const interests = document.querySelectorAll('input[name="interests"]:checked');
    const hobbies = document.querySelectorAll('input[name="hobbies"]:checked');

    // Check if roll number is empty
    if (!rollNumber) {
        alert('Please enter your IITB Roll Number.');
        return false;
    }

    // Check if name is empty
    if (!name) {
        alert('Please enter your name.');
        return false;
    }

    // Check if year of study is not a number or less than 1
    if (isNaN(yearOfStudy) || yearOfStudy < 1 || yearOfStudy>5) {
        alert('Please enter a valid year of study.');
        return false;
    }

    // Check if age is not a number or less than 18
    if (isNaN(age) || age < 18) {
        alert('Please enter a valid age (18 and above).');
        return false;
    }

    // Check if gender is not selected
    if (!gender) {
        alert('Please select your gender.');
        return false;
    }

    // Check if at least one interest is selected
    if (interests.length === 0) {
        alert('Please select at least one interest.');
        return false;
    }

    // Check if at least one hobby is selected
    if (hobbies.length === 0) {
        alert('Please select at least one hobby.');
        return false;
    }
    // Form is valid, call searchForMatch function
    searchForMatch();
    // Form is valid, allow submission
    return true;
}

function searchForMatch() {
            // Get user-provided data
            const currentUser = {
                rollNumber: document.getElementById('roll-number').value,
                name: document.getElementById('name').value,
                yearOfStudy: parseInt(document.getElementById('year-of-study').value),
                age: parseInt(document.getElementById('age').value),
                gender: document.querySelector('input[name="gender"]:checked').value,
                interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(input => input.value),
                hobbies: Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(input => input.value),
                email: document.getElementById('email').value,
                // Add more fields as needed
            };
        //  console.log(currentUser.interests[0]);
            // Fetch JSON data and search for matches
            fetch('/students.json')
                .then(response => response.json())
                .then(data => {
                    let potentialMatches = data.filter(user => {
                        // Exclude users of the same gender
                        if (currentUser.gender === 'Male' && user.Gender === 'Male') return false;
                        if (currentUser.gender === 'Female' && user.Gender === 'Female') return false;
        
                        // Check age difference
                        return Math.abs(currentUser.age - user.Age) <= 3;
                    });
                    // console.log(potentialMatches[0],potentialMatches[1],potentialMatches[2],'1');
                      // Filter potential matches based on common interests or hobbies
                    potentialMatches = potentialMatches.filter(user => {
                        // Check for common interests or hobbies
                        const commonInterests = user.Interests.some(interest => currentUser.interests.includes(interest));
                        const commonHobbies = user.Hobbies.some(hobby => currentUser.hobbies.includes(hobby));
                        return commonInterests || commonHobbies;
                    });
                    // console.log(potentialMatches[0],'2');
                    // Sort potential matches by number of common interests
                    potentialMatches.sort((a, b) => {
                        const commonInterestsA = a.Interests.filter(interest => currentUser.interests.includes(interest)).length;
                        const commonInterestsB = b.Interests.filter(interest => currentUser.interests.includes(interest)).length;
                        return commonInterestsB - commonInterestsA;
                    });
                    // console.log(potentialMatches[0],'3');
                    // If there are ties, resolve by hobbies
                    potentialMatches.sort((a, b) => {
                        if (a.Interests.filter(interest => currentUser.interests.includes(interest)).length === 
                            b.Interests.filter(interest => currentUser.interests.includes(interest)).length) {
                            const commonHobbiesA = a.Hobbies.filter(hobby => currentUser.hobbies.includes(hobby)).length;
                            const commonHobbiesB = b.Hobbies.filter(hobby => currentUser.hobbies.includes(hobby)).length;
                            return commonHobbiesB - commonHobbiesA;
                        }
                        return 0; // No ties
                    });
                    //console.log(potentialMatches[0]);
                    // If there are still ties, resolve by lexicographic order
                    potentialMatches.sort((a, b) => {
                        // Count the number of common interests for each user
                        const commonInterestsA = a.Interests.filter(interest => currentUser.interests.includes(interest)).length;
                        const commonInterestsB = b.Interests.filter(interest => currentUser.interests.includes(interest)).length;
                    
                        // Count the number of common hobbies for each user
                        const commonHobbiesA = a.Hobbies.filter(hobby => currentUser.hobbies.includes(hobby)).length;
                        const commonHobbiesB = b.Hobbies.filter(hobby => currentUser.hobbies.includes(hobby)).length;
                    
                        // Check if the number of common interests and hobbies are the same
                        if (commonInterestsA === commonInterestsB && commonHobbiesA === commonHobbiesB) {
                            // Compare 'Name' properties using localeCompare
                            return a.Name.localeCompare(b.Name);
                        }
                    
                        return 0; // No ties
                    });
                    // Select the first match as the unique match
                    const match = potentialMatches[0];
                    console.log('match1',match);
                    return match;
                })
                .then(match=>{
                    console.log('match2',match);
                    if (typeof match != 'undefined') {
                        localStorage.setItem('perfectMatch', JSON.stringify(match));
                    } else {
                        localStorage.setItem('perfectMatch', JSON.stringify(0));
                    }
                    console.log('match3',match);
                    // Redirect to the match display page
                    window.location.href = 'match.html';
                    // If no match found, display "No matches found"
                    if (!match) {
                        console.log('No matches found');
                        return;
                    }
        
                    // Display the match
                    console.log('Match found:', match.Name);
                })
                .catch(error => console.error('Error fetching data:', error));
        }