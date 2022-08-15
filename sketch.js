Chart.defaults.font.family = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
Chart.defaults.font.size = 18;
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['J'],
    datasets: [
      {
        label: 'Bubble sort',
        data: [],
        backgroundColor: 'rgba(3, 177, 252, 0.2)',
        borderColor: 'rgba(3, 177, 252, 1)',
        borderWidth: 1
      },
      {
        label: 'Insertion sort',
        data: [],
        backgroundColor: 'rgba(140, 140, 237, 0.2)',
        borderColor: 'rgba(140, 140, 237, 1)',
        borderWidth: 1
      },
      {
        label: 'Selection sort',
        data: [],
        backgroundColor: 'rgba(252, 186, 3, 0.2)',
        borderColor: 'rgba(252, 186, 3, 1)',
        borderWidth: 1
      },
      {
        label: 'Mergesort',
        data: [],
        backgroundColor: 'rgba(3, 252, 136, 0.2)',
        borderColor: 'rgba(3, 252, 136, 1)',
        borderWidth: 1
      },
      {
        label: 'Quicksort',
        data: [],
        backgroundColor: 'rgba(252, 107, 3, 0.2)',
        borderColor: 'rgba(252, 107, 3, 1)',
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Time Complexity Graph'
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        beginAtZero: true,
        grace: "10%"
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        grace: "10%"
      }
    }
  },
});

let selectedSortType;
let specifiedSpeed;
let specifiedBarCount;

let queue;
let currentArray;
let slowTimer;

function setup() {
  selectedSortType = 'quick';
  specifiedSpeed = 100;
  specifiedBarCount = 50;

  queue = [];
  currentArray = [];
  slowTimer = 0;

  noStroke();
  createCanvas(625, 572);
  
  textSize(15);

  let barCountInput = createInput(specifiedBarCount.toString());
  barCountInput.style('border', '2px solid #536f82');
  barCountInput.style('border-radius', '5px');
  barCountInput.style('padding', '2px 0px 2px 2px');
  barCountInput.position(50, 50);
  barCountInput.size(75);
  barCountInput.changed(() => {
    specifiedBarCount = parseInt(barCountInput.value());
  });

  let newButton = createButton('New');
  newButton.style('background-color', '#536f82');
  newButton.style('color', 'white');
  newButton.style('outline', '0 none');
  newButton.style('border', '1px solid transparent');
  newButton.style('border-radius', '5px');
  newButton.style('padding', '3px 10px');
  newButton.position(150, 50);
  newButton.size(50);
  newButton.mouseClicked(() => {
    queue = [];
    randomArray = createRandomArrayRanged(1, specifiedBarCount);
    currentArray = randomArray;
  });

  let sortTypeMenu = createSelect();
  sortTypeMenu.style('background-color', '#536f82');
  sortTypeMenu.style('color', 'white');
  sortTypeMenu.style('outline', '0 none');
  sortTypeMenu.style('border', '0px solid black');
  sortTypeMenu.style('border-radius', '5px');
  sortTypeMenu.style('padding', '3px 10px 3px 3px');
  sortTypeMenu.position(220, 50);
  sortTypeMenu.size(125);
  sortTypeMenu.option('Quicksort', 'quick');
  sortTypeMenu.option('Mergesort', 'merge');
  sortTypeMenu.option('Bubble sort', 'bubble');
  sortTypeMenu.option('Insertion sort', 'insertion');
  sortTypeMenu.option('Selection sort', 'selection');
  sortTypeMenu.selected(selectedSortType);
  sortTypeMenu.changed(() => {
    selectedSortType = sortTypeMenu.value();
  })

  let sortButton = createButton('Sort');
  sortButton.style('background-color', '#536f82');
  sortButton.style('color', 'white');
  sortButton.style('border', '1px solid transparent');
  sortButton.style('border-radius', '5px');
  sortButton.style('padding', '3px 10px');
  sortButton.position(360, 50);
  sortButton.size(50);
  sortButton.mouseClicked(() => {
    if (selectedSortType == 'quick') {
      [_, queue, noOfOperations] = generateQueueQuickSort(currentArray);
      myChart.data.datasets[4].data.push({x: specifiedBarCount, y: noOfOperations});
    } else if (selectedSortType == 'merge') {
      [_, queue, noOfOperations] = generateQueueMergeSort(currentArray);
      myChart.data.datasets[3].data.push({x: specifiedBarCount, y: noOfOperations});
    } else if (selectedSortType == 'bubble') {
      [_, queue, noOfOperations] = generateQueueBubbleSort(currentArray);
      myChart.data.datasets[0].data.push({x: specifiedBarCount, y: noOfOperations});
    } else if (selectedSortType == 'insertion') {
      [_, queue, noOfOperations] = generateQueueInsertionSort(currentArray);
      myChart.data.datasets[1].data.push({x: specifiedBarCount, y: noOfOperations});
    } else if (selectedSortType == 'selection') {
      [_, queue, noOfOperations] = generateQueueSelectionSort(currentArray);
      myChart.data.datasets[2].data.push({x: specifiedBarCount, y: noOfOperations});
    }
    for (let i = 0; i < 5; i++) {
      myChart.data.datasets[i].data.sort((a, b) => {
        return a.y < b.y;
      });
    }
    myChart.update();
  });


  let speedSlider = createSlider(0, 100, specifiedSpeed);
  speedSlider.style('appearance', 'none');
  speedSlider.style('background-color', '#536f82');
  speedSlider.style('height', '7px');
  speedSlider.position(460, 55);
  speedSlider.changed(() => {
    specifiedSpeed = speedSlider.value();
  });
}

