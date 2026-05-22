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
    const ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1b7909KMT5MCpRfNR2ZEFWXMRYt8ixRveJrs-aM7gvyI/edit?gid=1799665475#gid=1799665475");
    const sheet = ss.getSheetByName("GuestList");
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) return [];
    // Fetch all data including headers to keep indices simple
    const data = sheet.getRange(1, 1, lastRow, 11).getValues();
    const searchCode = accessCode.trim().toUpperCase();

    const family = [];
    // Start loop from 1 (second row) to skip headers
    for (let i = 1; i < data.length; i++) {
      if (data[i][6].toString().trim().toUpperCase() === searchCode) {
        const rsvpDholkiValue = data[i][7].toString().trim();
        const rsvpNikkahValue = data[i][8].toString().trim();
        const rsvpReceptionValue = data[i][9].toString().trim();
        family.push({
          rowIndex: i + 1, // Store the actual sheet row number
          name: data[i][1].toString().trim(),
          dholki: !!data[i][2],
          nikkah: !!data[i][3],
          reception: !!data[i][4],
          kidsRestricted: !!data[i][5],
          rsvp_dholki: rsvpDholkiValue === "Attending",
          rsvp_nikkah: rsvpNikkahValue === "Attending",
          rsvp_reception: rsvpReceptionValue === "Attending",
          rsvp_dholki_value: rsvpDholkiValue,
          rsvp_nikkah_value: rsvpNikkahValue,
          rsvp_reception_value: rsvpReceptionValue,
          hasExistingRSVP: Boolean(rsvpDholkiValue || rsvpNikkahValue || rsvpReceptionValue),
          dietary: data[i][10] ? data[i][10].toString() : ""
        });
      }
    }

    return family.length === 0 ? null : family;
  } catch (e) {
    console.error("Error: " + e.toString());
    return null;
  }
}

function submitRSVP(responses) {
  const ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1b7909KMT5MCpRfNR2ZEFWXMRYt8ixRveJrs-aM7gvyI/edit?gid=1799665475#gid=1799665475");
  const sheet = ss.getSheetByName("GuestList");
  
  const COL_RSVP_D = 8;
  const COL_RSVP_N = 9;
  const COL_RSVP_R = 10;
  const COL_DIETARY = 11;

  const dietaryNotes = responses['dietary_notes'] || "";
  
  // 'responses' now contains row IDs as keys (e.g., "row_5_active")
  // We extract the row numbers from the keys
  const processedRows = new Set();
  
  Object.keys(responses).forEach(key => {
    if (key.startsWith("row_") && key.endsWith("_active")) {
      const rowNum = parseInt(key.split("_")[1]);
      if (!processedRows.has(rowNum)) {
        sheet.getRange(rowNum, COL_RSVP_D).setValue(responses[`row_${rowNum}_dholki`] === "Attending" ? "Attending" : "Not Attending");
        sheet.getRange(rowNum, COL_RSVP_N).setValue(responses[`row_${rowNum}_nikkah`] === "Attending" ? "Attending" : "Not Attending");
        sheet.getRange(rowNum, COL_RSVP_R).setValue(responses[`row_${rowNum}_reception`] === "Attending" ? "Attending" : "Not Attending");
        sheet.getRange(rowNum, COL_DIETARY).setValue(dietaryNotes);
        processedRows.add(rowNum);
      }
    }
  });

  return "JazakAllah Khair! Your RSVP has been saved.";
}