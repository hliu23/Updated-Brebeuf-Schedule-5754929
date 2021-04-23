function testCases(func, input = null, expectedResults) {
  var returnVal = func(input);
  var success = false;
  if (returnVal == expectedResults) success = true;
  return success;
}

function test(){
  let brebeufDayTest1 = testCases(brebeufDay, "Apr 23, 2021", 5);
  Logger.log("brebeufDay()\ntest1: " + brebeufDayTest1);
}

// DECLARATION
// STORE OBJECT? LIST OF INPUT AND OUTPUT FOR A PARTICULAR FUNCTION