function draw() {
  // Physics
  if (queue.length != 0) {
    if (specifiedSpeed != 0) {
      if (specifiedSpeed == 100) {
        currentArray = queue[queue.length-1];
        queue = [];
        slowTimer = 0;
      } else {
        if (slowTimer >= 100/specifiedSpeed - 1) {
          currentArray = queue.shift();
          slowTimer = 0;
        } else {
          slowTimer += 1;
        }
      }
    }
  }

  // Draw
  background('#a9d4e8');
  fill('#def5ff');
  rect(0, 0, 625, 75);
  if (queue.length != 0) {
    drawTextFromCorner('Sorting...', 270, 50, 'black');
  }
  if (specifiedSpeed == 100) {
    drawTextFromCorner('Speed: Instant', 440, 50, 'black');
  } else {
    drawTextFromCorner('Speed: ' + specifiedSpeed, 440, 50, 'black');
  }
  drawBars(currentArray, 0, 150, 625, 422, '#536f82');
}

function drawTextFromCorner(label, x, y, color) {
  fill(color);
  text(label, x, y + textSize());
}

function drawBars(array, x, y, width, height, color) {
  //textHeight = 20;
  for (let i = 0; i < array.length; i++) {
    fill(color);
    let widthSegment = (width / (array.length));
    let barSpacing = widthSegment * 0.2;
    let widthOfBar = widthSegment - barSpacing;
    let heightOfBar = (height /*- textHeight*/) * array[i] / max(array);
    rect(i * (barSpacing + widthOfBar), y + (height /*- textHeight*/ - heightOfBar), widthOfBar, heightOfBar);
  }
}

function createRandomArrayRanged(rangeStart, rangeEnd) {
  return shuffleArray([...Array(rangeEnd - rangeStart + 1).keys()].map(x => x + rangeStart));
}

