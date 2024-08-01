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
		id: "observation-sbp",
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
		id: "observation-ph",
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
		id: "observation-rr",
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
					code: "9279-1",
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
	{
		resourceType: "Observation",
		id: "observation-fio2",
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
					code: "3150-0",
					display: "Inhaled oxygen concentration",
				},
			],
		},
		subject: {
			reference: "Patient/example-patient",
		},
		effectiveDateTime: "2024-07-29T00:00:00Z",
		valueQuantity: {
			value: 100,
			unit: "%",
			system: "http://unitsofmeasure.org",
			code: "%",
		},
	},
	{
		resourceType: "Observation",
		id: "observation-lactate",
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
					code: "2524-7",
					display: "Lactate [Moles/volume] in Blood",
				},
			],
		},
		subject: {
			reference: "Patient/example-patient",
		},
		effectiveDateTime: "2024-07-29T00:00:00Z",
		valueQuantity: {
			value: 7.2,
			unit: "mmol/L",
			system: "http://unitsofmeasure.org",
			code: "mmol/L",
		},
	},
	{
		resourceType: "Observation",
		id: "observation-po2",
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
					code: "2703-7",
					display: "Oxygen [Partial pressure] in Arterial blood",
				},
			],
		},
		subject: {
			reference: "Patient/example-patient",
		},
		effectiveDateTime: "2024-07-29T00:00:00Z",
		valueQuantity: {
			value: 150,
			unit: "mmHg",
			system: "http://unitsofmeasure.org",
			code: "mm[Hg]",
		},
	},
	{
		resourceType: "Observation",
		id: "observation-pco2",
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
					code: "2019-8",
					display:
						"Carbon dioxide [Partial pressure] in Arterial blood",
				},
			],
		},
		subject: {
			reference: "Patient/example-patient",
		},
		effectiveDateTime: "2024-07-29T00:00:00Z",
		valueQuantity: {
			value: 47,
			unit: "mmHg",
			system: "http://unitsofmeasure.org",
			code: "mm[Hg]",
		},
	},
	{
		resourceType: "Observation",
		id: "observation-hco3",
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
					code: "1963-8",
					display: "Bicarbonate [Moles/volume] in Blood",
				},
			],
		},
		subject: {
			reference: "Patient/example-patient",
		},
		effectiveDateTime: "2024-07-29T00:00:00Z",
		valueQuantity: {
			value: 19,
			unit: "mmol/L",
			system: "http://unitsofmeasure.org",
			code: "mmol/L",
		},
	},
]

export const testFhirCond = [
	{
		resourceType: "Condition",
		id: "condition-cad",
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
					code: "confirmed",
					display: "Confirmed",
				},
			],
		},
	},
	{
		resourceType: "Condition",
		id: "condition-chf",
		subject: {
			reference: "Patient/example-patient",
		},
		code: {
			coding: [
				{
					system: "http://snomed.info/sct",
					code: "10057000",
					display: "Chronic Heart Failure",
				},
			],
		},
		verificationStatus: {
			coding: [
				{
					system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
					code: "confirmed",
					display: "Confirmed",
				},
			],
		},
	},
	{
		resourceType: "Condition",
		id: "condition-cld",
		subject: {
			reference: "Patient/example-patient",
		},
		code: {
			coding: [
				{
					system: "http://snomed.info/sct",
					code: "91488009",
					display: "Chronic Lung Disease",
				},
			],
		},
		verificationStatus: {
			coding: [
				{
					system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
					code: "confirmed",
					display: "Confirmed",
				},
			],
		},
	},
	{
		resourceType: "Condition",
		id: "condition-pe",
		subject: {
			reference: "Patient/example-patient",
		},
		code: {
			coding: [
				{
					system: "http://snomed.info/sct",
					code: "233935004",
					display: "Pulmonary Embolism",
				},
			],
		},
		verificationStatus: {
			coding: [
				{
					system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
					code: "confirmed",
					display: "Confirmed",
				},
			],
		},
	},
	{
		resourceType: "Condition",
		id: "condition-aki",
		subject: {
			reference: "Patient/example-patient",
		},
		code: {
			coding: [
				{
					system: "http://snomed.info/sct",
					code: "13960000",
					display: "Acute Kidney Injury",
				},
			],
		},
		verificationStatus: {
			coding: [
				{
					system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
					code: "confirmed",
					display: "Confirmed",
				},
			],
		},
	},
]

export const testFhirProc = [
	{
		resourceType: "Procedure",
		id: "procedure-ecpr",
		subject: {
			reference: "Patient/example-patient",
		},
		code: {
			coding: [
				{
					system: "http://snomed.info/sct",
					code: "52870002",
					display: "Extracorporeal Cardiopulmonary Resuscitation",
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
	{
		resourceType: "Procedure",
		id: "procedure-rtt",
		subject: {
			reference: "Patient/example-patient",
		},
		code: {
			coding: [
				{
					system: "http://snomed.info/sct",
					code: "108241001",
					display: "Renal Replacement Therapy",
				},
			],
		},
		performedPeriod: {
			start: "2024-07-29T00:00:00Z",
			end: "2024-07-29T01:00:00Z",
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
