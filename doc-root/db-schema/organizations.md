# Collection: organizations

FHIR reference: [Resource: Organization][1]

| Field name| Type | Description | Example | FHIR v 1.02 |
| ----------| ------ | ------------------ | -------- | ---- |
| id | integer | An organization identifier internal to the application | 10000001 | Y |
| identifier | custom | An organization identifier internal to the application | identifier {} | Y |
| active | boolean | Whether the organization is in active use | true | Y |
| type | code | The type of organization | prov | Y |
| name | string | Name used for the organization | Sunrise Health Service | Y |
| address | custom | An address for the organization | address {} | Y |
| contact | child | A contact for the organization | contact {} | Y |

### Child and Custom objects
| Field name| Type | Description | Example | FHIR v 1.02 |
| ----------| ------ | ------------------ | -------- | ---- |
| address.type | code | type of location | both | Y |
| address.line | array | Street name and number etc | ["Level 1, 25 River St"] | Y |
| address.city | string | name of city/town/suburb | Katherine | Y |
| address.state | string | name of state | NT | Y |
| address.postalCode | string | Post code for area | 0851 | Y |
| address.country | string | Country | Australia | Y |
| contact.purpose | code | Type of contact | ADMIN | Y |
| contact.name | custom | Name of the contact | name {} | Y |
| contact.telecom | custom | Contact details | telecom {} | Y |
| contact.address | custom | An address for the contact | address {} | Y |
| contact.telecom.system | code | method of contact stored | email | Y |
| contact.telecom.value | string | the actual contact details | sabriggs@unimelb.edu.au | Y |
| contact.telecom.use | code | purpose of contact point | work | Y |
| contact.telecom.rank | integer | preferred order of use | 1 | Y |
| identifier.use | code | purpose of the identifier | usual | Y |
| identifier.type | code | type of identifier | UDI | Y |
| identifier.system | string | namespace of the identifier | urn:oid:2.16.804.1.113883.4.3.1 | Y |
| identifier.value | string | the unique value used to identify | 8003627396026523 | Y |
| identifier.assigner | string | the organisation that issued the identifer | Medicare | Y |

### Codes
- **type** : prov | dept | team | govt | ins | edu | reli | crs | cg | bus | other
- **address.type**: postal | physical | both
- **contact.purpose**: BILL | ADMIN | HR | PAYOR | PATINF | PRESS
- **contact.telecom.system**: phone | fax | email | pager | other
- **contact.telecom.use**: home | work | temp | old | mobile
- **identifier.use**: usual | official | temp | secondary
- **identifier.type**: UDI | SNO | SB | PLAC | FILL

#### Sample MongoDB BSON

```json
{
    "id" : "10000001",
    "identifier": {
        "use": "usual",
        "type": "both",
        "system": "urn:oid:2.16.804.1.113883.4.3.1",
        "value": "8003627396026523",
        "assigner": "Medicare"
    },
    "active": "true",
    "type": "prov",
    "name": "Sunrise Health Service",
    "address": {
        "type": "both",
        "line": ["Level 1, 25 River St"],
        "city": "Katherine",
        "state": "NT",
        "postalCode": "0851",
        "country": "Australia"
    },
    "contact": {
        "purpose": "ADMIN",
        "name": {
            "text": "Sharon Atkinson-Briggs",
            "family": "Atkinson-Briggs",
            "given": "Sharon",
            "prefix": "Ms",
            "suffix": NULL
        },
        "telecom": {
            "system": "email",
            "value": "sabriggs@unimelb.edu.au",
            "use": "work",
            "rank": 1
        },
        "address": {
            "type": "postal",
            "line": ["Sunrise Health Service", "Level 1, 25 River St"],
            "city": "Katherine",
            "state": "NT",
            "postalCode": "0851",
            "country": "Australia"
        }
     }
}
```

last updated: 14-Sep-2016
[1]: https://www.hl7.org/fhir/organization.html "fhir docs - Organization"