# Resource: Patients

| URL | HTTP Method | Description | Format |
| ----------| ------ | ------------------ | -------- |
| [base-url]/ImagingStudy/ | GET | Returns a list of all the Imaging Studies | JSON |
| [base-url]/ImagingStudy/ | POST | Creates an instance of an Imaging Study | JSON |
| [base-url]/ImagingStudy/:studyId | GET | Returns a specific Imaging Study | JSON |
| [base-url]/ImagingStudy/:studyId | DELETE | Deletes a specific Imaging Study | JSON |
| [base-url]/ImagingStudy/:studyId/photo | POST | Uploads a file to an imaging study | jpeg |
| [base-url]/ImagingStudy/:studyId/series/:seriesId/:instanceId | GET | Returns a specific Imaging Study image | JSON |
| [base-url]/ImagingStudy/:studyId/instance | POST | Creates a new imaging instance | JSON |
| [base-url]/patients/ | GET | Returns a list of all the patients | JSON |
| [base-url]/patients/ | POST | Creates an instance of a patient | JSON |
| [base-url]/patients/:patientId | GET | Returns details of the patient with the matching id | JSON |
| [base-url]/patients/:patientId | DELETE | Deletes the instance of the patient with the matching id | JSON |
| [base-url]/patients/:patientId/photo | GET | Downloads a photo of the patient with the matching id | jpeg |
| [base-url]/patients/:patientId/photo | POST | Uploads a photo of the patient with the matching id | jpeg |
| [base-url]/patients/:patientId/photo | DELETE | Deletes the photo of the patient with the matching id | JSON |
| [base-url]/patients/:patientId/ImagingStudy | GET | Returns a list of Imaging Studies for a patient | jpeg |

## Example request content

####ImagingStudies - POST
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

####ImagingStudy/:studyId/instance - POST
```
{
	"modality": "OP",
	"laterality": "LEFT",
	"instance": [{
		"sopClass": "1.2.840.10008.5.1.4.1.1.77.1.5.2",
		"type": "macular-centered",
		"title": "CENTRAL"
	}]
}
```
last updated: 21-Oct-2016