# Resource: Patients

| URL | HTTP Method | Description | Format |
| ----------| ------ | ------------------ | -------- |
| [base-url]/ImagingStudies/ | GET | Returns a list of all the Imaging Studies | JSON |
| [base-url]/ImagingStudies/ | POST | Creates an instance of an Imaging Study | JSON |
| [base-url]/patients/ | GET | Returns a list of all the patients | JSON |
| [base-url]/patients/ | POST | Creates an instance of a patient | JSON |
| [base-url]/patients/:patient.id | GET | Returns details of the patient with the matching id | JSON |
| [base-url]/patients/:patientID/photo | GET | Downloads a photo of the patient with the matching id | jpeg |
| [base-url]/patients/:patientID/photo | POST | Uploads a photo of the patient with the matching id | jpeg |

## Example request content

ImagingStudies - POST
```
{
    "id": "99991",
    "started": "2016-09-27T10:59:59",
    "patient": "10003",
    "referrer": "10001",
    "availability": "NEARLINE",
    "numberOfSeries": 0
}
```

last updated: 27-Sep-2016