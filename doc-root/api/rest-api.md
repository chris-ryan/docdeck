# Resource: Patients

| URL | HTTP Method | Description | Format |
| ----------| ------ | ------------------ | -------- |
| [base-url]/patients/ | GET | Returns a list of all the patients | JSON |
| [base-url]/patients/ | POST | Creates an instance of a patient | JSON |
| [base-url]/patients/:patient.id | GET | Returns details of the patient with the matching id | JSON |
| [base-url]/patients/:patientID/photo | GET | Downloads a photo of the patient with the matching id | jpeg |
| [base-url]/patients/:patientID/photo | POST | Uploads a photo of the patient with the matching id | jpeg |


last updated: 15-Sep-2016