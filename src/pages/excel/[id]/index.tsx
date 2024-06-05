import { testDetails } from "@/test-data/patientDetails"

function PatientSummary() {
	const details = testDetails

	return (
		<div className="flex flex-col w-2/3 justify-center items-center">
			<article className="mt-8 text-3xl font-bold">
				{testDetails.name}
			</article>
			<div className="flex flex-col w-full">
				<div className="flex flex-row mt-4 w-full">
					<div className="flex flex-col w-1/3">
						<article className="text-xl font-semibold ">
							Patient Details
						</article>
						<article>Gender: {testDetails.gender}</article>
						<article>
							Date of Birth: {testDetails.birthDate}
						</article>
						<article>Height: {testDetails.height}cm</article>
						<article>Weight: {testDetails.weight}kg</article>
					</div>
					<div className="flex flex-col w-1/3">
						<article className="text-xl font-semibold">
							Contact Information
						</article>
						<article>Phone: {testDetails.phone}</article>
						<article>Address: {testDetails.streetAddress}</article>
						<article>Suburb: {testDetails.suburb}</article>
						<article>Postcode: {testDetails.postcode}</article>
						<article>Site ID: {testDetails.siteId}</article>
					</div>
					<div className="flex flex-col w-1/3">
						<article className="text-xl font-semibold">
							Doctor Information
						</article>
						<article>Name: {testDetails.doctorName}</article>
						<article>Code: {testDetails.doctorCode}</article>
						<article>Phone: {testDetails.doctorPhone}</article>
					</div>
				</div>
				<div className="flex flex-row mt-4 w-full">
					<div className="flex flex-col w-1/3">
						<article className="text-xl font-semibold">
							Study Participation
						</article>
						<article>
							Blender:{" "}
							{Boolean(testDetails.blenderStudy).toString()}
						</article>
						<article>
							OBLEX: {Boolean(testDetails.oblexStudy).toString()}
						</article>
						<article>
							ECMO-Rehab:{" "}
							{Boolean(testDetails.ecmoStudy).toString()}
						</article>
						<article>
							COVID-Recovery:{" "}
							{Boolean(testDetails.covidStudy).toString()}
						</article>
						<div className="mt-2">
							<article className="font-semibold">
								ELSO Details
							</article>
							<article>ELSO ID: {testDetails.elsoId}</article>
							<article>
								Exported:{" "}
								{Boolean(testDetails.elsoExported).toString()}
							</article>
							<article>
								Full Dataset:{" "}
								{Boolean(
									testDetails.elsoFullDataset
								).toString()}
							</article>
						</div>
					</div>
					<div className="flex flex-col w-1/3">
						<article className="text-xl font-semibold">
							Hospital Admissions
						</article>
						<article>
							Admisssion Date: {testDetails.admissionDate}
						</article>
						<article>
							Admission Source: {testDetails.admissionSource}
						</article>
						<article>
							Inter-Hospital Transfers:{" "}
							{testDetails.interHospitalMoves}
						</article>
						<div className="mt-2">
							<article className="font-semibold">
								1st Admission
							</article>
							<article>
								First Hospital Admission Date:{" "}
								{testDetails.firstAdmissionDate}
							</article>
							<article>
								First Hospital Name:{" "}
								{testDetails.firstAdmissionName}
							</article>
							<article>
								Date of Transfer:{" "}
								{testDetails.firstAdmissionTransferDate}
							</article>
							<article>
								Mode of Transfer:{" "}
								{testDetails.firstAdmissionTransferMode}
							</article>
							<article>
								ICU Admission at First Site:{" "}
								{Boolean(
									testDetails.firstAdmissionIcu
								).toString()}
							</article>
							<article>
								ICU Admission Date:{" "}
								{testDetails.firstAdmissionIcuDate}
							</article>
							<article>
								Transfer to EXCEL Site:{" "}
								{Boolean(
									testDetails.firstAdmissionExcel
								).toString()}
							</article>
							<article>
								Transfer Site Name:{" "}
								{testDetails.firstAdmissionExcelSite}
							</article>
						</div>
						<div className="mt-2">
							<article className="font-semibold">
								2nd Admission
							</article>
							<article>
								Second Hospital Admission Date:{" "}
								{testDetails.secondAdmissionDate}
							</article>
							<article>
								Second Hospital Name:{" "}
								{testDetails.secondAdmissionName}
							</article>
						</div>
					</div>
					<div className="flex flex-col w-1/3">
						<article className="text-xl font-semibold">
							ICU Admission
						</article>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PatientSummary
