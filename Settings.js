function setScriptProperties() {
  PropertiesService.getScriptProperties().setProperties({
    "CLASS_1" : "08:30",
    
    "CLASS_2_PRT_A" : "10:05",
    "CLASS_2_PRT_B" : "09:35",

    "CLASS_3_LUNCH_A" : "11:40",
    "CLASS_3_LUNCH_B_I" : "11:10",
    "CLASS_3_LUNCH_B_II" : "12:10",
    "CLASS_3_LUNCH_C" : "11:10",

    "CLASS_4" : "12:45",

    "CLASS_5" : "13:50",
  });
}

function cleanScriptProperties() {
  PropertiesService.getScriptProperties().deleteAllProperties();
}