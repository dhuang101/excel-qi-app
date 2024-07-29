export const testFhirPatient = {
	resourceType: "Patient",
	id: "example-patient",
	birthDate: "2006-01-01",
	extension: [
		{
			url: "http://hl7.org/fhir/StructureDefinition/bodyMassIndex",
			valueQuantity: {
				value: 28,
				unit: "kg/m2",
				system: "http://unitsofmeasure.org",
				code: "kg/m2",
			},
		},
	],
}

export const testFhirObs = [
	{
		resourceType: "Observation",
		id: "example-observation-1",
		status: "final",
		category: [
			{
				coding: [
					{
						system: "http://terminology.hl7.org/CodeSystem/observation-category",
						code: "vital-signs",
						display: "Vital Signs",
					},
				],
			},
		],
		code: {
			coding: [
				{
					system: "http://loinc.org",
					code: "8480-6",
					display: "Systolic Blood Pressure",
				},
			],
		},
		subject: {
			reference: "Patient/example-patient",
		},
		effectiveDateTime: "2024-07-29T00:00:00Z",
		valueQuantity: {
			value: 77,
			unit: "mmHg",
			system: "http://unitsofmeasure.org",
			code: "mm[Hg]",
		},
	},
	{
		resourceType: "Observation",
		id: "example-observation-2",
		status: "final",
		category: [
			{
				coding: [
					{
						system: "http://terminology.hl7.org/CodeSystem/observation-category",
						code: "laboratory",
						display: "Laboratory",
					},
				],
			},
		],
		code: {
			coding: [
				{
					system: "http://loinc.org",
					code: "2028-9",
					display: "pH of Arterial blood",
				},
			],
		},
		subject: {
			reference: "Patient/example-patient",
		},
		effectiveDateTime: "2024-07-29T00:00:00Z",
		valueQuantity: {
			value: 7.27,
			unit: "",
			system: "http://unitsofmeasure.org",
			code: "",
		},
	},
	{
		resourceType: "Observation",
		id: "example-observation-3",
		status: "final",
		category: [
			{
				coding: [
					{
						system: "http://terminology.hl7.org/CodeSystem/observation-category",
						code: "vital-signs",
						display: "Vital Signs",
					},
				],
			},
		],
		code: {
			coding: [
				{
					system: "http://loinc.org",
					code: "14743-9",
					display: "Respiratory rate",
				},
			],
		},
		subject: {
			reference: "Patient/example-patient",
		},
		effectiveDateTime: "2024-07-29T00:00:00Z",
		valueQuantity: {
			value: 12,
			unit: "/min",
			system: "http://unitsofmeasure.org",
			code: "/min",
		},
	},
]

export const testFhirCond = [
	{
		resourceType: "Condition",
		id: "example-condition-1",
		subject: {
			reference: "Patient/example-patient",
		},
		code: {
			coding: [
				{
					system: "http://snomed.info/sct",
					code: "53741008",
					display: "Coronary Artery Disease",
				},
			],
		},
		verificationStatus: {
			coding: [
				{
					system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
					code: "refuted",
					display: "Refuted",
				},
			],
		},
	},
]

export const testFhirProc = [
	{
		resourceType: "Procedure",
		id: "example-procedure-1",
		subject: {
			reference: "Patient/example-patient",
		},
		code: {
			coding: [
				{
					system: "http://snomed.info/sct",
					code: "52734007",
					display: "Cardiopulmonary resuscitation",
				},
			],
		},
		performedPeriod: {
			start: "2024-07-29T00:00:00Z",
			end: "2024-07-29T00:30:00Z",
		},
		outcome: {
			coding: [
				{
					system: "http://terminology.hl7.org/CodeSystem/procedure-outcome",
					code: "success",
					display: "Successful",
				},
			],
		},
	},
]
