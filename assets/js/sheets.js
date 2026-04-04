/**
 * Google Sheets lead capture via Apps Script Web App
 * REMPLACER SHEETS_ENDPOINT par l'URL de votre Web App deployee
 */
const SHEETS_ENDPOINT = 'https://script.google.com/macros/s/VOTRE_DEPLOY_ID/exec';

async function submitLead(email, perte, nb, heures, taux) {
  try {
    await fetch(SHEETS_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        perte: perte,
        nb: nb,
        heures: heures,
        taux: taux,
        date: new Date().toISOString(),
        source: 'calculateur'
      })
    });
    return true;
  } catch (e) {
    console.error('Lead submission failed:', e);
    return false;
  }
}
