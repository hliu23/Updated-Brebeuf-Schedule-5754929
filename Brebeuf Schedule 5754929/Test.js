// INCOMPLETE
function testCase(func, input = null, expectedResults) {
  var returnVal = func(input);
  var success = false;
  if (returnVal == expectedResults) success = true;
  if (success == true) return success;
  else return returnVal;
}
// THROW ERROR?

function testFunc(func, testCases) {
  let successCount = 0;
  var currentTestCases = JSON.parse(testCases);
  Logger.log("Testing: "+ "func.toString()");
  
  for (let x of currentTestCases) {
    let testResult = testCase(func, x[0], x[1]);
    Logger.log(x);
    if (testResult != true) {
      Logger.log("Failed: " +
        "Input: " + x[0] + "\n" + 
        "Expected Output: " + x[1] +
        " / Actual Output: " + testResult);
    } else successCount += 1;
  }
   
  Logger.log("Results: " + successCount + " of " + currentTestCases.length + " checks passed.");
  
}

function test(){
  var brebeufDayTestCases = [
    // PAST, FUTURE
    // UPDATES?
    ["Apr 23, 2021", 5], // NORMAL DAY
    ["Apr 24, 2021", null], // SATURDAY
    ["Apr 17, 2021", null], // SUNDAY
    ["May 3, 2021", 3], // FIRST DAY OF MONTH
    ["May 20, 2021", 8], // DAY 8
    ["Jul 1, 2021", null], // IN SUMMER
    ["Aug 6, 2021", 1], // TENTATIVE FIRST DAY NEXT YEAR?
  ];
  testFunc(brebeufDay, JSON.stringify(brebeufDayTestCases));
}

function test1() {
  
}

// DECLARATION
// STORE OBJECT? LIST OF INPUT AND OUTPUT FOR A PARTICULAR FUNCTION