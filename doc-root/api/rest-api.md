# Resource: Patients

| HTTP Method| URL | Description | Format |
| ----------| ------ | ------------------ | -------- |
| GET | [base-url]/patients/ | Returns a list of all the patients | JSON |
| GET | [base-url]/patients/:patient.id | Returns details of the patient with the matching id | JSON |
| POST | [base-url]/patients/ | Creates an instance of a patient | JSON |
| POST | [base-url]/patients/photo/:patientID | Uploads a photo of the patient with the matching id | jpeg |


last updated: 15-Sep-2016