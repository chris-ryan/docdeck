| Field name| Type | Description | Example | FHIR v 1.02 |
| ----------| ------ | ------------------ | -------- | ---- |
| id | integer | A patient identifier internal to the application | 10001 | Y |


# Table: patients

### Sample MongoDB BSON

```json
{
    "id" : "10001",
    "identifier":
        {
            "use": "usual",
            "label": "MRN-Communicare",
            "system": "urn:oid:2.16.840.1.113883.2.3.3.17",
            "value": "48076"
        },
    "active": true,
    "name": 
        {
            "use": "usual",
            "family": "Demo",
            "given": "Henry"
        }
    ,
    "gender": {
        "text": "Male"
    },
    "birthDate": new Date(1952, 8, 24),
    "managingOrganization": {
        "reference": "Organization/1",
        "display": "Alice Springs Base Hospital"
    }
}
```

last updated: 8/11/2016