// const addRow = document.querySelector('#add-row');
// const exercisesDiv = document.querySelector('#add-exercises');

// addRow.addEventListener('click', () => {
//     let newExercise = document.createElement('article')
//     newExercise.innerHTML = `
//         <input
//         type="exerciseSearch"
//         id="exericse-search"
//         placeholder="Search for exercise"
//         />
        
//         <input type="reps" id="reps" value="1" />
        
//         <input type="restBetweenReps" id="restBetweenReps" value="30" />
//         <span>Seconds</span>
        
//         <input type="unitType" id="exericse-search" placeholder="Unit" />
        
//         <input type="sets" id="sets" value="1" />
        
//         <span>Sets</span>
//         <input type="restBetweenSets" id="restBetweenSets" value="30" />
//         <span>Seconds</span>
//         `
//         exercisesDiv.appendChild(newExercise);
//     })
// console.log("I rUn")

// console.log("FromJS:", workoutObj)

// Handlebars.registerHelper('select', (value, workoutObj) => {
//     // Create a select element 
//     var select = document.createElement('select');

//     // Populate it with the option HTML
//     select.innerHTML = options.fn(this);

//     // Set the value
//     select.value = value;

//     // Find the selected node, if it exists, add the selected attribute to it
//     if (select.children[select.selectedIndex])
//         select.children[select.selectedIndex].setAttribute('selected', 'selected');

//     return select.innerHTML;
// });