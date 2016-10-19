# Collection: imagingStudies

FHIR reference: [Resource: ImagingStudy][1]

| Field name| Type | Description | Example | FHIR v 1.02 |
| ----------| ------ | ------------------ | -------- | ---- |
| id | integer | A study identifier internal to the application | 10000001 | Y |
| uid | integer | A study identifier internal to the application in OID format | 2.16.840.1.113883.2.3.99.10000001 | Y |
| started | dateTime | when the study was started | 2016-09-21T08:00:50.379Z | Y |
| patient | [reference][2] | A reference to a patient document | Patient/10001 | Y |
| order | [reference][3] | A reference to a diagnosticOrder document | Investigation/10000001 | Y |
| referrer | [reference][4] | A reference to the referring practitioner | Practitioner/10000001 | Y |
| availability | code | availability of the studies | ONLINE | Y |
| url | string | A url for retreiving the study | http://localhost:8080/wado?studyUID=1.3.6.1.4.1.25403.166563008443 | Y |
| numberOfSeries | integer | The number of series within the study | series {} | Y |
| series | child | The DICOM series subtype | series {} | Y |

### Child objects
| Field name| Type | Description | Example | FHIR v 1.02 |
| ----------| ------ | ------------------ | -------- | ---- |
| series.uid | integer | Series identifier | 0.9.2342.19200300.100 | Y |
| series.number | integer | Numeric identifier of the series | 2 | Y |
| series.modality | code | Type of Imaging Study | OP | Y |
| series.description | string | A human readable summary of the series | Fundus Photography | Y |
| series.numberOfInstances | integer | Number of images in the series | 7 | Y |
| series.availability | code | availability of the series | ONLINE | Y |
| series.url | string | A url for retreiving the series | http://localhost:8080/wado?studyUID=1.3.6.1.4.1.25403.166563008443 | Y |
| series.bodySite | code | anatomical part imaged | 410437008 | Y |
| series.laterality | code | side imaged (eg left or right) | RIGHT | Y |
| series.started | dateTime | The date and time the series was started | 2016-08-10T10:50:42.389Z | Y |
| series.instance | child | The DICOM instance subtype | instance {} | Y |
| series.instance.uid | oid | Instance identifier | 0.3.1001.19200300.100 | Y |
| series.instance.number | integer | Numeric identifier of the series | 001 | Y |
| series.instance.sopClass | oid | [DICOM SOP Class][5] | 1.2.840.10008.5.1.4.1.1.77.1.5.2 | Y |
| series.instance.title | string | Description of instance | OD-Central | Y |
| series.instance.content | reference | Reference to the file ObjectID | 51299e0881b8e10011000001 | Y |

### Codes
- **availability** : ONLINE | OFFLINE | NEARLINE | UNAVAILABLE
- **series.modality**: AR | IVOCT | KER | LEN | OAM | OCT | OP | OPM | OPR | OPV | OSS | SRF | VA | XC
- **series.bodySite**: See [SNOMED CT Body Structures][6]
- **series.laterality**: RIGHT | LEFT | BILATERAL

#### Sample MongoDB BSON

```json
{
    "id": "10000001",
    "uid": "2.16.840.1.113883.2.3.99.10000001",
    "started": "2016-08-10T10:50:42.389Z",
    "patient": {
        "reference": "Patient/10001",
    },
    "order": {
        "reference": "DiagOrder/1010111"
    },
    "referrer": {
        "reference": "Practioner/1000001"
    },
    "availability": "ONLINE",
    "url": "http://localhost:8080/wado?studyUID=1.3.6.1.4.1.25403.166563008443",
    "numberOfSeries": 6,
     "series": [{
        "id": "100",
        "uid": "0.9.2342.19200300.100",
        "number": 2,
        "modality": "OP",
        "description": "Ophthalmic Photography",
        "numberOfInstances": 7,
        "availability": "ONLINE",
        "url": "http://localhost:8080/wado?studyUID=1.3.6.1.4.1.25404.1348534534583",
        "bodySite": "410437008",
        "laterality": "RIGHT",
        "started": "2016-08-10T10:50:42.389Z",
        "instance": [{
             "id": "4301",
             "uid": "0.9.2342.20102020.100.4301",
             "number": "002",
             "sopClass": "1.2.840.10008.5.1.4.1.1.77.1.5.2",
             "centerLocation": {
                "x": 45,
                "y": -8
             },
             "title": "OD-Central",
             "content": "51299e0881b8e10011000001"
        }]
     }]
}
```

last updated: 25-Aug-2016
[1]: http://hl7.org/fhir/imagingstudy.html "fhir docs - ImagingStudy"
[2]: patients.html "DB schema - patients"
[3]: investigations.html "DB schema - investigations"
[4]: practitioners.html "DB schema - practitioners"
[5]: http://www.dicomlibrary.com/dicom/sop/ "DICOM SOP Classes"
[6]: http://browser.ihtsdotools.org/?perspective=full&conceptId1=371398005&edition=au-edition&release=v20150531&server=https://browser-aws-1.ihtsdotools.org/api/snomed&langRefset=32570271000036106 "IHTSDO SNOMED CT Browser"