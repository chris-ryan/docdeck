FHIR reference: [resourceType: Encounter][1]

Document properties
| Field name| Type | Description | Example | FHIR v 1.02 |
| ----------| ------ | ------------------ | -------- | ---- |
| id | integer | An encounter identifier internal to the application | 10000021 | Y |
| status | code | An encounter identifier internal to the application | 10000021 | Y |
| statusHistory | array | An encounter identifier internal to the application | 10000021 | Y |

Codes
**status** : planned | arrived | in-progress | onleave | finished | cancelled

Arrays
**statusHistory** - a list of previous statuses - ```[{ "status": code, "period": period}]


# Collection: encounters

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
[1]: http://hl7.org/fhir/encounter.html "fhir docs - Encounter"