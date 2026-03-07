function doGet(e) {
  const template = HtmlService.createTemplateFromFile('Index');
  // Use 'code' as the parameter name in your URL
  template.prefilledCode = e.parameter.code || "";
  return template.evaluate()
    .setTitle("Anas & Nabiha RSVP")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getFamilyMembers(accessCode) {
  try {
    const ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1b7909KMT5MCpRfNR2ZEFWXMRYt8ixRveJrs-aM7gvyI/edit");
    const sheet = ss.getSheetByName("GuestList");
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) return [];
    const data = sheet.getRange(2, 1, lastRow - 1, 11).getValues();
    const searchCode = accessCode.trim().toUpperCase();

    const family = data.filter(row => row[6].toString().trim().toUpperCase() === searchCode);

    if (family.length === 0) return null;

    return family.map(row => ({
      name: row[1].toString().trim(),
      dholki: !!row[2],
      nikkah: !!row[3],
      reception: !!row[4],
      kidsRestricted: !!row[5],
      // NEW: return existing RSVP status
      rsvp_dholki: row[7] === "Attending",
      rsvp_nikkah: row[8] === "Attending",
      rsvp_reception: row[9] === "Attending",
      dietary: row[10] ? row[10].toString() : ""
    }));
  } catch (e) {
    console.error("Error in getFamilyMembers: " + e.toString());
    return null;
  }
}

function submitRSVP(responses) {
  const ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1b7909KMT5MCpRfNR2ZEFWXMRYt8ixRveJrs-aM7gvyI/edit");
  const sheet = ss.getSheetByName("GuestList");
  const data = sheet.getDataRange().getValues();

  // CHANGED: All output columns shift by +1 due to the inserted column
  const COL_RSVP_D = 8;
  const COL_RSVP_N = 9;
  const COL_RSVP_R = 10;
  const COL_DIETARY = 11;

  const dietaryNotes = responses['dietary_notes'] || "";

  for (let i = 1; i < data.length; i++) {
    const guestName = data[i][1].toString().trim();
    if (responses[guestName + "_active"]) {
      sheet.getRange(i + 1, COL_RSVP_D).setValue(responses[guestName + "_dholki"] ? "Attending" : "Not Attending");
      sheet.getRange(i + 1, COL_RSVP_N).setValue(responses[guestName + "_nikkah"] ? "Attending" : "Not Attending");
      sheet.getRange(i + 1, COL_RSVP_R).setValue(responses[guestName + "_reception"] ? "Attending" : "Not Attending");
      sheet.getRange(i + 1, COL_DIETARY).setValue(dietaryNotes);
    }
  }
  return "JazakAllah Khair! Your RSVP has been saved.";
}