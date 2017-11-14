# Database schema

## Collection overview

| Collection name | Description | Reference |
| ----------| ------ | ------------------ |
| imagingStudies  | A set of images acquired as part of an encounter | |
| organizations | A data-managing organization | |
| patients | C collection of patient details | |

## Collection UML

```
@startuml
!define Collection(name,desc) class name as "desc" << (C,#FFAAAA) >>
' we use bold for _id
' green color for unique
' and underscore for not_null
!define _id(x) <b>x</b>
!define unique(x) <color:green>x</color>
!define not_null(x) <u>x</u>
' other tags available:
' <i></i>
' <back:COLOR></color>, where color is a color name or html color code
' (#FFAACC)
' see: http://plantuml.com/classes.html#More
hide methods
hide stereotypes

' collections

Collection(organizations, "organizations\n(Data-managing organizations)") {
_id(_id) ObjectId
not_null(identifier) OBJECT
not_null(unique(name)) STRING
not_null(alias) STRING
}

Collection(patients, "patient\n(Unique patient instances)") {
_id(_id) ObjectId
not_null(identifier) OBJECT
not_null(active) BOOLEAN
not_null(user_id) INTEGER
birthDate DATE
not_null(managingOrganization) OBJECT 
}

' relationships
organizations --> patients
@enduml
```