function shuffleArray(inputArray) {
  let shuffledArray = [...inputArray];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

/*
function generateQueueBubbleSort(inputArray) {
  let tempQueue = [];
  let tempArray = [...inputArray];

  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 0; i < tempArray.length - 1; i++) {
      if (tempArray[i] > tempArray[i+1]) {
        [tempArray[i], tempArray[i+1]] = [tempArray[i+1], tempArray[i]];
        tempQueue.push([...tempArray]);
        sorted = false;
      }
    }
  }

  return [tempArray, tempQueue];
}
*/

function generateQueueMergeSort(inputArray) {
  if (inputArray.length <= 1) {
    return [inputArray, [inputArray], 0];
  }

  return mergeArrays(
    generateQueueMergeSort(
      inputArray.slice(0, inputArray.length/2)),
    generateQueueMergeSort(
      inputArray.slice(inputArray.length/2, inputArray.length)));
}

function mergeArrays([array1, queue1, noOfOperations1], [array2, queue2, noOfOperations2]) {
  let noOfOperations = array1.length + array2.length + noOfOperations1 + noOfOperations2;
  let mergedArray = [];
  let tempQueue = mergeQueues(queue1, queue2);

  while (min(array1.length, array2.length) != 0) {
    if (array1[0] > array2[0]) {
      mergedArray.push(array2.shift());
    } else {
      mergedArray.push(array1.shift());
    }
    if (!arraysEqual(mergedArray.concat(array1, array2), tempQueue[tempQueue.length - 1])) {
      tempQueue.push(mergedArray.concat(array1, array2));
    }
  }

  if (array1.length == 0) {
    return [mergedArray.concat(array2), tempQueue, noOfOperations];
  } else {
    return [mergedArray.concat(array1), tempQueue, noOfOperations];
  }
}

function mergeQueues(queue1, queue2) {
  let tempQueue = [];

  for (let i = 0; i < queue1.length; i++) {
    tempQueue.push(queue1[i].concat(queue2[0]));
  }

  for (let i = 1; i < queue2.length; i++) {
    tempQueue.push(queue1[queue1.length-1].concat(queue2[i]));
  }

  return tempQueue;
}

function generateQueueQuickSort(inputArray) {
  let noOfOperations = 0;
  let tempArray = [...inputArray];

  if (inputArray.length <= 1) {
    return [inputArray, [inputArray], 0];
  }

  const pivotValue = tempArray[0];

  let mergedQueue = [];

  let i = 0;
  let j = tempArray.length - 1;
  while (i < j) {
    while (tempArray[i] <= pivotValue) {
      noOfOperations += 1;
      i++;
    }
    while (tempArray[j] > pivotValue) {
      noOfOperations += 1;
      j--;
    }
    if (i < j) {
      [tempArray[j], tempArray[i]] = [tempArray[i], tempArray[j]] 
      mergedQueue.push([...tempArray]);
    }
  }
  [tempArray[j], tempArray[0]] = [tempArray[0], tempArray[j]] 
  mergedQueue.push([...tempArray]);

  let [smallerArray, smallerQueue, noOfOperations1] = generateQueueQuickSort(tempArray.slice(0, j));
  let [biggerArray, biggerQueue, noOfOperations2] = generateQueueQuickSort(tempArray.slice(j + 1, tempArray.length));

  /*let [smallerArray, smallerQueue] = generateQueueQuickSort(inputArray.filter((x, i) => x <= inputArray[0] && i != 0));
  let [biggerArray, biggerQueue] = generateQueueQuickSort(inputArray.filter((x, i) => x > inputArray[0] && i != 0));*/

  noOfOperations += noOfOperations1 + noOfOperations2;

  let mergedArray = smallerArray.concat(pivotValue, biggerArray);

  mergedQueue = mergedQueue.concat(mergeQueuesQuickSort(smallerQueue, pivotValue, biggerQueue));

  return [mergedArray, mergedQueue, noOfOperations];
}

function mergeQueuesQuickSort(queue1, pivot, queue2) {
  let tempQueue = [];

  for (let i = 0; i < queue1.length; i++) {
    if (!arraysEqual(queue1[i].concat(pivot, queue2[0]), tempQueue[tempQueue.length - 1])) {
      tempQueue.push(queue1[i].concat(pivot, queue2[0]));
    }
  }

  for (let i = 1; i < queue2.length; i++) {
    if (!arraysEqual(queue1[queue1.length-1].concat(pivot, queue2[i]), tempQueue[tempQueue.length - 1])) {
      tempQueue.push(queue1[queue1.length-1].concat(pivot, queue2[i]));
    }
  }

  return tempQueue;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function generateQueueSelectionSort(array) {

  let arrayOfArrays = [];

  // Typical algorithm...

  arrayOfArrays.push(array);

  // Typical algorithm...


  return arrayOfArrays;
}

function generateQueueInsertionSort(array){
  let noOfOperations = 0;
  let arrayOfArrays = [];

  for (let i=1; i< array.length; i++){
    let j=i-1;
    let temp= array[i];
    while( j>=0 && array[j]>temp){
      noOfOperations += 1;
      array[j+1]=array[j];
      j--;
    }
    noOfOperations += 1;
    array[j+1]=temp;

    arrayOfArrays.push([...array]);
  }

  return [array, arrayOfArrays, noOfOperations];
}

function generateQueueSelectionSort(arr) {
  let noOfOperations = 0;
  let arrayOfArrays = [];

  for (let i = 0; i < arr.length; i++) {
    let smallest = i
    for (let j = i + 1; j < arr.length; j++) {
      noOfOperations += 1;
      if (arr[j] < arr[smallest]) {
        smallest = j
      }
    }
    noOfOperations += 1;
    if (smallest !== i) {
      [arr[i], arr[smallest]] = [arr[smallest], arr[i]]    // Swapping
      arrayOfArrays.push([...arr]);
    }
  }
  return [arr, arrayOfArrays, noOfOperations];
}

function generateQueueBubbleSort(a) {
  let noOfOperations = 0;
  let arrayOfArrays = [];

  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a.length - i - 1; j++) {
      noOfOperations += 1;
      flag = 0;
      if (a[j] > a[j + 1]) {
        temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;

        arrayOfArrays.push([...a]);

        flag = 1;
      }
      if ((flag = 0)) break;
    }
  return [a, arrayOfArrays, noOfOperations];
}

